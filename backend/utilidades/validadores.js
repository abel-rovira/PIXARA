const validator = require('validator');

/**
 * validador de registro de usuario
 */
exports.validarRegistro = (datos) => {
  const errores = [];

  // validar nombre de usuario
  if (!datos.nombreUsuario || datos.nombreUsuario.trim() === '') {
    errores.push({ campo: 'nombreUsuario', mensaje: 'El nombre de usuario es obligatorio' });
  } else if (datos.nombreUsuario.length < 3 || datos.nombreUsuario.length > 50) {
    errores.push({ campo: 'nombreUsuario', mensaje: 'El nombre de usuario debe tener entre 3 y 50 caracteres' });
  } else if (!/^[a-zA-Z0-9_]+$/.test(datos.nombreUsuario)) {
    errores.push({ campo: 'nombreUsuario', mensaje: 'El nombre de usuario solo puede contener letras, números y guiones bajos' });
  }

  // validar correo electronico
  if (!datos.correo || datos.correo.trim() === '') {
    errores.push({ campo: 'correo', mensaje: 'El correo electrónico es obligatorio' });
  } else if (!validator.isEmail(datos.correo)) {
    errores.push({ campo: 'correo', mensaje: 'El correo electrónico no es válido' });
  }

  // validar contrasena
  if (!datos.contrasena || datos.contrasena === '') {
    errores.push({ campo: 'contrasena', mensaje: 'La contraseña es obligatoria' });
  } else if (datos.contrasena.length < 6) {
    errores.push({ campo: 'contrasena', mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  } else if (datos.contrasena.length > 100) {
    errores.push({ campo: 'contrasena', mensaje: 'La contraseña no puede superar los 100 caracteres' });
  }

  // validar confirmacion de contrasena
  if (datos.confirmarContrasena && datos.contrasena !== datos.confirmarContrasena) {
    errores.push({ campo: 'confirmarContrasena', mensaje: 'Las contraseñas no coinciden' });
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * validador de inicio de sesion
 */
exports.validarLogin = (datos) => {
  const errores = [];

  // validar identificador (puede ser correo o nombre de usuario)
  if (!datos.identificador || datos.identificador.trim() === '') {
    errores.push({ campo: 'identificador', mensaje: 'El correo o nombre de usuario es obligatorio' });
  }

  // validar contrasena
  if (!datos.contrasena || datos.contrasena === '') {
    errores.push({ campo: 'contrasena', mensaje: 'La contraseña es obligatoria' });
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * validador de publicacion
 */
exports.validarPublicacion = (datos) => {
  const errores = [];

  // validar titulo
  if (!datos.titulo || datos.titulo.trim() === '') {
    errores.push({ campo: 'titulo', mensaje: 'El título es obligatorio' });
  } else if (datos.titulo.length < 3) {
    errores.push({ campo: 'titulo', mensaje: 'El título debe tener al menos 3 caracteres' });
  } else if (datos.titulo.length > 200) {
    errores.push({ campo: 'titulo', mensaje: 'El título no puede superar los 200 caracteres' });
  }

  // validar contenido
  if (!datos.contenido || datos.contenido.trim() === '') {
    errores.push({ campo: 'contenido', mensaje: 'El contenido es obligatorio' });
  } else if (datos.contenido.length < 10) {
    errores.push({ campo: 'contenido', mensaje: 'El contenido debe tener al menos 10 caracteres' });
  } else if (datos.contenido.length > 50000) {
    errores.push({ campo: 'contenido', mensaje: 'El contenido no puede superar los 50,000 caracteres' });
  }

  // validar etiquetas (si existen)
  if (datos.etiquetas) {
    if (!Array.isArray(datos.etiquetas)) {
      errores.push({ campo: 'etiquetas', mensaje: 'Las etiquetas deben ser un array' });
    } else if (datos.etiquetas.length > 10) {
      errores.push({ campo: 'etiquetas', mensaje: 'No puedes añadir más de 10 etiquetas' });
    } else {
      datos.etiquetas.forEach((etiqueta, index) => {
        if (typeof etiqueta !== 'string') {
          errores.push({ campo: `etiquetas[${index}]`, mensaje: 'Cada etiqueta debe ser un texto' });
        } else if (etiqueta.trim().length < 2 || etiqueta.trim().length > 50) {
          errores.push({ campo: `etiquetas[${index}]`, mensaje: 'Cada etiqueta debe tener entre 2 y 50 caracteres' });
        } else if (!/^[a-zA-Z0-9_-]+$/.test(etiqueta.trim())) {
          errores.push({ campo: `etiquetas[${index}]`, mensaje: 'Las etiquetas solo pueden contener letras, números, guiones y guiones bajos' });
        }
      });
    }
  }

  // validar imagenes (si existen)
  if (datos.imagenes && Array.isArray(datos.imagenes)) {
    if (datos.imagenes.length > 10) {
      errores.push({ campo: 'imagenes', mensaje: 'No puedes subir más de 10 imágenes por publicación' });
    }
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * validador de comentario
 */
exports.validarComentario = (datos) => {
  const errores = [];

  if (!datos.contenido || datos.contenido.trim() === '') {
    errores.push({ campo: 'contenido', mensaje: 'El comentario no puede estar vacío' });
  } else if (datos.contenido.length < 1) {
    errores.push({ campo: 'contenido', mensaje: 'El comentario debe tener al menos 1 carácter' });
  } else if (datos.contenido.length > 1000) {
    errores.push({ campo: 'contenido', mensaje: 'El comentario no puede superar los 1,000 caracteres' });
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * validador de actualizacion de perfil
 */
exports.validarActualizacionPerfil = (datos) => {
  const errores = [];

  // validar nombre de usuario (si se envia)
  if (datos.nombreUsuario !== undefined) {
    if (datos.nombreUsuario.trim() === '') {
      errores.push({ campo: 'nombreUsuario', mensaje: 'El nombre de usuario no puede estar vacío' });
    } else if (datos.nombreUsuario.length < 3 || datos.nombreUsuario.length > 50) {
      errores.push({ campo: 'nombreUsuario', mensaje: 'El nombre de usuario debe tener entre 3 y 50 caracteres' });
    } else if (!/^[a-zA-Z0-9_]+$/.test(datos.nombreUsuario)) {
      errores.push({ campo: 'nombreUsuario', mensaje: 'El nombre de usuario solo puede contener letras, números y guiones bajos' });
    }
  }

  // validar biografia (si se envia)
  if (datos.biografia !== undefined && datos.biografia.length > 500) {
    errores.push({ campo: 'biografia', mensaje: 'La biografía no puede superar los 500 caracteres' });
  }

  // validar enlaces (si se envian)
  if (datos.enlaces !== undefined) {
    if (!Array.isArray(datos.enlaces)) {
      errores.push({ campo: 'enlaces', mensaje: 'Los enlaces deben ser un array' });
    } else if (datos.enlaces.length > 5) {
      errores.push({ campo: 'enlaces', mensaje: 'No puedes añadir más de 5 enlaces' });
    } else {
      datos.enlaces.forEach((enlace, index) => {
        if (!validator.isURL(enlace, { protocols: ['http', 'https'], require_protocol: true })) {
          errores.push({ campo: `enlaces[${index}]`, mensaje: `El enlace ${index + 1} no es una URL válida` });
        }
      });
    }
  }

  // validar correo (si se envia)
  if (datos.correo !== undefined) {
    if (!validator.isEmail(datos.correo)) {
      errores.push({ campo: 'correo', mensaje: 'El correo electrónico no es válido' });
    }
  }

  // validar avatar (si se envia)
  if (datos.avatar !== undefined && datos.avatar.trim() !== '') {
    if (!validator.isURL(datos.avatar, { protocols: ['http', 'https'], require_protocol: true })) {
      errores.push({ campo: 'avatar', mensaje: 'La URL del avatar no es válida' });
    }
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * validador de cambio de contrasena
 */
exports.validarCambioContrasena = (datos) => {
  const errores = [];

  // validar contrasena actual
  if (!datos.contrasenaActual || datos.contrasenaActual === '') {
    errores.push({ campo: 'contrasenaActual', mensaje: 'La contraseña actual es obligatoria' });
  }

  // validar nueva contrasena
  if (!datos.nuevaContrasena || datos.nuevaContrasena === '') {
    errores.push({ campo: 'nuevaContrasena', mensaje: 'La nueva contraseña es obligatoria' });
  } else if (datos.nuevaContrasena.length < 6) {
    errores.push({ campo: 'nuevaContrasena', mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' });
  } else if (datos.nuevaContrasena.length > 100) {
    errores.push({ campo: 'nuevaContrasena', mensaje: 'La nueva contraseña no puede superar los 100 caracteres' });
  }

  // validar confirmacion de nueva contrasena
  if (datos.confirmarNuevaContrasena !== datos.nuevaContrasena) {
    errores.push({ campo: 'confirmarNuevaContrasena', mensaje: 'Las contraseñas no coinciden' });
  }

  // validar que la nueva contrasena sea diferente a la actual
  if (datos.contrasenaActual === datos.nuevaContrasena) {
    errores.push({ campo: 'nuevaContrasena', mensaje: 'La nueva contraseña debe ser diferente a la actual' });
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * validador de busqueda
 */
exports.validarBusqueda = (datos) => {
  const errores = [];

  if (!datos.termino || datos.termino.trim() === '') {
    errores.push({ campo: 'termino', mensaje: 'El término de búsqueda es obligatorio' });
  } else if (datos.termino.length < 2) {
    errores.push({ campo: 'termino', mensaje: 'El término de búsqueda debe tener al menos 2 caracteres' });
  } else if (datos.termino.length > 100) {
    errores.push({ campo: 'termino', mensaje: 'El término de búsqueda no puede superar los 100 caracteres' });
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * validador de paginacion
 */
exports.validarPaginacion = (datos) => {
  const errores = [];

  const pagina = parseInt(datos.pagina);
  const limite = parseInt(datos.limite);

  if (datos.pagina && (isNaN(pagina) || pagina < 1)) {
    errores.push({ campo: 'pagina', mensaje: 'El número de página debe ser mayor o igual a 1' });
  }

  if (datos.limite && (isNaN(limite) || limite < 1 || limite > 100)) {
    errores.push({ campo: 'limite', mensaje: 'El límite debe estar entre 1 y 100' });
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * validador de id (mongodb objectid o mysql integer)
 */
exports.validarId = (id, nombreCampo = 'id') => {
  const errores = [];

  const idNumerico = parseInt(id);

  if (isNaN(idNumerico) || idNumerico < 1) {
    errores.push({ campo: nombreCampo, mensaje: `El ${nombreCampo} no es válido` });
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * sanitizar texto (eliminar html y scripts)
 */
exports.sanitizarTexto = (texto) => {
  if (typeof texto !== 'string') return texto;
  
  // eliminar etiquetas html
  return texto
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};

/**
 * validar formato de archivo de imagen
 */
exports.validarFormatoImagen = (nombreArchivo) => {
  const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = nombreArchivo.split('.').pop().toLowerCase();
  
  return extensionesPermitidas.includes(extension);
};

/**
 * validar tamano de archivo (en bytes)
 */
exports.validarTamanoArchivo = (tamaño, maxTamaño = 5 * 1024 * 1024) => {
  // por defecto: 5mb
  return tamaño <= maxTamaño;
};

/**
 * limpiar y normalizar etiquetas
 */
exports.normalizarEtiquetas = (etiquetas) => {
  if (!Array.isArray(etiquetas)) return [];
  
  return etiquetas
    .map(etiqueta => etiqueta.toLowerCase().trim().replace(/\s+/g, '-'))
    .filter((etiqueta, index, self) => {
      // eliminar duplicados
      return etiqueta.length >= 2 && self.indexOf(etiqueta) === index;
    })
    .slice(0, 10); // maximo 10 etiquetas
};

/**
 * generar slug desde titulo
 */
exports.generarSlug = (titulo) => {
  return titulo
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // eliminar caracteres especiales
    .replace(/\s+/g, '-') // reemplazar espacios por guiones
    .replace(/-+/g, '-') // eliminar guiones multiples
    .substring(0, 100); // limitar longitud
};

/**
 * validar contrasena segura (opcional - mas estricto)
 */
exports.esContrasenaSegura = (contrasena) => {
  const errores = [];

  if (contrasena.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[a-z]/.test(contrasena)) {
    errores.push('La contraseña debe contener al menos una letra minúscula');
  }

  if (!/[A-Z]/.test(contrasena)) {
    errores.push('La contraseña debe contener al menos una letra mayúscula');
  }

  if (!/[0-9]/.test(contrasena)) {
    errores.push('La contraseña debe contener al menos un número');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(contrasena)) {
    errores.push('La contraseña debe contener al menos un carácter especial');
  }

  return {
    esSegura: errores.length === 0,
    errores
  };
};

/**
 * validar fecha
 */
exports.validarFecha = (fecha) => {
  const fechaObj = new Date(fecha);
  return !isNaN(fechaObj.getTime());
};

/**
 * formatear errores para respuesta
 */
exports.formatearErrores = (errores) => {
  return errores.reduce((acc, error) => {
    acc[error.campo] = error.mensaje;
    return acc;
  }, {});
};
