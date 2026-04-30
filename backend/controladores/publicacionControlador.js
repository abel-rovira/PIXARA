const db = require('../modelos');
const { validarPublicacion } = require('../utilidades/validadores');
const { normalizarEtiquetas } = require('../utilidades/validadores');
const { Op } = require('sequelize');

/**
 * obtener todas las publicaciones (feed global)
 */
exports.obtenerTodasPublicaciones = async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;
    const usuarioId = req.usuario?.id;

    const publicaciones = await db.Publicacion.findAndCountAll({
      where: { esBorrador: false },
      include: [
        {
          model: db.Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar']
        },
        {
          model: db.Etiqueta,
          as: 'etiquetas',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        },
        {
          model: db.MeGusta,
          as: 'meGustas',
          attributes: ['id', 'usuarioId']
        },
        {
          model: db.Comentario,
          as: 'comentarios',
          attributes: ['id']
        }
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']],
      distinct: true
    });

    const publicacionesFormateadas = publicaciones.rows.map(pub => {
      const leGusta = usuarioId ? pub.meGustas.some(mg => mg.usuarioId === usuarioId) : false;
      
      return {
        ...pub.toJSON(),
        totalMeGustas: pub.meGustas.length,
        totalComentarios: pub.comentarios.length,
        leGusta
      };
    });

    res.json({
      exito: true,
      datos: publicacionesFormateadas,
      total: publicaciones.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(publicaciones.count / limite)
    });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener publicaciones'
    });
  }
};

/**
 * obtener feed personalizado
 */
exports.obtenerFeedPersonalizado = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;

    const seguimientos = await db.Seguidor.findAll({
      where: { seguidorId: usuarioId },
      attributes: ['seguidoId']
    });

    const idsUsuariosSeguidos = seguimientos.map(s => s.seguidoId);
    idsUsuariosSeguidos.push(usuarioId);

    const publicaciones = await db.Publicacion.findAndCountAll({
      where: {
        esBorrador: false,
        usuarioId: { [Op.in]: idsUsuariosSeguidos }
      },
      include: [
        {
          model: db.Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar']
        },
        {
          model: db.Etiqueta,
          as: 'etiquetas',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        },
        {
          model: db.MeGusta,
          as: 'meGustas',
          attributes: ['id', 'usuarioId']
        },
        {
          model: db.Comentario,
          as: 'comentarios',
          attributes: ['id']
        }
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']],
      distinct: true
    });

    const publicacionesFormateadas = publicaciones.rows.map(pub => {
      const leGusta = pub.meGustas.some(mg => mg.usuarioId === usuarioId);
      
      return {
        ...pub.toJSON(),
        totalMeGustas: pub.meGustas.length,
        totalComentarios: pub.comentarios.length,
        leGusta
      };
    });

    res.json({
      exito: true,
      datos: publicacionesFormateadas,
      total: publicaciones.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(publicaciones.count / limite)
    });
  } catch (error) {
    console.error('Error al obtener feed personalizado:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener feed personalizado'
    });
  }
};

/**
 * obtener trending
 */
exports.obtenerTrending = async (req, res) => {
  try {
    const publicaciones = await db.Publicacion.findAll({
      where: { esBorrador: false },
      include: [
        {
          model: db.Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar']
        },
        {
          model: db.MeGusta,
          as: 'meGustas',
          attributes: ['id']
        },
        {
          model: db.Comentario,
          as: 'comentarios',
          attributes: ['id']
        }
      ],
      limit: 20,
      order: [
        [db.sequelize.literal('(SELECT COUNT(*) FROM me_gusta WHERE me_gusta.publicacion_id = Publicacion.id)'), 'DESC']
      ]
    });

    const publicacionesFormateadas = publicaciones.map(pub => ({
      ...pub.toJSON(),
      totalMeGustas: pub.meGustas.length,
      totalComentarios: pub.comentarios.length
    }));

    res.json({
      exito: true,
      datos: publicacionesFormateadas
    });
  } catch (error) {
    console.error('Error al obtener trending:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener trending'
    });
  }
};

/**
 * buscar publicaciones - CORREGIDO
 */
/**
 * buscar publicaciones - CORREGIDO
 */
exports.buscarPublicaciones = async (req, res) => {
  try {
    const { termino, pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;

    if (!termino || termino.trim() === '') {
      return res.status(400).json({
        exito: false,
        mensaje: 'Debe proporcionar un término de búsqueda'
      });
    }

    const publicaciones = await db.Publicacion.findAndCountAll({
      where: {
        esBorrador: false,
        [Op.or]: [
          { titulo: { [Op.like]: `%${termino}%` } },
          { contenido: { [Op.like]: `%${termino}%` } }
        ]
      },
      include: [
        {
          model: db.Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar']
        }
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']]
    });

    res.json({
      exito: true,
      datos: publicaciones.rows,
      total: publicaciones.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(publicaciones.count / limite)
    });
  } catch (error) {
    console.error('Error al buscar publicaciones:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al buscar publicaciones'
    });
  }
};

/**
 * obtener publicacion por id
 */
exports.obtenerPublicacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?.id;

    const publicacion = await db.Publicacion.findByPk(id, {
      include: [
        {
          model: db.Usuario,
          as: 'autor',
          attributes: ['id', 'nombreUsuario', 'avatar', 'biografia']
        },
        {
          model: db.Etiqueta,
          as: 'etiquetas',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        },
        {
          model: db.MeGusta,
          as: 'meGustas',
          attributes: ['id', 'usuarioId']
        },
        {
          model: db.Comentario,
          as: 'comentarios',
          include: [
            {
              model: db.Usuario,
              as: 'usuario',
              attributes: ['id', 'nombreUsuario', 'avatar']
            }
          ],
          order: [['fechaCreacion', 'DESC']]
        }
      ]
    });

    if (!publicacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Publicación no encontrada'
      });
    }

    const leGusta = usuarioId ? publicacion.meGustas.some(mg => mg.usuarioId === usuarioId) : false;

    res.json({
      exito: true,
      datos: {
        ...publicacion.toJSON(),
        totalMeGustas: publicacion.meGustas.length,
        totalComentarios: publicacion.comentarios.length,
        leGusta
      }
    });
  } catch (error) {
    console.error('Error al obtener publicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener publicación'
    });
  }
};

/**
 * crear publicacion
 */
exports.crearPublicacion = async (req, res) => {
  try {
    const { titulo, contenido, etiquetas, esBorrador } = req.body;
    const usuarioId = req.usuario.id;

    const validacion = validarPublicacion(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    const imagenes = req.files?.map(file => `/uploads/${file.filename}`) || [];

    const publicacion = await db.Publicacion.create({
      usuarioId,
      titulo,
      contenido,
      imagenes,
      esBorrador: esBorrador === 'true' || esBorrador === true
    });

    if (etiquetas) {
      let etiquetasArray = [];
      
      if (typeof etiquetas === 'string') {
        try {
          etiquetasArray = JSON.parse(etiquetas);
        } catch {
          etiquetasArray = etiquetas.split(',').map(e => e.trim());
        }
      } else if (Array.isArray(etiquetas)) {
        etiquetasArray = etiquetas;
      }

      const etiquetasNormalizadas = normalizarEtiquetas(etiquetasArray);

      for (const nombreEtiqueta of etiquetasNormalizadas) {
        const [etiqueta] = await db.Etiqueta.findOrCreate({
          where: { nombre: nombreEtiqueta.toLowerCase() }
        });
        await publicacion.addEtiqueta(etiqueta);
      }
    }

    const publicacionCompleta = await db.Publicacion.findByPk(publicacion.id, {
      include: [
        { model: db.Usuario, as: 'autor', attributes: ['id', 'nombreUsuario', 'avatar'] },
        { model: db.Etiqueta, as: 'etiquetas', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ]
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Publicación creada exitosamente',
      datos: publicacionCompleta
    });
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear publicación'
    });
  }
};

/**
 * actualizar publicacion
 */
exports.actualizarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, etiquetas, esBorrador } = req.body;
    const usuarioId = req.usuario.id;
    
    const publicacion = await db.Publicacion.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Publicación no encontrada'
      });
    }

    if (publicacion.usuarioId !== usuarioId) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permiso para editar esta publicación'
      });
    }

    const validacion = validarPublicacion(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    const nuevasImagenes = req.files?.map(file => `/uploads/${file.filename}`) || [];
    const imagenesActuales = Array.isArray(publicacion.imagenes) ? publicacion.imagenes : [];

    await publicacion.update({
      titulo,
      contenido,
      imagenes: nuevasImagenes.length > 0 ? [...imagenesActuales, ...nuevasImagenes] : imagenesActuales,
      esBorrador: esBorrador === 'true' || esBorrador === true
    });

    if (etiquetas) {
      let etiquetasArray = [];
      
      if (typeof etiquetas === 'string') {
        try {
          etiquetasArray = JSON.parse(etiquetas);
        } catch {
          etiquetasArray = etiquetas.split(',').map(e => e.trim());
        }
      } else if (Array.isArray(etiquetas)) {
        etiquetasArray = etiquetas;
      }

      const etiquetasNormalizadas = normalizarEtiquetas(etiquetasArray);

      await publicacion.setEtiquetas([]);

      for (const nombreEtiqueta of etiquetasNormalizadas) {
        const [etiqueta] = await db.Etiqueta.findOrCreate({
          where: { nombre: nombreEtiqueta.toLowerCase() }
        });
        await publicacion.addEtiqueta(etiqueta);
      }
    }

    const publicacionActualizada = await db.Publicacion.findByPk(id, {
      include: [
        { model: db.Usuario, as: 'autor', attributes: ['id', 'nombreUsuario', 'avatar'] },
        { model: db.Etiqueta, as: 'etiquetas', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ]
    });

    res.json({
      exito: true,
      mensaje: 'Publicación actualizada exitosamente',
      datos: publicacionActualizada
    });
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar publicación'
    });
  }
};

/**
 * eliminar publicacion
 */
exports.eliminarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const publicacion = await db.Publicacion.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Publicación no encontrada'
      });
    }

    if (publicacion.usuarioId !== usuarioId) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permiso para eliminar esta publicación'
      });
    }

    await publicacion.destroy();

    res.json({
      exito: true,
      mensaje: 'Publicación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar publicación'
    });
  }
};

/**
 * dar me gusta
 */
exports.darMeGusta = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const publicacion = await db.Publicacion.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Publicación no encontrada'
      });
    }

    const meGustaExistente = await db.MeGusta.findOne({
      where: {
        usuarioId,
        publicacionId: id
      }
    });

    if (meGustaExistente) {
      await meGustaExistente.destroy();
      return res.json({
        exito: true,
        mensaje: 'Me gusta eliminado',
        leGusta: false
      });
    } else {
      await db.MeGusta.create({
        usuarioId,
        publicacionId: id
      });
      return res.json({
        exito: true,
        mensaje: 'Me gusta agregado',
        leGusta: true
      });
    }
  } catch (error) {
    console.error('Error al dar me gusta:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al dar me gusta'
    });
  }
};

/**
 * guardar publicacion
 */
exports.guardarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const publicacion = await db.Publicacion.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Publicación no encontrada'
      });
    }

    const guardadoExistente = await db.PublicacionGuardada.findOne({
      where: {
        usuarioId,
        publicacionId: id
      }
    });

    if (guardadoExistente) {
      await guardadoExistente.destroy();
      return res.json({
        exito: true,
        mensaje: 'Publicación eliminada de guardados',
        guardada: false
      });
    } else {
      await db.PublicacionGuardada.create({
        usuarioId,
        publicacionId: id
      });
      return res.json({
        exito: true,
        mensaje: 'Publicación guardada',
        guardada: true
      });
    }
  } catch (error) {
    console.error('Error al guardar publicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al guardar publicación'
    });
  }
};


/**
 * obtener publicaciones guardadas por el usuario
 */
exports.obtenerGuardadas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const guardadas = await db.PublicacionGuardada.findAll({
      where: { usuarioId },
      include: [
        {
          model: db.Publicacion,
          as: 'publicacion',
          include: [
            { model: db.Usuario, as: 'autor', attributes: ['id', 'nombreUsuario', 'avatar'] },
            { model: db.Etiqueta, as: 'etiquetas', attributes: ['id', 'nombre'], through: { attributes: [] } },
            { model: db.MeGusta, as: 'meGustas', attributes: ['id'] },
            { model: db.Comentario, as: 'comentarios', attributes: ['id'] }
          ]
        }
      ],
      order: [['fechaCreacion', 'DESC']]
    });

    res.json({
      exito: true,
      datos: guardadas
        .filter((item) => item.publicacion && !item.publicacion.esBorrador)
        .map((item) => ({
          ...item.publicacion.toJSON(),
          totalMeGustas: item.publicacion.meGustas?.length || 0,
          totalComentarios: item.publicacion.comentarios?.length || 0,
          guardada: true
        }))
    });
  } catch (error) {
    console.error('Error al obtener guardadas:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener publicaciones guardadas'
    });
  }
};

/**
 * obtener borradores del usuario
 */
exports.obtenerBorradores = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const borradores = await db.Publicacion.findAll({
      where: { usuarioId, esBorrador: true },
      include: [
        { model: db.Usuario, as: 'autor', attributes: ['id', 'nombreUsuario', 'avatar'] },
        { model: db.Etiqueta, as: 'etiquetas', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ],
      order: [['fechaActualizacion', 'DESC']]
    });

    res.json({
      exito: true,
      datos: borradores
    });
  } catch (error) {
    console.error('Error al obtener borradores:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener borradores'
    });
  }
};

