const express = require('express');
const router = express.Router();
const publicacionesMongoControlador = require('../controladores/publicacionesMongoControlador');
const autenticacionMongo = require('../middlewares/autenticacionMongo');
const upload = require('../middlewares/subirArchivos');

router.get('/feed', publicacionesMongoControlador.obtenerFeed);
router.get('/explorar', publicacionesMongoControlador.obtenerTrending);
router.get('/buscar', publicacionesMongoControlador.buscar);
router.get('/siguiendo', autenticacionMongo, publicacionesMongoControlador.obtenerSiguiendo);
router.get('/guardadas/mias', autenticacionMongo, publicacionesMongoControlador.obtenerGuardadas);
router.get('/borradores/mios', autenticacionMongo, publicacionesMongoControlador.obtenerBorradores);
router.get('/', publicacionesMongoControlador.obtenerTodas);
router.get('/:id', publicacionesMongoControlador.obtenerPorId);
router.post('/', autenticacionMongo, upload.array('imagenes', 10), publicacionesMongoControlador.crear);
router.put('/:id', autenticacionMongo, upload.array('imagenes', 10), publicacionesMongoControlador.actualizar);
router.delete('/:id', autenticacionMongo, publicacionesMongoControlador.eliminar);
router.post('/:id/me-gusta', autenticacionMongo, publicacionesMongoControlador.darMeGusta);
router.post('/:id/guardar', autenticacionMongo, publicacionesMongoControlador.guardar);

module.exports = router;
