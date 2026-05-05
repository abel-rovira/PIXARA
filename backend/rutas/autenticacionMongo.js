const express = require('express');
const router = express.Router();
const autenticacionMongoControlador = require('../controladores/autenticacionMongoControlador');
const autenticacionMongo = require('../middlewares/autenticacionMongo');

router.post('/registro', autenticacionMongoControlador.registro);
router.post('/login', autenticacionMongoControlador.login);
router.get('/yo', autenticacionMongo, autenticacionMongoControlador.obtenerUsuarioActual);
router.get('/google', autenticacionMongoControlador.iniciarOAuth('google'));
router.get('/apple', autenticacionMongoControlador.iniciarOAuth('apple'));
router.get('/oauth/callback', autenticacionMongoControlador.oauthCallback);
router.post('/oauth/callback', autenticacionMongoControlador.oauthCallback);

module.exports = router;
