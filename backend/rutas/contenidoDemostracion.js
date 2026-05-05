const express = require('express');
const router = express.Router();
const Usuario = require('../modelosMongo/UsuarioMongo');
const Publicacion = require('../modelosMongo/PublicacionMongo');
const Comentario = require('../modelosMongo/ComentarioMongo');
const Guardado = require('../modelosMongo/GuardadoMongo');

const usuarioContenido = {
  id: 'contenido-demo',
  nombreUsuario: 'pixara',
  correo: 'contenido@pixara.local',
  avatar: '',
  biografia: 'Contenido editorial de ejemplo para Pixara.'
};

const publicaciones = [
  {
    id: 'demo-1',
    titulo: 'Haz match con historias que si van contigo',
    contenido: 'Descubre textos, autores y conversaciones segun tus gustos reales. Pixara ordena el contenido para que leer vuelva a tener intencion.',
    imagenes: [],
    totalMeGustas: 128,
    totalComentarios: 24,
    fechaCreacion: new Date().toISOString(),
    autor: usuarioContenido,
    etiquetas: [{ id: 1, nombre: 'match' }, { id: 2, nombre: 'descubrir' }],
    comentarios: []
  },
  {
    id: 'demo-2',
    titulo: 'Una forma mas social de leer',
    contenido: 'Guarda lo que te interesa, comenta ideas y conecta con autores que escriben como tu piensas.',
    imagenes: [],
    totalMeGustas: 93,
    totalComentarios: 18,
    fechaCreacion: new Date().toISOString(),
    autor: { ...usuarioContenido, nombreUsuario: 'afinidad' },
    etiquetas: [{ id: 3, nombre: 'social' }, { id: 4, nombre: 'lectura' }],
    comentarios: []
  },
  {
    id: 'demo-3',
    titulo: 'Menos feed infinito. Mas intencion.',
    contenido: 'Un espacio limpio para elegir que leer, a quien seguir y que conversaciones merecen tu tiempo.',
    imagenes: [],
    totalMeGustas: 211,
    totalComentarios: 37,
    fechaCreacion: new Date().toISOString(),
    autor: usuarioContenido,
    etiquetas: [{ id: 5, nombre: 'criterio' }, { id: 6, nombre: 'comunidad' }],
    comentarios: []
  }
];

function paginar(datos, pagina = 1, limite = 9) {
  const page = Number(pagina);
  const limit = Number(limite);
  const inicio = (page - 1) * limit;
  return {
    datos: datos.slice(inicio, inicio + limit),
    total: datos.length,
    pagina: page,
    totalPaginas: Math.max(1, Math.ceil(datos.length / limit))
  };
}

router.get('/sitio/salud', (req, res) => {
  res.json({
    exito: true,
    mensaje: 'API operativa',
    datos: {
      api: 'online',
      baseDatos: 'mongodb para usuarios, publicaciones, comentarios y seguidores',
      version: '1.1.0',
      fecha: new Date().toISOString()
    }
  });
});

router.get('/sitio/estadisticas', async (req, res) => {
  try {
    const inicioSemana = new Date();
    inicioSemana.setHours(0, 0, 0, 0);
    inicioSemana.setDate(inicioSemana.getDate() - 4);

    const [usuarios, publicacionesPublicas, comentarios, guardados, crecimientoPublicaciones] = await Promise.all([
      Usuario.countDocuments(),
      Publicacion.countDocuments({ esBorrador: false }),
      Comentario.countDocuments(),
      Guardado.countDocuments(),
      Publicacion.aggregate([
        { $match: { esBorrador: false, fechaCreacion: { $gte: inicioSemana } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$fechaCreacion',
                timezone: 'Europe/Madrid'
              }
            },
            valor: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const crecimiento = Array.from({ length: 5 }, (_, indice) => {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + indice);
      const clave = fecha.toISOString().slice(0, 10);
      const dia = crecimientoPublicaciones.find((item) => item._id === clave);
      return {
        etiqueta: diasSemana[fecha.getDay()],
        valor: dia?.valor || 0
      };
    });

    res.json({
      exito: true,
      mensaje: 'Estadisticas cargadas',
      datos: {
        usuarios,
        publicaciones: publicacionesPublicas,
        comentarios,
        guardados,
        crecimiento
      }
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'No se pudieron cargar las estadisticas',
      error: error.message
    });
  }
});

router.get('/sitio/modulos', (req, res) => {
  res.json({
    exito: true,
    datos: [
      { id: 'descubrimiento', titulo: 'Descubrimiento inteligente', descripcion: 'Historias y autores ordenados por afinidad.' },
      { id: 'comunidad', titulo: 'Comunidad viva', descripcion: 'Comentarios, seguidores, guardados y perfiles.' },
      { id: 'creadores', titulo: 'Herramientas para creadores', descripcion: 'Editor, borradores, etiquetas y vista previa.' },
      { id: 'confianza', titulo: 'Confianza y privacidad', descripcion: 'Cookies, legales y OAuth preparado.' }
    ]
  });
});

router.get('/sitio/actividad', (req, res) => {
  res.json({
    exito: true,
    datos: publicaciones.map((publicacion) => ({
      id: publicacion.id,
      tipo: 'publicacion',
      titulo: publicacion.titulo,
      usuario: publicacion.autor.nombreUsuario,
      fecha: publicacion.fechaCreacion
    }))
  });
});

router.get('/sitio/notificaciones', (req, res) => {
  res.json({
    exito: true,
    datos: [
      { id: 1, tipo: 'afinidad', titulo: 'Nuevo contenido para ti', texto: 'Hay historias nuevas parecidas a tus guardados.', leida: false },
      { id: 2, tipo: 'comunidad', titulo: 'Comunidad activa', texto: 'Los temas de diseño y tecnología están subiendo.', leida: false },
      { id: 3, tipo: 'producto', titulo: 'Tu espacio está listo', texto: 'Completa tu perfil para mejorar recomendaciones.', leida: true }
    ]
  });
});

router.post('/sitio/newsletter', (req, res) => {
  if (!req.body.correo) return res.status(400).json({ exito: false, mensaje: 'Escribe un correo valido' });
  return res.status(201).json({ exito: true, mensaje: 'Te has unido a la lista de novedades', datos: { correo: req.body.correo } });
});

router.post('/sitio/feedback', (req, res) => {
  if (!req.body.mensaje || req.body.mensaje.length < 10) {
    return res.status(400).json({ exito: false, mensaje: 'El mensaje debe tener al menos 10 caracteres' });
  }
  return res.status(201).json({ exito: true, mensaje: 'Feedback recibido', datos: { recibido: true } });
});

module.exports = router;
