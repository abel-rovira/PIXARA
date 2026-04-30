const express = require('express');
const router = express.Router();
const sitioControlador = require('../controladores/sitioControlador');
const limitePeticiones = require('../middlewares/limitePeticiones');

router.get('/salud', sitioControlador.salud);
router.get('/estadisticas', sitioControlador.estadisticas);
router.get('/modulos', sitioControlador.modulos);
router.get('/actividad', sitioControlador.actividad);
router.get('/notificaciones', sitioControlador.notificacionesDemo);
router.post('/newsletter', limitePeticiones({ maximo: 10 }), sitioControlador.suscribirNewsletter);
router.post('/feedback', limitePeticiones({ maximo: 8 }), sitioControlador.enviarFeedback);

module.exports = router;
