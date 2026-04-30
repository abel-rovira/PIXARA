const db = require('../modelos');
const { validarActualizacionPerfil, validarCambioContrasena } = require('../utilidades/validadores');
const path = require('path');
const fs = require('fs');

/**
 * obtener perfil de usuario por nombre de usuario
 */
exports.obtenerPerfil = async (req, res) => {
  try {
    const { nombreUsuario } = req.params;
    const usuarioActualId = req.usuario?.id;

    const usuario = await db.Usuario.findOne({
      where: { nombreUsuario },
      attributes: { exclude: ['contrasena'] },
      include: [
        {
          model: db.Seguidor,
          as: 'seguidoresRelaciones',
          attributes: ['seguidorId']
        },
        {
          model: db.Seguidor,
          as: 'siguiendoRelaciones',
          attributes: ['seguidoId']
        },
        {
          model: db.Publicacion,
          as: 'publicaciones',
          where: { esBorrador: false },
          required: false,
          attributes: ['id', 'titulo', 'imagenes', 'fechaCreacion'],
          limit: 9,
          order: [['fechaCreacion', 'DESC']]
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    let sigueAlUsuario = false;
    if (usuarioActualId) {
      const seguimiento = await db.Seguidor.findOne({
        where: {
          seguidorId: usuarioActualId,
          seguidoId: usuario.id
        }
      });
      sigueAlUsuario = !!seguimiento;
    }

    res.json({
      exito: true,
      datos: {
        ...usuario.toJSON(),
        totalSeguidores: usuario.seguidoresRelaciones?.length || 0,
        totalSiguiendo: usuario.siguiendoRelaciones?.length || 0,
        totalPublicaciones: usuario.publicaciones?.length || 0,
        sigueAlUsuario,
        esPerfilPropio: usuarioActualId === usuario.id
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener perfil de usuario'
    });
  }
};

/**
 * actualizar perfil de usuario
 */
exports.actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nombreUsuario, biografia, enlaces, correo, usarAvatarPersonalizado } = req.body;

    const validacion = validarActualizacionPerfil(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    if (nombreUsuario) {
      const usuarioExistente = await db.Usuario.findOne({
        where: {
          nombreUsuario,
          id: { [db.Sequelize.Op.ne]: usuarioId }
        }
      });

      if (usuarioExistente) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Este nombre de usuario ya está en uso'
        });
      }
    }

    if (correo) {
      const correoExistente = await db.Usuario.findOne({
        where: {
          correo,
          id: { [db.Sequelize.Op.ne]: usuarioId }
        }
      });

      if (correoExistente) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Este correo electrónico ya está en uso'
        });
      }
    }

    const datosActualizacion = {};
    if (nombreUsuario) datosActualizacion.nombreUsuario = nombreUsuario;
    if (biografia !== undefined) datosActualizacion.biografia = biografia;
    if (enlaces) datosActualizacion.enlaces = JSON.parse(enlaces);
    if (correo) datosActualizacion.correo = correo;

    // Si hay avatar en el archivo subido
    if (req.file) {
      const usuarioActual = await db.Usuario.findByPk(usuarioId);
      
      // Eliminar avatar anterior si era personalizado
      if (usuarioActual.avatarPersonalizado && usuarioActual.avatar) {
        const oldAvatarPath = path.join(__dirname, '../../uploads', path.basename(usuarioActual.avatar));
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      datosActualizacion.avatar = `/uploads/${req.file.filename}`;
      datosActualizacion.avatarPersonalizado = true;
    } else if (usarAvatarPersonalizado === 'false') {
      // Volver al avatar por defecto
      const usuario = await db.Usuario.findByPk(usuarioId);
      datosActualizacion.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombreUsuario)}&background=random&size=150`;
      datosActualizacion.avatarPersonalizado = false;
    }

    await db.Usuario.update(datosActualizacion, {
      where: { id: usuarioId }
    });

    const usuarioActualizado = await db.Usuario.findByPk(usuarioId, {
      attributes: { exclude: ['contrasena'] }
    });

    res.json({
      exito: true,
      mensaje: 'Perfil actualizado exitosamente',
      datos: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar perfil'
    });
  }
};

/**
 * cambiar contrasena
 */
exports.cambiarContrasena = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { contrasenaActual, nuevaContrasena } = req.body;

    const validacion = validarCambioContrasena(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Errores de validación',
        errores: validacion.errores
      });
    }

    const usuario = await db.Usuario.findByPk(usuarioId);

    const contrasenaValida = await usuario.compararContrasena(contrasenaActual);
    if (!contrasenaValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'La contraseña actual es incorrecta'
      });
    }

    usuario.contrasena = nuevaContrasena;
    await usuario.save();

    res.json({
      exito: true,
      mensaje: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cambiar contraseña'
    });
  }
};

/**
 * buscar usuarios
 */
exports.buscarUsuarios = async (req, res) => {
  try {
    const { termino, pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;

    if (!termino || termino.trim() === '') {
      return res.status(400).json({
        exito: false,
        mensaje: 'Debe proporcionar un término de búsqueda'
      });
    }

    const usuarios = await db.Usuario.findAndCountAll({
      where: {
        [db.Sequelize.Op.or]: [
          { nombreUsuario: { [db.Sequelize.Op.like]: `%${termino}%` } },
          { biografia: { [db.Sequelize.Op.like]: `%${termino}%` } }
        ]
      },
      attributes: ['id', 'nombreUsuario', 'avatar', 'biografia'],
      limit: parseInt(limite),
      offset: parseInt(offset)
    });

    res.json({
      exito: true,
      datos: usuarios.rows,
      total: usuarios.count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(usuarios.count / limite)
    });
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al buscar usuarios'
    });
  }
};