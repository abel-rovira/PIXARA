const jwt = require('jsonwebtoken');
const db = require('../modelos');
const configuracionJWT = require('../configuracion/jwt');
const { validarRegistro, validarLogin } = require('../utilidades/validadores');

/**
 * generar token jwt
 */
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo
    },
    configuracionJWT.secreto,
    { expiresIn: configuracionJWT.expiracion }
  );
};

/**
 * registrar nuevo usuario
 * post /api/autenticacion/registro
 */
exports.registro = async (req, res) => {
  try {
    const { nombreUsuario, correo, contrasena } = req.body;

    // validar datos
    const validacion = validarRegistro(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    // verificar si el usuario ya existe
    const usuarioExistente = await db.Usuario.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { nombreUsuario },
          { correo }
        ]
      }
    });

    if (usuarioExistente) {
      const campoExistente = usuarioExistente.nombreUsuario === nombreUsuario 
        ? 'nombre de usuario' 
        : 'correo electrónico';
      
      return res.status(400).json({
        exito: false,
        mensaje: `Este ${campoExistente} ya está registrado`
      });
    }

    // crear usuario
    const nuevoUsuario = await db.Usuario.create({
      nombreUsuario,
      correo,
      contrasena
    });

    // generar token
    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      datos: {
        usuario: {
          id: nuevoUsuario.id,
          nombreUsuario: nuevoUsuario.nombreUsuario,
          correo: nuevoUsuario.correo,
          avatar: nuevoUsuario.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al registrar usuario'
    });
  }
};

/**
 * iniciar sesion
 * post /api/autenticacion/login
 */
exports.login = async (req, res) => {
  try {
    const { identificador, contrasena } = req.body;

    // validar datos
    const validacion = validarLogin(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    // buscar usuario por correo o nombre de usuario
    const usuario = await db.Usuario.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { correo: identificador },
          { nombreUsuario: identificador }
        ]
      }
    });

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // verificar contrasena
    const contrasenaValida = await usuario.compararContrasena(contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // generar token
    const token = generarToken(usuario);

    res.json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso',
      datos: {
        usuario: {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          correo: usuario.correo,
          avatar: usuario.avatar,
          biografia: usuario.biografia
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al iniciar sesión'
    });
  }
};

/**
 * obtener usuario actual (verificar token)
 * get /api/autenticacion/yo
 */
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = await db.Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['contrasena'] },
      include: [
        {
          model: db.Seguidor,
          as: 'seguidoresRelaciones',
          attributes: ['id']
        },
        {
          model: db.Seguidor,
          as: 'siguiendoRelaciones',
          attributes: ['id']
        }
      ]
    });

    res.json({
      exito: true,
      datos: {
        ...usuario.toJSON(),
        totalSeguidores: usuario.seguidoresRelaciones?.length || 0,
        totalSiguiendo: usuario.siguiendoRelaciones?.length || 0
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener datos del usuario'
    });
  }
};

/**
 * iniciar oauth social
 * get /api/autenticacion/google
 * get /api/autenticacion/apple
 */
exports.iniciarOAuth = (proveedor) => (req, res) => {
  const configuracionPorProveedor = {
    google: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL'],
    apple: ['APPLE_CLIENT_ID', 'APPLE_TEAM_ID', 'APPLE_KEY_ID', 'APPLE_PRIVATE_KEY', 'APPLE_CALLBACK_URL']
  };

  const requeridas = configuracionPorProveedor[proveedor] || [];
  const faltantes = requeridas.filter((clave) => !process.env[clave]);

  if (faltantes.length > 0) {
    return res.status(501).json({
      exito: false,
      mensaje: `OAuth con ${proveedor} esta preparado, pero faltan credenciales en .env.`,
      faltantes
    });
  }

  return res.status(501).json({
    exito: false,
    mensaje: `OAuth con ${proveedor} esta listo para conectar el intercambio de codigo por token.`
  });
};

/**
 * callback oauth social
 * get /api/autenticacion/oauth/callback
 */
exports.oauthCallback = (req, res) => {
  res.status(501).json({
    exito: false,
    mensaje: 'Callback OAuth preparado. Falta completar el intercambio de codigo por token.'
  });
};

exports.verificarToken = require('../middlewares/autenticacion');
