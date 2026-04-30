const multer = require('multer');
const path = require('path');
const fs = require('fs');

// crear directorio de uploads si no existe
const directorioUploads = path.join(__dirname, '../../uploads');
if (!fs.existsSync(directorioUploads)) {
  fs.mkdirSync(directorioUploads, { recursive: true });
}

// configuracion de almacenamiento
const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, directorioUploads);
  },
  filename: (req, file, cb) => {
    const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, nombreUnico);
  }
});

// filtro de archivos (solo imagenes)
const filtroArchivos = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extensionValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimetypeValido = tiposPermitidos.test(file.mimetype);

  if (extensionValida && mimetypeValido) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

// configuracion de multer
const upload = multer({
  storage: almacenamiento,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5mb
  },
  fileFilter: filtroArchivos
});

// middleware para manejar errores de multer
const manejarErroresMulter = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        exito: false,
        mensaje: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      });
    }
    return res.status(400).json({
      exito: false,
      mensaje: `Error al subir archivo: ${err.message}`
    });
  }

  if (err) {
    return res.status(400).json({
      exito: false,
      mensaje: err.message
    });
  }

  next();
};

module.exports = upload;
module.exports.manejarErroresMulter = manejarErroresMulter;