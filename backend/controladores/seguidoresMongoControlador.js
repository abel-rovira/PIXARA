const mongoose = require('mongoose');
const SeguidorMongo = require('../modelosMongo/SeguidorMongo');
const UsuarioMongo = require('../modelosMongo/UsuarioMongo');

function mongoDisponible(res) {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({ exito: false, mensaje: 'MongoDB no esta conectado.' });
  return false;
}

exports.seguir = async (req, res) => {
  if (!mongoDisponible(res)) return;
  if (String(req.usuario.id) === String(req.params.id)) {
    return res.status(400).json({ exito: false, mensaje: 'No puedes seguirte a ti mismo' });
  }
  const usuario = await UsuarioMongo.findById(req.params.id);
  if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
  await SeguidorMongo.findOneAndUpdate(
    { seguidorId: req.usuario.id, seguidoId: req.params.id },
    { seguidorId: req.usuario.id, seguidoId: req.params.id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return res.json({ exito: true, mensaje: 'Usuario seguido' });
};

exports.dejarSeguir = async (req, res) => {
  if (!mongoDisponible(res)) return;
  await SeguidorMongo.deleteOne({ seguidorId: req.usuario.id, seguidoId: req.params.id });
  return res.json({ exito: true, mensaje: 'Has dejado de seguir al usuario' });
};

function limpiarUsuario(usuario) {
  if (!usuario) return null;
  const datos = usuario.toJSON ? usuario.toJSON() : usuario;
  delete datos.correo;
  delete datos.rol;
  delete datos.proveedorAuth;
  delete datos.ultimoAcceso;
  return datos;
}

exports.listarSeguidores = async (req, res) => {
  if (!mongoDisponible(res)) return;

  const usuario = await UsuarioMongo.findById(req.params.id).select('_id');
  if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });

  const relaciones = await SeguidorMongo.find({ seguidoId: req.params.id })
    .sort({ fechaCreacion: -1 })
    .populate('seguidorId', 'nombreUsuario avatar biografia fechaCreacion')
    .lean();

  return res.json({
    exito: true,
    datos: relaciones.map((relacion) => limpiarUsuario(relacion.seguidorId)).filter(Boolean)
  });
};

exports.listarSiguiendo = async (req, res) => {
  if (!mongoDisponible(res)) return;

  const usuario = await UsuarioMongo.findById(req.params.id).select('_id');
  if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });

  const relaciones = await SeguidorMongo.find({ seguidorId: req.params.id })
    .sort({ fechaCreacion: -1 })
    .populate('seguidoId', 'nombreUsuario avatar biografia fechaCreacion')
    .lean();

  return res.json({
    exito: true,
    datos: relaciones.map((relacion) => limpiarUsuario(relacion.seguidoId)).filter(Boolean)
  });
};
