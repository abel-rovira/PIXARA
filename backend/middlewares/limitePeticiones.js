const ventanas = new Map();

module.exports = function limitePeticiones({ maximo = 80, ventanaMs = 60 * 1000 } = {}) {
  return (req, res, next) => {
    const clave = req.ip || req.headers['x-forwarded-for'] || 'local';
    const ahora = Date.now();
    const registro = ventanas.get(clave) || { inicio: ahora, total: 0 };

    if (ahora - registro.inicio > ventanaMs) {
      registro.inicio = ahora;
      registro.total = 0;
    }

    registro.total += 1;
    ventanas.set(clave, registro);

    if (registro.total > maximo) {
      return res.status(429).json({
        exito: false,
        mensaje: 'Demasiadas peticiones. Intentalo de nuevo en unos segundos.'
      });
    }

    next();
  };
};
