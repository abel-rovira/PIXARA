const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controladores/usuarioControlador');
const autenticacion = require('../middlewares/autenticacion');
const { autenticacionOpcional } = require('../middlewares/autenticacion');
const upload = require('../middlewares/subirArchivos');

// get /api/usuarios/buscar
router.get('/buscar', usuarioControlador.buscarUsuarios);

// get /api/usuarios/:nombreUsuario
router.get('/:nombreUsuario', autenticacionOpcional, usuarioControlador.obtenerPerfil);

// put /api/usuarios/perfil
router.put('/perfil', autenticacion, upload.single('avatar'), usuarioControlador.actualizarPerfil);

// put /api/usuarios/cambiar-contrasena
router.put('/cambiar-contrasena', autenticacion, usuarioControlador.cambiarContrasena);

module.exports = router;