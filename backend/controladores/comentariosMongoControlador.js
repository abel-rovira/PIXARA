const mongoose = require('mongoose');
const ComentarioMongo = require('../modelosMongo/ComentarioMongo');
const PublicacionMongo = require('../modelosMongo/PublicacionMongo');

function autorRespuesta(usuario) {
  return {
    id: usuario.id || usuario._id?.toString(),
    nombreUsuario: usuario.nombreUsuario,
    avatar: usuario.avatar,
    biografia: usuario.biografia
  };
}

exports.crear = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ exito: false, mensaje: 'MongoDB no esta conectado.' });
  }

  const { publicacionId, contenido } = req.body;
  if (!mongoose.Types.ObjectId.isValid(publicacionId)) {
    return res.status(400).json({ exito: false, mensaje: 'Publicacion no valida' });
  }
  if (!contenido || !contenido.trim()) {
    return res.status(400).json({ exito: false, mensaje: 'El comentario no puede estar vacio' });
  }

  const publicacion = await PublicacionMongo.findById(publicacionId);
  if (!publicacion) return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });

  const comentario = await ComentarioMongo.create({
    publicacionId,
    usuarioId: req.usuario.id,
    contenido: contenido.trim()
  });
  await comentario.populate('usuarioId', 'nombreUsuario avatar biografia correo');

  return res.status(201).json({
    exito: true,
    mensaje: 'Comentario creado correctamente',
    datos: {
      id: comentario._id.toString(),
      contenido: comentario.contenido,
      fechaCreacion: comentario.fechaCreacion,
      usuario: autorRespuesta(comentario.usuarioId)
    }
  });
};
