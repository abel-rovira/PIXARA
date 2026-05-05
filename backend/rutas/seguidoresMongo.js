const express = require('express');
const router = express.Router();
const seguidoresMongoControlador = require('../controladores/seguidoresMongoControlador');
const autenticacionMongo = require('../middlewares/autenticacionMongo');

router.post('/seguir/:id', autenticacionMongo, seguidoresMongoControlador.seguir);
router.delete('/dejar-seguir/:id', autenticacionMongo, seguidoresMongoControlador.dejarSeguir);
router.get('/:id/seguidores', seguidoresMongoControlador.listarSeguidores);
router.get('/:id/siguiendo', seguidoresMongoControlador.listarSiguiendo);

module.exports = router;
