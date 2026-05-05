const express = require('express');
const router = express.Router();
const comentariosMongoControlador = require('../controladores/comentariosMongoControlador');
const autenticacionMongo = require('../middlewares/autenticacionMongo');

router.post('/', autenticacionMongo, comentariosMongoControlador.crear);

module.exports = router;
