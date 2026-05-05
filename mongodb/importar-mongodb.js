const fs = require('fs');
const path = require('path');
const mongoose = require('../backend/node_modules/mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixara';
const carpetaColecciones = path.join(__dirname, 'colecciones');

const colecciones = [
  'usuarios',
  'publicaciones',
  'comentarios',
  'megustas',
  'guardados',
  'seguidores',
  'notificaciones',
  'preferencias',
  'sesiones',
  'reportes',
  'feedback',
  'newsletter'
];

async function importar() {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });

  console.log(`Conectado a MongoDB: ${mongoose.connection.name}`);

  for (const nombreColeccion of colecciones) {
    const archivo = path.join(carpetaColecciones, `${nombreColeccion}.json`);
    const contenido = fs.readFileSync(archivo, 'utf8');
    const documentos = JSON.parse(contenido);
    const coleccion = mongoose.connection.collection(nombreColeccion);

    await coleccion.deleteMany({});

    if (documentos.length > 0) {
      await coleccion.insertMany(documentos);
    }

    console.log(`Importada coleccion ${nombreColeccion}: ${documentos.length} documentos`);
  }

  await mongoose.disconnect();
  console.log('Importacion completada.');
}

importar().catch(async (error) => {
  console.error('Error al importar MongoDB:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
