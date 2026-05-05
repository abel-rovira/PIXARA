const express = require('express');
const router = express.Router();
const usuariosMongoControlador = require('../controladores/usuariosMongoControlador');
const autenticacionMongo = require('../middlewares/autenticacionMongo');
const upload = require('../middlewares/subirArchivos');

router.get('/buscar', usuariosMongoControlador.buscarUsuarios);
router.put('/perfil', autenticacionMongo, upload.single('avatar'), usuariosMongoControlador.actualizarPerfil);
router.delete('/perfil/avatar', autenticacionMongo, usuariosMongoControlador.eliminarAvatar);
router.put('/cambiar-contrasena', autenticacionMongo, usuariosMongoControlador.cambiarContrasena);
router.get('/:nombreUsuario', usuariosMongoControlador.obtenerPerfil);

module.exports = router;
