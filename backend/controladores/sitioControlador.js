const db = require('../modelos');
const { creado, ok, errorCliente } = require('../utilidades/respuestas');

const modulos = [
  {
    id: 'descubrimiento',
    titulo: 'Descubrimiento inteligente',
    descripcion: 'Historias, autores y temas ordenados para que el usuario encuentre contenido rapido.'
  },
  {
    id: 'comunidad',
    titulo: 'Comunidad viva',
    descripcion: 'Comentarios, seguimiento, guardados y perfiles listos para crecer con una base de datos real.'
  },
  {
    id: 'creadores',
    titulo: 'Herramientas para creadores',
    descripcion: 'Editor Markdown, borradores, etiquetas, imagenes y vista previa antes de publicar.'
  },
  {
    id: 'confianza',
    titulo: 'Confianza y privacidad',
    descripcion: 'Cookies, legales, soporte y rutas preparadas para OAuth con Google y Apple.'
  }
];

exports.salud = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    return ok(res, {
      datos: {
        api: 'online',
        baseDatos: 'conectada',
        version: '1.1.0',
        fecha: new Date().toISOString()
      }
    }, 'API operativa');
  } catch (error) {
    return res.status(503).json({
      exito: false,
      mensaje: 'La API responde, pero la base de datos no esta disponible'
    });
  }
};

exports.estadisticas = async (req, res) => {
  try {
    const [usuarios, publicaciones, comentarios, guardados] = await Promise.all([
      db.Usuario.count(),
      db.Publicacion.count({ where: { esBorrador: false } }),
      db.Comentario.count(),
      db.PublicacionGuardada.count()
    ]);

    return ok(res, {
      datos: {
        usuarios,
        publicaciones,
        comentarios,
        guardados,
        crecimiento: [
          { etiqueta: 'Lunes', valor: 38 },
          { etiqueta: 'Martes', valor: 52 },
          { etiqueta: 'Miercoles', valor: 67 },
          { etiqueta: 'Jueves', valor: 74 },
          { etiqueta: 'Viernes', valor: 91 }
        ]
      }
    }, 'Estadisticas cargadas');
  } catch (error) {
    console.error('Error al cargar estadisticas:', error);
    return res.status(500).json({ exito: false, mensaje: 'Error al cargar estadisticas' });
  }
};

exports.modulos = (req, res) => ok(res, { datos: modulos }, 'Modulos cargados');

exports.actividad = async (req, res) => {
  try {
    const publicaciones = await db.Publicacion.findAll({
      where: { esBorrador: false },
      include: [{ model: db.Usuario, as: 'autor', attributes: ['id', 'nombreUsuario', 'avatar'] }],
      limit: 6,
      order: [['fechaCreacion', 'DESC']]
    });

    return ok(res, {
      datos: publicaciones.map((publicacion) => ({
        id: publicacion.id,
        tipo: 'publicacion',
        titulo: publicacion.titulo,
        usuario: publicacion.autor?.nombreUsuario || 'Autor',
        fecha: publicacion.fechaCreacion
      }))
    }, 'Actividad cargada');
  } catch (error) {
    console.error('Error al cargar actividad:', error);
    return res.status(500).json({ exito: false, mensaje: 'Error al cargar actividad' });
  }
};

exports.notificacionesDemo = (req, res) => ok(res, {
  datos: [
    { id: 1, tipo: 'afinidad', titulo: 'Nuevo contenido para ti', texto: 'Hay historias nuevas parecidas a tus guardados.', leida: false },
    { id: 2, tipo: 'comunidad', titulo: 'Comunidad activa', texto: 'Los temas de diseno y tecnologia estan subiendo.', leida: false },
    { id: 3, tipo: 'producto', titulo: 'Tu espacio esta listo', texto: 'Completa tu perfil para mejorar recomendaciones.', leida: true }
  ]
}, 'Notificaciones cargadas');

exports.suscribirNewsletter = (req, res) => {
  const { correo } = req.body;
  if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
    return errorCliente(res, 'Escribe un correo valido');
  }

  return creado(res, {
    datos: {
      correo,
      segmento: 'lanzamiento'
    }
  }, 'Te has unido a la lista de novedades');
};

exports.enviarFeedback = (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  if (!mensaje || mensaje.trim().length < 10) {
    return errorCliente(res, 'El mensaje debe tener al menos 10 caracteres');
  }

  return creado(res, {
    datos: {
      nombre: nombre || 'Usuario Pixara',
      correo: correo || null,
      recibido: true
    }
  }, 'Feedback recibido');
};
