const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
const UsuarioMongo = require('../modelosMongo/UsuarioMongo');
const configuracionJWT = require('../configuracion/jwt');
const { validarRegistro, validarLogin } = require('../utilidades/validadores');

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';
const APPLE_AUTH_URL = 'https://appleid.apple.com/auth/authorize';
const APPLE_TOKEN_URL = 'https://appleid.apple.com/auth/token';

const estadoOauth = new Map();

function mongoDisponible(res) {
  if (mongoose.connection.readyState === 1) return true;

  res.status(503).json({
    exito: false,
    mensaje: 'MongoDB no esta conectado. Arranca MongoDB o revisa MONGODB_URI en backend/.env.'
  });

  return false;
}

function generarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id || usuario._id.toString(),
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo
    },
    configuracionJWT.secreto,
    { expiresIn: configuracionJWT.expiracion }
  );
}

function datosPublicos(usuario) {
  const datos = usuario.toJSON();
  return {
    id: datos.id,
    nombreUsuario: datos.nombreUsuario,
    correo: datos.correo,
    avatar: datos.avatar,
    biografia: datos.biografia,
    enlaces: datos.enlaces,
    rol: datos.rol,
    fechaCreacion: datos.fechaCreacion,
    totalSeguidores: 0,
    totalSiguiendo: 0,
    totalPublicaciones: 0
  };
}

function obtenerFrontendUrl() {
  return process.env.FRONTEND_URL || 'http://localhost:5173';
}

function obtenerCallbackUrl(proveedor) {
  if (proveedor === 'google') {
    return process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/autenticacion/oauth/callback';
  }

  return process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/api/autenticacion/oauth/callback';
}

function base64Url(buffer) {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function decodificarJwtSinVerificar(token) {
  const partes = String(token || '').split('.');
  if (partes.length < 2) return null;
  const payload = partes[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
}

function crearEstadoOauth(proveedor) {
  const estado = base64Url(crypto.randomBytes(24));
  estadoOauth.set(estado, { proveedor, creado: Date.now() });

  setTimeout(() => estadoOauth.delete(estado), 10 * 60 * 1000).unref?.();
  return estado;
}

function consumirEstadoOauth(estado) {
  const datos = estadoOauth.get(estado);
  estadoOauth.delete(estado);

  if (!datos) return null;
  if (Date.now() - datos.creado > 10 * 60 * 1000) return null;
  return datos;
}

function construirUrlError(mensaje) {
  const url = new URL('/oauth/callback', obtenerFrontendUrl());
  url.searchParams.set('error', mensaje);
  return url.toString();
}

function construirUrlSesion(usuario, token) {
  const url = new URL('/oauth/callback', obtenerFrontendUrl());
  url.searchParams.set('token', token);
  url.searchParams.set('usuario', base64Url(JSON.stringify(datosPublicos(usuario))));
  return url.toString();
}

function normalizarNombreUsuario(valor) {
  const base = String(valor || 'usuario')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24);

  return base.length >= 3 ? base : `pix${base}`.slice(0, 24);
}

async function generarNombreUsuarioUnico(nombreBase, correo) {
  const desdeCorreo = correo ? correo.split('@')[0] : '';
  const base = normalizarNombreUsuario(nombreBase || desdeCorreo || 'pixara');
  let candidato = base;
  let indice = 1;

  while (await UsuarioMongo.exists({ nombreUsuario: candidato })) {
    const sufijo = String(indice);
    candidato = `${base.slice(0, 24 - sufijo.length)}${sufijo}`;
    indice += 1;
  }

  return candidato;
}

async function crearOActualizarUsuarioOAuth({ proveedor, proveedorId, correo, nombre, avatar }) {
  const campoProveedor = proveedor === 'google' ? 'googleId' : 'appleId';
  let usuario = await UsuarioMongo.findOne({ [campoProveedor]: proveedorId });

  if (!usuario && correo) {
    usuario = await UsuarioMongo.findOne({ correo: correo.toLowerCase() });
  }

  if (usuario) {
    usuario[campoProveedor] = proveedorId;
    usuario.proveedorAuth = proveedor;
    if (avatar && !usuario.avatar) usuario.avatar = avatar;
    usuario.ultimoAcceso = new Date();
    await usuario.save();
    return usuario;
  }

  const nombreUsuario = await generarNombreUsuarioUnico(nombre, correo);
  usuario = await UsuarioMongo.create({
    nombreUsuario,
    correo: correo.toLowerCase(),
    contrasena: base64Url(crypto.randomBytes(32)),
    avatar: avatar || '',
    biografia: '',
    proveedorAuth: proveedor,
    [campoProveedor]: proveedorId,
    ultimoAcceso: new Date()
  });

  return usuario;
}

async function intercambiarCodigoGoogle(codigo) {
  const respuesta = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: codigo,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: obtenerCallbackUrl('google'),
      grant_type: 'authorization_code'
    })
  });

  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error_description || datos.error || 'Google no pudo iniciar sesion');

  const respuestaPerfil = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${datos.access_token}` }
  });
  const perfil = await respuestaPerfil.json();
  if (!respuestaPerfil.ok || !perfil?.sub || !perfil?.email) {
    throw new Error('Google no devolvio un perfil valido');
  }

  return {
    proveedor: 'google',
    proveedorId: perfil.sub,
    correo: perfil.email,
    nombre: perfil.name || perfil.email.split('@')[0],
    avatar: perfil.picture || ''
  };
}

function derFirmaAJose(firmaDer, longitud = 64) {
  const firma = Buffer.from(firmaDer);
  let offset = 0;

  if (firma[offset++] !== 0x30) throw new Error('Firma Apple invalida');
  const longitudSecuencia = firma[offset++];
  if (longitudSecuencia & 0x80) offset += longitudSecuencia & 0x7f;

  if (firma[offset++] !== 0x02) throw new Error('Firma Apple invalida');
  const longitudR = firma[offset++];
  let r = firma.slice(offset, offset + longitudR);
  offset += longitudR;

  if (firma[offset++] !== 0x02) throw new Error('Firma Apple invalida');
  const longitudS = firma[offset++];
  let s = firma.slice(offset, offset + longitudS);

  r = r[0] === 0 ? r.slice(1) : r;
  s = s[0] === 0 ? s.slice(1) : s;

  return Buffer.concat([
    Buffer.concat([Buffer.alloc(longitud / 2 - r.length), r]),
    Buffer.concat([Buffer.alloc(longitud / 2 - s.length), s])
  ]);
}

function crearClientSecretApple() {
  const clavePrivada = String(process.env.APPLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!process.env.APPLE_CLIENT_ID || !process.env.APPLE_TEAM_ID || !process.env.APPLE_KEY_ID || !clavePrivada) {
    throw new Error('Faltan credenciales de Apple en backend/.env');
  }

  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = base64Url(JSON.stringify({ alg: 'ES256', kid: process.env.APPLE_KEY_ID }));
  const payload = base64Url(JSON.stringify({
    iss: process.env.APPLE_TEAM_ID,
    iat: ahora,
    exp: ahora + 60 * 60,
    aud: 'https://appleid.apple.com',
    sub: process.env.APPLE_CLIENT_ID
  }));
  const contenido = `${cabecera}.${payload}`;
  const firmaDer = crypto.createSign('SHA256').update(contenido).end().sign(clavePrivada);
  return `${contenido}.${base64Url(derFirmaAJose(firmaDer))}`;
}

async function intercambiarCodigoApple(codigo) {
  const respuesta = await fetch(APPLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: codigo,
      client_id: process.env.APPLE_CLIENT_ID,
      client_secret: crearClientSecretApple(),
      redirect_uri: obtenerCallbackUrl('apple'),
      grant_type: 'authorization_code'
    })
  });

  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error_description || datos.error || 'Apple no pudo iniciar sesion');

  const perfil = decodificarJwtSinVerificar(datos.id_token);
  if (!perfil?.sub) throw new Error('Apple no devolvio un perfil valido');
  if (!perfil.email) throw new Error('Apple no devolvio correo. Elimina la autorizacion de Pixara en tu Apple ID e intentalo de nuevo.');

  return {
    proveedor: 'apple',
    proveedorId: perfil.sub,
    correo: perfil.email,
    nombre: perfil.email.split('@')[0],
    avatar: ''
  };
}

exports.registro = async (req, res) => {
  try {
    if (!mongoDisponible(res)) return;

    const { nombreUsuario, correo, contrasena } = req.body;
    const validacion = validarRegistro(req.body);

    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validacion',
        errores: validacion.errores
      });
    }

    const usuarioExistente = await UsuarioMongo.findOne({
      $or: [
        { nombreUsuario: nombreUsuario.trim() },
        { correo: correo.trim().toLowerCase() }
      ]
    });

    if (usuarioExistente) {
      const campo = usuarioExistente.correo === correo.trim().toLowerCase() ? 'correo' : 'nombre de usuario';
      return res.status(409).json({
        exito: false,
        mensaje: `Este ${campo} ya esta registrado`
      });
    }

    const usuario = await UsuarioMongo.create({
      nombreUsuario: nombreUsuario.trim(),
      correo: correo.trim().toLowerCase(),
      contrasena
    });

    const token = generarToken(usuario);

    return res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado correctamente',
      datos: {
        usuario: datosPublicos(usuario),
        token
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        exito: false,
        mensaje: 'El usuario o correo ya existe'
      });
    }

    console.error('Error en registro MongoDB:', error);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error al registrar usuario'
    });
  }
};

exports.login = async (req, res) => {
  try {
    if (!mongoDisponible(res)) return;

    const { identificador, contrasena } = req.body;
    const validacion = validarLogin(req.body);

    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validacion',
        errores: validacion.errores
      });
    }

    const usuario = await UsuarioMongo.findOne({
      $or: [
        { correo: identificador.trim().toLowerCase() },
        { nombreUsuario: identificador.trim() }
      ]
    }).select('+contrasena');

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    const contrasenaValida = await usuario.compararContrasena(contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    usuario.ultimoAcceso = new Date();
    await usuario.save();

    const token = generarToken(usuario);

    return res.json({
      exito: true,
      mensaje: 'Inicio de sesion correcto',
      datos: {
        usuario: datosPublicos(usuario),
        token
      }
    });
  } catch (error) {
    console.error('Error en login MongoDB:', error);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error al iniciar sesion'
    });
  }
};

exports.obtenerUsuarioActual = async (req, res) => {
  if (!mongoDisponible(res)) return;

  return res.json({
    exito: true,
    datos: datosPublicos(req.usuario)
  });
};

exports.obtenerUsuarioPorId = async (req, res) => {
  if (!mongoDisponible(res)) return;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      exito: false,
      mensaje: 'ID de usuario no valido'
    });
  }

  const usuario = await UsuarioMongo.findById(req.params.id);

  if (!usuario) {
    return res.status(404).json({
      exito: false,
      mensaje: 'Usuario no encontrado'
    });
  }

  return res.json({
    exito: true,
    datos: datosPublicos(usuario)
  });
};

exports.iniciarOAuth = (proveedor) => (req, res) => {
  try {
    if (proveedor === 'google' && (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)) {
      return res.redirect(construirUrlError('Faltan credenciales de Google en backend/.env'));
    }

    if (proveedor === 'apple' && (!process.env.APPLE_CLIENT_ID || !process.env.APPLE_TEAM_ID || !process.env.APPLE_KEY_ID || !process.env.APPLE_PRIVATE_KEY)) {
      return res.redirect(construirUrlError('Faltan credenciales de Apple en backend/.env'));
    }

    const estado = crearEstadoOauth(proveedor);

    if (proveedor === 'google') {
      const url = new URL(GOOGLE_AUTH_URL);
      url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
      url.searchParams.set('redirect_uri', obtenerCallbackUrl('google'));
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'openid email profile');
      url.searchParams.set('state', estado);
      url.searchParams.set('prompt', 'select_account');
      return res.redirect(url.toString());
    }

    const url = new URL(APPLE_AUTH_URL);
    url.searchParams.set('client_id', process.env.APPLE_CLIENT_ID);
    url.searchParams.set('redirect_uri', obtenerCallbackUrl('apple'));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('response_mode', 'form_post');
    url.searchParams.set('scope', 'name email');
    url.searchParams.set('state', estado);
    return res.redirect(url.toString());
  } catch (error) {
    return res.redirect(construirUrlError(error.message));
  }
};

exports.oauthCallback = async (req, res) => {
  try {
    if (!mongoDisponible(res)) return;

    const codigo = req.query.code || req.body?.code;
    const estado = req.query.state || req.body?.state;
    const errorProveedor = req.query.error || req.body?.error;

    if (errorProveedor) return res.redirect(construirUrlError(`OAuth cancelado: ${errorProveedor}`));
    if (!codigo || !estado) return res.redirect(construirUrlError('Respuesta OAuth incompleta'));

    const datosEstado = consumirEstadoOauth(estado);
    if (!datosEstado) return res.redirect(construirUrlError('Estado OAuth caducado. Intentalo de nuevo.'));

    const perfil = datosEstado.proveedor === 'google'
      ? await intercambiarCodigoGoogle(codigo)
      : await intercambiarCodigoApple(codigo);

    const usuario = await crearOActualizarUsuarioOAuth(perfil);
    const token = generarToken(usuario);
    return res.redirect(construirUrlSesion(usuario, token));
  } catch (error) {
    console.error('Error OAuth MongoDB:', error);
    return res.redirect(construirUrlError(error.message || 'Error al iniciar sesion con OAuth'));
  }
};
