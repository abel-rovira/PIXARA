const db = require('../modelos');

/**
 * seguir a un usuario
 * post /api/seguidores/seguir/:usuarioId
 */
exports.seguirUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const seguidorId = req.usuario.id;

    // no puede seguirse a si mismo
    if (parseInt(usuarioId) === seguidorId) {
      return res.status(400).json({
        exito: false,
        mensaje: 'No puedes seguirte a ti mismo'
      });
    }

    // verificar que el usuario a seguir existe
    const usuarioASeguir = await db.Usuario.findByPk(usuarioId);
    if (!usuarioASeguir) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // verificar si ya lo sigue
    const seguimientoExistente = await db.Seguidor.findOne({
      where: {
        seguidorId,
        seguidoId: usuarioId
      }
    });

    if (seguimientoExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Ya sigues a este usuario'
      });
    }

    // crear seguimiento
    await db.Seguidor.create({
      seguidorId,
      seguidoId: usuarioId
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Ahora sigues a este usuario',
      siguiendo: true
    });
  } catch (error) {
    console.error('Error al seguir usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al seguir usuario'
    });
  }
};

/**
 * dejar de seguir a un usuario
 * delete /api/seguidores/dejar-seguir/:usuarioId
 */
exports.dejarDeSeguir = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const seguidorId = req.usuario.id;

    const seguimiento = await db.Seguidor.findOne({
      where: {
        seguidorId,
        seguidoId: usuarioId
      }
    });

    if (!seguimiento) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No sigues a este usuario'
      });
    }

    await seguimiento.destroy();

    res.json({
      exito: true,
      mensaje: 'Has dejado de seguir a este usuario',
      siguiendo: false
    });
  } catch (error) {
    console.error('Error al dejar de seguir:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al dejar de seguir usuario'
    });
  }
};

/**
 * obtener seguidores de un usuario
 * get /api/seguidores/:usuarioId/seguidores
 */
exports.obtenerSeguidores = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;

    const seguidores = await db.Seguidor.findAndCountAll({
      where: { seguidoId: usuarioId },
      include: [
        {
          model: db.Usuario,
          as: 'seguidor',
          attributes: ['id', 'nombreUsuario', 'avatar', 'biografia']
        }
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']]
    });

    const seguidoresFormateados = seguidores.rows.map(s => s.seguidor);

    res.json({
      exito: true,
      datos: seguidoresFormateados,
      total: seguidores.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(seguidores.count / limite)
    });
  } catch (error) {
    console.error('Error al obtener seguidores:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener seguidores'
    });
  }
};

/**
 * obtener usuarios seguidos
 * get /api/seguidores/:usuarioId/siguiendo
 */
exports.obtenerSiguiendo = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;

    const siguiendo = await db.Seguidor.findAndCountAll({
      where: { seguidorId: usuarioId },
      include: [
        {
          model: db.Usuario,
          as: 'seguido',
          attributes: ['id', 'nombreUsuario', 'avatar', 'biografia']
        }
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']]
    });

    const siguiendoFormateado = siguiendo.rows.map(s => s.seguido);

    res.json({
      exito: true,
      datos: siguiendoFormateado,
      total: siguiendo.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(siguiendo.count / limite)
    });
  } catch (error) {
    console.error('Error al obtener siguiendo:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener usuarios seguidos'
    });
  }
};

/**
 * verificar si un usuario sigue a otro
 * get /api/seguidores/verificar/:usuarioId
 */
exports.verificarSeguimiento = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const seguidorId = req.usuario.id;

    const seguimiento = await db.Seguidor.findOne({
      where: {
        seguidorId,
        seguidoId: usuarioId
      }
    });

    res.json({
      exito: true,
      siguiendo: !!seguimiento
    });
  } catch (error) {
    console.error('Error al verificar seguimiento:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al verificar seguimiento'
    });
  }
};