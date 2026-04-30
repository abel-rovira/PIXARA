require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./modelos'); 

const app = express();
const proveedorDatos = process.env.DB_PROVIDER || 'demo';

// middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servir archivos estaticos (imagenes subidas)
// CORREGIDO: ahora apunta a ./uploads (dentro de backend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (proveedorDatos !== 'mysql') {
  app.use('/api', require('./rutas/demostracion'));
}

// rutas
app.use('/api/autenticacion', require('./rutas/autenticacion'));
app.use('/api/usuarios', require('./rutas/usuarios'));
app.use('/api/publicaciones', require('./rutas/publicaciones'));
app.use('/api/comentarios', require('./rutas/comentarios'));
app.use('/api/seguidores', require('./rutas/seguidores'));
app.use('/api/sitio', require('./rutas/sitio'));

// ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de NS - Red Social Blog',
    version: '1.1.0',
    modo: proveedorDatos,
    endpoints: {
      autenticacion: '/api/autenticacion',
      usuarios: '/api/usuarios',
      publicaciones: '/api/publicaciones',
      comentarios: '/api/comentarios',
      seguidores: '/api/seguidores',
      sitio: '/api/sitio'
    }
  });
});

// manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada'
  });
});

// manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor'
  });
});

// puerto
const PORT = process.env.PORT || 5000;

// sincronizar base de datos e iniciar servidor
const iniciarServidor = async () => {
  if (proveedorDatos === 'mysql') {
    try {
      await db.sincronizarBaseDatos({ alter: true });
      console.log(`Base de datos MySQL: ${db.sequelize.config.database}`);
    } catch (error) {
      console.error('Base de datos MySQL no disponible. El servidor arrancara en modo limitado:', error.message);
    }
  } else {
    console.log('Modo demo activo. No se conecta a MySQL. MongoDB se integrara cuando se defina el modelo.');
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('API lista para recibir peticiones');
  });
};

iniciarServidor();

module.exports = app;

