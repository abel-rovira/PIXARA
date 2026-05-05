const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const UsuarioMongo = require('../modelosMongo/UsuarioMongo');
const PublicacionMongo = require('../modelosMongo/PublicacionMongo');
const SeguidorMongo = require('../modelosMongo/SeguidorMongo');
const configuracionJWT = require('../configuracion/jwt');
const { validarActualizacionPerfil, validarCambioContrasena } = require('../utilidades/validadores');

function mongoDisponible(res) {
  if (mongoose.connection.readyState === 1) return true;

  res.status(503).json({
    exito: false,
    mensaje: 'MongoDB no esta conectado. Arranca MongoDB o revisa MONGODB_URI en backend/.env.'
  });

  return false;
}

function datosPublicos(usuario) {
  const datos = usuario.toJSON();
  return {
    ...datos,
    totalSeguidores: 0,
    totalSiguiendo: 0,
    totalPublicaciones: 0
  };
}

function autorRespuesta(usuario) {
  return {
    id: usuario.id || usuario._id?.toString(),
    nombreUsuario: usuario.nombreUsuario,
    correo: usuario.correo,
    avatar: usuario.avatar,
    biografia: usuario.biografia
  };
}

function formatearPublicacionPerfil(publicacion) {
  const datos = publicacion.toJSON();
  return {
    ...datos,
    usuarioId: String(datos.usuarioId?._id || datos.usuarioId),
    autor: autorRespuesta(publicacion.usuarioId),
    etiquetas: (datos.etiquetas || []).map((nombre) => ({ id: nombre, nombre })),
    totalMeGustas: 0,
    totalComentarios: 0
  };
}

function eliminarArchivoAvatar(avatar) {
  if (!avatar || !avatar.startsWith('/uploads/')) return;

  const rutaAvatar = path.join(__dirname, '..', avatar);
  fs.promises.unlink(rutaAvatar).catch(() => {});
}

exports.buscarUsuarios = async (req, res) => {
  if (!mongoDisponible(res)) return;

  const { termino = '', pagina = 1, limite = 20 } = req.query;
  const limpio = termino.trim();

  if (!limpio) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Debe proporcionar un termino de busqueda'
    });
  }

  const filtro = {
    $or: [
      { nombreUsuario: { $regex: limpio, $options: 'i' } },
      { biografia: { $regex: limpio, $options: 'i' } }
    ]
  };
  const page = Number(pagina);
  const limit = Number(limite);
  const skip = (page - 1) * limit;

  const [usuarios, total] = await Promise.all([
    UsuarioMongo.find(filtro).skip(skip).limit(limit).sort({ fechaCreacion: -1 }),
    UsuarioMongo.countDocuments(filtro)
  ]);

  return res.json({
    exito: true,
    datos: usuarios.map(datosPublicos),
    total,
    pagina: page,
    totalPaginas: Math.max(1, Math.ceil(total / limit))
  });
};

exports.obtenerPerfil = async (req, res) => {
  if (!mongoDisponible(res)) return;

  let usuarioActualId = null;
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      usuarioActualId = jwt.verify(token, configuracionJWT.secreto).id;
    } catch {
      usuarioActualId = null;
    }
  }

  const usuario = await UsuarioMongo.findOne({ nombreUsuario: req.params.nombreUsuario });

  if (!usuario) {
    return res.status(404).json({
      exito: false,
      mensaje: 'Usuario no encontrado'
    });
  }

  const [publicaciones, totalPublicaciones, totalSeguidores, totalSiguiendo, sigueAlUsuario] = await Promise.all([
    PublicacionMongo.find({ usuarioId: usuario.id, esBorrador: false })
      .populate('usuarioId', 'nombreUsuario avatar biografia correo')
      .sort({ fechaCreacion: -1 })
      .limit(12),
    PublicacionMongo.countDocuments({ usuarioId: usuario.id, esBorrador: false }),
    SeguidorMongo.countDocuments({ seguidoId: usuario.id }),
    SeguidorMongo.countDocuments({ seguidorId: usuario.id }),
    usuarioActualId && usuarioActualId !== usuario.id
      ? SeguidorMongo.exists({ seguidorId: usuarioActualId, seguidoId: usuario.id })
      : null
  ]);

  return res.json({
    exito: true,
    datos: {
      ...datosPublicos(usuario),
      publicaciones: publicaciones.map(formatearPublicacionPerfil),
      totalSeguidores,
      totalSiguiendo,
      totalPublicaciones,
      sigueAlUsuario: Boolean(sigueAlUsuario),
      esPerfilPropio: Boolean(usuarioActualId && usuarioActualId === usuario.id)
    }
  });
};

exports.actualizarPerfil = async (req, res) => {
  if (!mongoDisponible(res)) return;

  const validacion = validarActualizacionPerfil(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Errores de validacion',
      errores: validacion.errores
    });
  }

  const actualizacion = {};
  if (req.body.nombreUsuario) actualizacion.nombreUsuario = req.body.nombreUsuario.trim();
  if (req.body.correo) actualizacion.correo = req.body.correo.trim().toLowerCase();
  if (req.body.biografia !== undefined) actualizacion.biografia = req.body.biografia;
  const usuarioActual = await UsuarioMongo.findById(req.usuario.id);
  if (req.file) {
    eliminarArchivoAvatar(usuarioActual.avatar);
    actualizacion.avatar = `/uploads/${req.file.filename}`;
  }

  const usuario = await UsuarioMongo.findByIdAndUpdate(req.usuario.id, actualizacion, {
    new: true,
    runValidators: true
  });

  return res.json({
    exito: true,
    mensaje: 'Perfil actualizado correctamente',
    datos: datosPublicos(usuario)
  });
};

exports.eliminarAvatar = async (req, res) => {
  if (!mongoDisponible(res)) return;

  const usuario = await UsuarioMongo.findById(req.usuario.id);
  if (!usuario) {
    return res.status(404).json({
      exito: false,
      mensaje: 'Usuario no encontrado'
    });
  }

  eliminarArchivoAvatar(usuario.avatar);
  usuario.avatar = '';
  await usuario.save();

  return res.json({
    exito: true,
    mensaje: 'Foto de perfil eliminada correctamente',
    datos: datosPublicos(usuario)
  });
};

exports.cambiarContrasena = async (req, res) => {
  if (!mongoDisponible(res)) return;

  const validacion = validarCambioContrasena(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Errores de validacion',
      errores: validacion.errores
    });
  }

  const usuario = await UsuarioMongo.findById(req.usuario.id).select('+contrasena');
  const contrasenaValida = await usuario.compararContrasena(req.body.contrasenaActual);

  if (!contrasenaValida) {
    return res.status(401).json({
      exito: false,
      mensaje: 'La contrasena actual es incorrecta'
    });
  }

  usuario.contrasena = req.body.nuevaContrasena;
  await usuario.save();

  return res.json({
    exito: true,
    mensaje: 'Contrasena actualizada correctamente'
  });
};
