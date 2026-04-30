const jwt = require('jsonwebtoken');
const configuracionJWT = require('../configuracion/jwt');
const db = require('../modelos');

const autenticacion = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Acceso denegado. No se proporcionó token de autenticación'
      });
    }

    const decodificado = jwt.verify(token, configuracionJWT.secreto);

    const usuario = await db.Usuario.findByPk(decodificado.id, {
      attributes: { exclude: ['contrasena'] }
    });

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido. Usuario no encontrado'
      });
    }

    req.usuario = usuario;
    req.token = token;

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token expirado'
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: 'Error en la autenticación'
    });
  }
};

const autenticacionOpcional = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decodificado = jwt.verify(token, configuracionJWT.secreto);
      const usuario = await db.Usuario.findByPk(decodificado.id, {
        attributes: { exclude: ['contrasena'] }
      });

      if (usuario) {
        req.usuario = usuario;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = autenticacion;
module.exports.autenticacionOpcional = autenticacionOpcional;
