require('dotenv').config();

module.exports = {
  proveedor: 'mongodb',
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pixara',
  opciones: {
    serverSelectionTimeoutMS: 5000
  }
};
