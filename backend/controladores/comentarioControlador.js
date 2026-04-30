const db = require('../modelos');
const { validarComentario } = require('../utilidades/validadores');

/**
 * obtener comentarios de una publicacion
 * get /api/comentarios/publicacion/:publicacionId
 */
exports.obtenerComentarios = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const { pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;

    const comentarios = await db.Comentario.findAndCountAll({
      where: { publicacionId },
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id', 'nombreUsuario', 'avatar']
        }
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['fechaCreacion', 'DESC']]
    });

    res.json({
      exito: true,
      datos: comentarios.rows,
      total: comentarios.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(comentarios.count / limite)
    });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener comentarios'
    });
  }
};

/**
 * crear comentario
 * post /api/comentarios
 */
exports.crearComentario = async (req, res) => {
  try {
    const { publicacionId, contenido } = req.body;
    const usuarioId = req.usuario.id;

    // validar datos
    const validacion = validarComentario(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    // verificar que la publicacion existe
    const publicacion = await db.Publicacion.findByPk(publicacionId);
    if (!publicacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Publicación no encontrada'
      });
    }

    // crear comentario
    const comentario = await db.Comentario.create({
      usuarioId,
      publicacionId,
      contenido
    });

    // obtener comentario completo con usuario
    const comentarioCompleto = await db.Comentario.findByPk(comentario.id, {
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id', 'nombreUsuario', 'avatar']
        }
      ]
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Comentario creado exitosamente',
      datos: comentarioCompleto
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear comentario'
    });
  }
};

/**
 * actualizar comentario
 * put /api/comentarios/:id
 */
exports.actualizarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;
    const usuarioId = req.usuario.id;

    // validar datos
    const validacion = validarComentario(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    const comentario = await db.Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Comentario no encontrado'
      });
    }

    // verificar que sea el autor
    if (comentario.usuarioId !== usuarioId) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permiso para editar este comentario'
      });
    }

    // actualizar comentario
    await comentario.update({ contenido });

    // obtener comentario actualizado
    const comentarioActualizado = await db.Comentario.findByPk(id, {
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id', 'nombreUsuario', 'avatar']
        }
      ]
    });

    res.json({
      exito: true,
      mensaje: 'Comentario actualizado exitosamente',
      datos: comentarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar comentario'
    });
  }
};

/**
 * eliminar comentario
 * delete /api/comentarios/:id
 */
exports.eliminarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const comentario = await db.Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Comentario no encontrado'
      });
    }

    // verificar que sea el autor o el autor de la publicacion
    const publicacion = await db.Publicacion.findByPk(comentario.publicacionId);
    
    if (comentario.usuarioId !== usuarioId && publicacion.usuarioId !== usuarioId) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permiso para eliminar este comentario'
      });
    }

    await comentario.destroy();

    res.json({
      exito: true,
      mensaje: 'Comentario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar comentario'
    });
  }
};