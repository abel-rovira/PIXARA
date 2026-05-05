const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const configuracionJWT = require('../configuracion/jwt');
const UsuarioMongo = require('../modelosMongo/UsuarioMongo');

async function autenticacionMongo(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        exito: false,
        mensaje: 'MongoDB no esta conectado. Arranca MongoDB o revisa MONGODB_URI.'
      });
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Acceso denegado. No se proporciono token de autenticacion'
      });
    }

    const decodificado = jwt.verify(token, configuracionJWT.secreto);
    const usuario = await UsuarioMongo.findById(decodificado.id);

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token invalido. Usuario no encontrado'
      });
    }

    req.usuario = usuario;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ exito: false, mensaje: 'Token expirado' });
    }

    return res.status(401).json({ exito: false, mensaje: 'Token invalido' });
  }
}

module.exports = autenticacionMongo;
