const mongoose = require('mongoose');
const PublicacionMongo = require('../modelosMongo/PublicacionMongo');
const ComentarioMongo = require('../modelosMongo/ComentarioMongo');
const MeGustaMongo = require('../modelosMongo/MeGustaMongo');
const GuardadoMongo = require('../modelosMongo/GuardadoMongo');
const SeguidorMongo = require('../modelosMongo/SeguidorMongo');

function mongoDisponible(res) {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({ exito: false, mensaje: 'MongoDB no esta conectado.' });
  return false;
}

function normalizarEtiquetas(etiquetas) {
  if (!etiquetas) return [];
  const base = Array.isArray(etiquetas) ? etiquetas : String(etiquetas).split(/[\s,]+/);
  return [
    ...new Set(
      base
        .map((item) => String(item).trim().replace(/^#+/, '').toLowerCase())
        .filter(Boolean)
    )
  ].slice(0, 10);
}

function etiquetasRespuesta(etiquetas = []) {
  return etiquetas.map((nombre) => ({ id: nombre, nombre }));
}

function autorRespuesta(autor) {
  if (!autor) return null;
  return {
    id: autor.id || autor._id?.toString(),
    nombreUsuario: autor.nombreUsuario,
    correo: autor.correo,
    avatar: autor.avatar,
    biografia: autor.biografia
  };
}

async function formatearPublicacion(publicacion, usuarioId = null, incluirComentarios = false) {
  const [totalMeGustas, totalComentarios, meGusta, guardada, comentarios] = await Promise.all([
    MeGustaMongo.countDocuments({ publicacionId: publicacion._id }),
    ComentarioMongo.countDocuments({ publicacionId: publicacion._id }),
    usuarioId ? MeGustaMongo.exists({ publicacionId: publicacion._id, usuarioId }) : null,
    usuarioId ? GuardadoMongo.exists({ publicacionId: publicacion._id, usuarioId }) : null,
    incluirComentarios
      ? ComentarioMongo.find({ publicacionId: publicacion._id })
        .populate('usuarioId', 'nombreUsuario avatar biografia correo')
        .sort({ fechaCreacion: -1 })
      : []
  ]);

  const datos = publicacion.toJSON();
  return {
    ...datos,
    usuarioId: String(datos.usuarioId?._id || datos.usuarioId),
    autor: autorRespuesta(publicacion.usuarioId),
    etiquetas: etiquetasRespuesta(datos.etiquetas),
    totalMeGustas,
    totalComentarios,
    leGusta: Boolean(meGusta),
    guardada: Boolean(guardada),
    comentarios: comentarios.map((comentario) => ({
      id: comentario._id.toString(),
      contenido: comentario.contenido,
      fechaCreacion: comentario.fechaCreacion,
      usuario: autorRespuesta(comentario.usuarioId)
    }))
  };
}

exports.obtenerTodas = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const { pagina = 1, limite = 9 } = req.query;
  const page = Number(pagina);
  const limit = Number(limite);
  const skip = (page - 1) * limit;
  const usuarioId = req.usuario?.id;

  const filtro = { esBorrador: false };
  const [items, total] = await Promise.all([
    PublicacionMongo.find(filtro).populate('usuarioId', 'nombreUsuario avatar biografia correo').sort({ fechaCreacion: -1 }).skip(skip).limit(limit),
    PublicacionMongo.countDocuments(filtro)
  ]);

  const datos = await Promise.all(items.map((item) => formatearPublicacion(item, usuarioId)));
  return res.json({ exito: true, datos, total, pagina: page, totalPaginas: Math.max(1, Math.ceil(total / limit)) });
};

exports.obtenerFeed = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const intereses = normalizarEtiquetas(req.query.intereses);

  if (!intereses.length) return exports.obtenerTodas(req, res);

  const expresiones = intereses.map((interes) => new RegExp(interes, 'i'));
  const filtro = {
    esBorrador: false,
    $or: [
      { etiquetas: { $in: intereses } },
      { titulo: { $in: expresiones } },
      { contenido: { $in: expresiones } }
    ]
  };

  const items = await PublicacionMongo.find(filtro)
    .populate('usuarioId', 'nombreUsuario avatar biografia correo')
    .sort({ fechaCreacion: -1 })
    .limit(30);

  if (!items.length) return exports.obtenerTodas(req, res);

  const datos = await Promise.all(items.map((item) => formatearPublicacion(item, req.usuario?.id)));
  return res.json({ exito: true, datos, total: datos.length, pagina: 1, totalPaginas: 1 });
};

exports.obtenerTrending = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const items = await PublicacionMongo.find({ esBorrador: false })
    .populate('usuarioId', 'nombreUsuario avatar biografia correo')
    .sort({ fechaCreacion: -1 })
    .limit(20);
  const datos = await Promise.all(items.map((item) => formatearPublicacion(item, req.usuario?.id)));
  datos.sort((a, b) => ((b.totalMeGustas || 0) + (b.totalComentarios || 0) * 2) - ((a.totalMeGustas || 0) + (a.totalComentarios || 0) * 2));
  return res.json({ exito: true, datos });
};

exports.obtenerSiguiendo = async (req, res) => {
  if (!mongoDisponible(res)) return;

  const relaciones = await SeguidorMongo.find({ seguidorId: req.usuario.id }).select('seguidoId');
  const seguidos = relaciones.map((relacion) => relacion.seguidoId);

  if (!seguidos.length) {
    return res.json({ exito: true, datos: [], total: 0, pagina: 1, totalPaginas: 1 });
  }

  const items = await PublicacionMongo.find({ usuarioId: { $in: seguidos }, esBorrador: false })
    .populate('usuarioId', 'nombreUsuario avatar biografia correo')
    .sort({ fechaCreacion: -1 })
    .limit(30);

  const datos = await Promise.all(items.map((item) => formatearPublicacion(item, req.usuario.id)));
  return res.json({ exito: true, datos, total: datos.length, pagina: 1, totalPaginas: 1 });
};

exports.buscar = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const termino = String(req.query.termino || '').trim();
  if (!termino) return res.status(400).json({ exito: false, mensaje: 'Debe proporcionar un termino de busqueda' });

  const filtro = {
    esBorrador: false,
    $or: [
      { titulo: { $regex: termino, $options: 'i' } },
      { contenido: { $regex: termino, $options: 'i' } },
      { etiquetas: { $regex: termino, $options: 'i' } }
    ]
  };
  const items = await PublicacionMongo.find(filtro).populate('usuarioId', 'nombreUsuario avatar biografia correo').sort({ fechaCreacion: -1 }).limit(30);
  const datos = await Promise.all(items.map((item) => formatearPublicacion(item, req.usuario?.id)));
  return res.json({ exito: true, datos, total: datos.length, pagina: 1, totalPaginas: 1 });
};

exports.obtenerPorId = async (req, res) => {
  if (!mongoDisponible(res)) return;
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });
  }

  let usuarioId = null;
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const configuracionJWT = require('../configuracion/jwt');
      usuarioId = jwt.verify(token, configuracionJWT.secreto).id;
    } catch {
      usuarioId = null;
    }
  }

  const publicacion = await PublicacionMongo.findById(req.params.id).populate('usuarioId', 'nombreUsuario avatar biografia correo');
  if (!publicacion) return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });
  if (publicacion.esBorrador && String(publicacion.usuarioId._id || publicacion.usuarioId) !== String(usuarioId)) {
    return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });
  }

  const datos = await formatearPublicacion(publicacion, usuarioId, true);
  return res.json({ exito: true, datos });
};

exports.crear = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const { titulo, contenido, esBorrador } = req.body;

  if (!titulo || !contenido || titulo.trim().length < 3 || contenido.trim().length < 10) {
    return res.status(400).json({ exito: false, mensaje: 'Titulo y contenido son obligatorios' });
  }

  const imagenes = req.files?.map((file) => `/uploads/${file.filename}`) || [];
  const publicacion = await PublicacionMongo.create({
    usuarioId: req.usuario.id,
    titulo: titulo.trim(),
    contenido: contenido.trim(),
    etiquetas: normalizarEtiquetas(req.body.etiquetas),
    imagenes,
    esBorrador: esBorrador === 'true' || esBorrador === true
  });

  await publicacion.populate('usuarioId', 'nombreUsuario avatar biografia correo');
  const datos = await formatearPublicacion(publicacion, req.usuario.id);
  return res.status(201).json({ exito: true, mensaje: 'Publicacion creada correctamente', datos });
};

exports.actualizar = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const publicacion = await PublicacionMongo.findById(req.params.id);
  if (!publicacion) return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });
  if (String(publicacion.usuarioId) !== String(req.usuario.id)) return res.status(403).json({ exito: false, mensaje: 'No tienes permiso para editar esta publicacion' });

  if (req.body.titulo) publicacion.titulo = req.body.titulo.trim();
  if (req.body.contenido) publicacion.contenido = req.body.contenido.trim();
  if (req.body.etiquetas !== undefined) publicacion.etiquetas = normalizarEtiquetas(req.body.etiquetas);
  if (req.body.esBorrador !== undefined) publicacion.esBorrador = req.body.esBorrador === 'true' || req.body.esBorrador === true;
  const nuevasImagenes = req.files?.map((file) => `/uploads/${file.filename}`) || [];
  publicacion.imagenes = [...publicacion.imagenes, ...nuevasImagenes];
  await publicacion.save();
  await publicacion.populate('usuarioId', 'nombreUsuario avatar biografia correo');
  const datos = await formatearPublicacion(publicacion, req.usuario.id);
  return res.json({ exito: true, mensaje: 'Publicacion actualizada correctamente', datos });
};

exports.eliminar = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const publicacion = await PublicacionMongo.findById(req.params.id);
  if (!publicacion) return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });
  if (String(publicacion.usuarioId) !== String(req.usuario.id)) return res.status(403).json({ exito: false, mensaje: 'No tienes permiso para eliminar esta publicacion' });

  await Promise.all([
    PublicacionMongo.deleteOne({ _id: publicacion._id }),
    ComentarioMongo.deleteMany({ publicacionId: publicacion._id }),
    MeGustaMongo.deleteMany({ publicacionId: publicacion._id }),
    GuardadoMongo.deleteMany({ publicacionId: publicacion._id })
  ]);
  return res.json({ exito: true, mensaje: 'Publicacion eliminada correctamente' });
};

exports.darMeGusta = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const publicacion = await PublicacionMongo.findById(req.params.id);
  if (!publicacion) return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });

  const existente = await MeGustaMongo.findOne({ publicacionId: publicacion._id, usuarioId: req.usuario.id });
  if (existente) {
    await existente.deleteOne();
    return res.json({ exito: true, mensaje: 'Me gusta eliminado', leGusta: false });
  }

  await MeGustaMongo.create({ publicacionId: publicacion._id, usuarioId: req.usuario.id });
  return res.json({ exito: true, mensaje: 'Me gusta agregado', leGusta: true });
};

exports.guardar = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const publicacion = await PublicacionMongo.findById(req.params.id);
  if (!publicacion) return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });

  const existente = await GuardadoMongo.findOne({ publicacionId: publicacion._id, usuarioId: req.usuario.id });
  if (existente) {
    await existente.deleteOne();
    return res.json({ exito: true, mensaje: 'Publicacion eliminada de guardados', guardada: false });
  }

  await GuardadoMongo.create({ publicacionId: publicacion._id, usuarioId: req.usuario.id });
  return res.json({ exito: true, mensaje: 'Publicacion guardada', guardada: true });
};

exports.obtenerGuardadas = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const guardados = await GuardadoMongo.find({ usuarioId: req.usuario.id }).populate({
    path: 'publicacionId',
    populate: { path: 'usuarioId', select: 'nombreUsuario avatar biografia correo' }
  }).sort({ fechaCreacion: -1 });
  const datos = await Promise.all(guardados.filter((item) => item.publicacionId).map((item) => formatearPublicacion(item.publicacionId, req.usuario.id)));
  return res.json({ exito: true, datos });
};

exports.obtenerBorradores = async (req, res) => {
  if (!mongoDisponible(res)) return;
  const items = await PublicacionMongo.find({ usuarioId: req.usuario.id, esBorrador: true }).populate('usuarioId', 'nombreUsuario avatar biografia correo').sort({ fechaActualizacion: -1 });
  const datos = await Promise.all(items.map((item) => formatearPublicacion(item, req.usuario.id)));
  return res.json({ exito: true, datos });
};
