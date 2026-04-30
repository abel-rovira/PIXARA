const express = require('express');
const router = express.Router();
const comentarioControlador = require('../controladores/comentarioControlador');
const autenticacion = require('../middlewares/autenticacion');

// get /api/comentarios/publicacion/:publicacionId
router.get('/publicacion/:publicacionId', comentarioControlador.obtenerComentarios);

// post /api/comentarios
router.post('/', autenticacion, comentarioControlador.crearComentario);

// put /api/comentarios/:id
router.put('/:id', autenticacion, comentarioControlador.actualizarComentario);

// delete /api/comentarios/:id
router.delete('/:id', autenticacion, comentarioControlador.eliminarComentario);

module.exports = router;