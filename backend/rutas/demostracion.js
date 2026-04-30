const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secreto = process.env.JWT_SECRET || process.env.JWT_SECRETO || 'pixara_demo_secret';

const usuarioDemo = {
  id: 1,
  nombreUsuario: 'pixara',
  correo: 'demo@pixara.local',
  avatar: '',
  biografia: 'Cuenta demo para probar Pixara sin base de datos.',
  totalSeguidores: 128,
  totalSiguiendo: 42,
  totalPublicaciones: 3,
  esPerfilPropio: true
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
    autor: usuarioDemo,
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
    autor: { ...usuarioDemo, nombreUsuario: 'afinidad' },
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
    autor: usuarioDemo,
    etiquetas: [{ id: 5, nombre: 'criterio' }, { id: 6, nombre: 'comunidad' }],
    comentarios: []
  }
];

function tokenDemo(usuario = usuarioDemo) {
  return jwt.sign({ id: usuario.id, nombreUsuario: usuario.nombreUsuario, correo: usuario.correo }, secreto, { expiresIn: '7d' });
}

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

router.post('/autenticacion/login', (req, res) => {
  res.json({
    exito: true,
    mensaje: 'Sesion demo iniciada',
    datos: { usuario: usuarioDemo, token: tokenDemo() }
  });
});

router.post('/autenticacion/registro', (req, res) => {
  const usuario = {
    ...usuarioDemo,
    nombreUsuario: req.body.nombreUsuario || 'nuevo_usuario',
    correo: req.body.correo || 'nuevo@pixara.local'
  };
  res.status(201).json({
    exito: true,
    mensaje: 'Cuenta demo creada',
    datos: { usuario, token: tokenDemo(usuario) }
  });
});

router.get('/autenticacion/yo', (req, res) => {
  res.json({ exito: true, datos: usuarioDemo });
});

router.get('/autenticacion/google', (req, res) => {
  res.status(501).json({ exito: false, mensaje: 'Google OAuth esta preparado. Falta conectar credenciales reales.' });
});

router.get('/autenticacion/apple', (req, res) => {
  res.status(501).json({ exito: false, mensaje: 'Apple OAuth esta preparado. Falta conectar credenciales reales.' });
});

router.get('/publicaciones/feed', (req, res) => res.json({ exito: true, ...paginar(publicaciones, req.query.pagina, req.query.limite) }));
router.get('/publicaciones/explorar', (req, res) => res.json({ exito: true, datos: publicaciones }));
router.get('/publicaciones/guardadas/mias', (req, res) => res.json({ exito: true, datos: publicaciones.slice(0, 2) }));
router.get('/publicaciones/borradores/mios', (req, res) => res.json({ exito: true, datos: publicaciones.slice(2).map((item) => ({ ...item, esBorrador: true })) }));
router.get('/publicaciones/buscar', (req, res) => {
  const termino = String(req.query.termino || '').toLowerCase();
  const datos = publicaciones.filter((item) => `${item.titulo} ${item.contenido}`.toLowerCase().includes(termino));
  res.json({ exito: true, ...paginar(datos, req.query.pagina, req.query.limite) });
});
router.get('/publicaciones', (req, res) => res.json({ exito: true, ...paginar(publicaciones, req.query.pagina, req.query.limite) }));
router.get('/publicaciones/:id', (req, res) => {
  const publicacion = publicaciones.find((item) => String(item.id) === String(req.params.id));
  if (!publicacion) return res.status(404).json({ exito: false, mensaje: 'Publicacion no encontrada' });
  return res.json({ exito: true, datos: publicacion });
});
router.post('/publicaciones', (req, res) => {
  const nueva = {
    id: `demo-${Date.now()}`,
    titulo: req.body.titulo,
    contenido: req.body.contenido,
    imagenes: [],
    totalMeGustas: 0,
    totalComentarios: 0,
    fechaCreacion: new Date().toISOString(),
    autor: usuarioDemo,
    etiquetas: String(req.body.etiquetas || '').split(',').filter(Boolean).map((nombre, index) => ({ id: index + 10, nombre: nombre.trim() })),
    comentarios: []
  };
  publicaciones.unshift(nueva);
  res.status(201).json({ exito: true, mensaje: 'Publicacion demo creada', datos: nueva });
});
router.post('/publicaciones/:id/me-gusta', (req, res) => res.json({ exito: true, mensaje: 'Me gusta actualizado', leGusta: true }));
router.post('/publicaciones/:id/guardar', (req, res) => res.json({ exito: true, mensaje: 'Publicacion guardada', guardada: true }));

router.post('/comentarios', (req, res) => {
  res.status(201).json({
    exito: true,
    mensaje: 'Comentario demo creado',
    datos: { id: Date.now(), contenido: req.body.contenido, usuario: usuarioDemo }
  });
});

router.get('/usuarios/buscar', (req, res) => res.json({ exito: true, datos: [usuarioDemo], total: 1, pagina: 1, totalPaginas: 1 }));
router.get('/usuarios/:nombreUsuario', (req, res) => {
  res.json({ exito: true, datos: { ...usuarioDemo, nombreUsuario: req.params.nombreUsuario, publicaciones } });
});
router.put('/usuarios/perfil', (req, res) => res.json({ exito: true, mensaje: 'Perfil demo actualizado', datos: { ...usuarioDemo, ...req.body } }));
router.put('/usuarios/cambiar-contrasena', (req, res) => res.json({ exito: true, mensaje: 'Contrasena demo actualizada' }));

router.post('/seguidores/seguir/:id', (req, res) => res.json({ exito: true, mensaje: 'Usuario seguido' }));
router.delete('/seguidores/dejar-seguir/:id', (req, res) => res.json({ exito: true, mensaje: 'Has dejado de seguir al usuario' }));

router.get('/sitio/salud', (req, res) => {
  res.json({
    exito: true,
    mensaje: 'API demo operativa',
    datos: {
      api: 'online',
      baseDatos: 'modo demo',
      version: '1.1.0',
      fecha: new Date().toISOString()
    }
  });
});

router.get('/sitio/estadisticas', (req, res) => {
  res.json({
    exito: true,
    mensaje: 'Estadisticas demo cargadas',
    datos: {
      usuarios: 128,
      publicaciones: publicaciones.length,
      comentarios: 79,
      guardados: 54,
      crecimiento: [
        { etiqueta: 'Lunes', valor: 38 },
        { etiqueta: 'Martes', valor: 52 },
        { etiqueta: 'Miercoles', valor: 67 },
        { etiqueta: 'Jueves', valor: 74 },
        { etiqueta: 'Viernes', valor: 91 }
      ]
    }
  });
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
