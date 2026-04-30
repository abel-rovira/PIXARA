const express = require('express');
const router = express.Router();
const publicacionControlador = require('../controladores/publicacionControlador');
const autenticacion = require('../middlewares/autenticacion');
const { autenticacionOpcional } = require('../middlewares/autenticacion');
const upload = require('../middlewares/subirArchivos');

// Rutas de publicaciones
router.get('/feed', autenticacion, publicacionControlador.obtenerFeedPersonalizado);
router.get('/explorar', publicacionControlador.obtenerTrending);
router.get('/buscar', autenticacionOpcional, publicacionControlador.buscarPublicaciones);
router.get('/guardadas/mias', autenticacion, publicacionControlador.obtenerGuardadas);
router.get('/borradores/mios', autenticacion, publicacionControlador.obtenerBorradores);
router.get('/', autenticacionOpcional, publicacionControlador.obtenerTodasPublicaciones);
router.get('/:id', autenticacionOpcional, publicacionControlador.obtenerPublicacionPorId);
router.post('/', autenticacion, upload.array('imagenes', 10), publicacionControlador.crearPublicacion);
router.put('/:id', autenticacion, upload.array('imagenes', 10), publicacionControlador.actualizarPublicacion);
router.delete('/:id', autenticacion, publicacionControlador.eliminarPublicacion);
router.post('/:id/me-gusta', autenticacion, publicacionControlador.darMeGusta);
router.post('/:id/guardar', autenticacion, publicacionControlador.guardarPublicacion);

module.exports = router;
