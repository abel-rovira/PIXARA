require('dotenv').config();

module.exports = {
  host: process.env.DB_HOST || 'localhost',
  usuario: process.env.DB_USER || 'root',
  contrasena: process.env.DB_PASSWORD || '',
  base_datos: process.env.DB_NAME || 'ns_red_social_blog',
  puerto: process.env.DB_PORT || 3306,
  dialect: 'mysql'
};