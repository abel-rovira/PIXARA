const express = require('express');
const router = express.Router();
const seguidorControlador = require('../controladores/seguidorControlador');
const autenticacion = require('../middlewares/autenticacion');

// post /api/seguidores/seguir/:usuarioId
router.post('/seguir/:usuarioId', autenticacion, seguidorControlador.seguirUsuario);

// delete /api/seguidores/dejar-seguir/:usuarioId
router.delete('/dejar-seguir/:usuarioId', autenticacion, seguidorControlador.dejarDeSeguir);

// get /api/seguidores/:usuarioId/seguidores
router.get('/:usuarioId/seguidores', seguidorControlador.obtenerSeguidores);

// get /api/seguidores/:usuarioId/siguiendo
router.get('/:usuarioId/siguiendo', seguidorControlador.obtenerSiguiendo);

// get /api/seguidores/verificar/:usuarioId
router.get('/verificar/:usuarioId', autenticacion, seguidorControlador.verificarSeguimiento);

module.exports = router;