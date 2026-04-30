function ok(res, datos = {}, mensaje = 'Operacion completada') {
  return res.json({
    exito: true,
    mensaje,
    ...datos
  });
}

function creado(res, datos = {}, mensaje = 'Recurso creado') {
  return res.status(201).json({
    exito: true,
    mensaje,
    ...datos
  });
}

function errorCliente(res, mensaje, errores = null, estado = 400) {
  return res.status(estado).json({
    exito: false,
    mensaje,
    ...(errores ? { errores } : {})
  });
}

module.exports = {
  ok,
  creado,
  errorCliente
};
