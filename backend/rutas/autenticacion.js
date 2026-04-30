const express = require('express');
const router = express.Router();
const autenticacionControlador = require('../controladores/autenticacionControlador');
const autenticacion = require('../middlewares/autenticacion');

// post /api/autenticacion/registro
router.post('/registro', autenticacionControlador.registro);

// post /api/autenticacion/login
router.post('/login', autenticacionControlador.login);

// get /api/autenticacion/google
router.get('/google', autenticacionControlador.iniciarOAuth('google'));

// get /api/autenticacion/apple
router.get('/apple', autenticacionControlador.iniciarOAuth('apple'));

// get /api/autenticacion/oauth/callback
router.get('/oauth/callback', autenticacionControlador.oauthCallback);

// get /api/autenticacion/yo
router.get('/yo', autenticacion, autenticacionControlador.obtenerUsuarioActual);

module.exports = router;
