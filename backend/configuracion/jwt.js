require('dotenv').config();

module.exports = {
  secreto: process.env.JWT_SECRET || 'clave_super_secreta_cambiar_en_produccion',
  expiracion: process.env.JWT_EXPIRATION || '7d'
};