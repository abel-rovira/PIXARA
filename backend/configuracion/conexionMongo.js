const mongoose = require('mongoose');
const configuracionMongo = require('./mongo');

let conexionLista = false;

async function conectarMongo() {
  if (conexionLista) return mongoose.connection;

  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  await mongoose.connect(configuracionMongo.uri, configuracionMongo.opciones);
  conexionLista = true;

  console.log(`MongoDB conectado: ${mongoose.connection.name}`);
  return mongoose.connection;
}

module.exports = {
  conectarMongo
};
