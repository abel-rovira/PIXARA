const { Sequelize } = require('sequelize');
const configuracion = require('../configuracion/baseDatos');

// Crear instancia de Sequelize
const sequelize = new Sequelize(
  configuracion.base_datos,
  configuracion.usuario,
  configuracion.contrasena,
  {
    host: configuracion.host,
    dialect: configuracion.dialect || 'mysql',
    port: configuracion.puerto,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+01:00'
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ===============================
// IMPORTAR MODELOS
// ===============================
db.Usuario = require('./Usuario')(sequelize);
db.Publicacion = require('./Publicacion')(sequelize);
db.Comentario = require('./Comentario')(sequelize);
db.MeGusta = require('./MeGusta')(sequelize);
db.Seguidor = require('./Seguidor')(sequelize);
db.Etiqueta = require('./Etiqueta')(sequelize);
db.PublicacionGuardada = require('./PublicacionGuardada')(sequelize);

// ===============================
// DEFINIR RELACIONES
// ===============================

// Usuario -> Publicaciones
db.Usuario.hasMany(db.Publicacion, {
  foreignKey: 'usuarioId',
  as: 'publicaciones',
  onDelete: 'CASCADE'
});
db.Publicacion.belongsTo(db.Usuario, {
  foreignKey: 'usuarioId',
  as: 'autor'
});

// Usuario -> Comentarios
db.Usuario.hasMany(db.Comentario, {
  foreignKey: 'usuarioId',
  as: 'comentarios',
  onDelete: 'CASCADE'
});
db.Comentario.belongsTo(db.Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// Publicacion -> Comentarios
db.Publicacion.hasMany(db.Comentario, {
  foreignKey: 'publicacionId',
  as: 'comentarios',
  onDelete: 'CASCADE'
});
db.Comentario.belongsTo(db.Publicacion, {
  foreignKey: 'publicacionId',
  as: 'publicacion'
});

// Publicacion -> Me Gusta
db.Publicacion.hasMany(db.MeGusta, {
  foreignKey: 'publicacionId',
  as: 'meGustas',
  onDelete: 'CASCADE'
});
db.MeGusta.belongsTo(db.Publicacion, {
  foreignKey: 'publicacionId',
  as: 'publicacion'
});

// Usuario -> Me Gusta
db.Usuario.hasMany(db.MeGusta, {
  foreignKey: 'usuarioId',
  as: 'meGustas',
  onDelete: 'CASCADE'
});
db.MeGusta.belongsTo(db.Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});

// Seguidores
db.Usuario.belongsToMany(db.Usuario, {
  through: db.Seguidor,
  as: 'seguidos',
  foreignKey: 'seguidorId',
  otherKey: 'seguidoId'
});
db.Usuario.belongsToMany(db.Usuario, {
  through: db.Seguidor,
  as: 'seguidores',
  foreignKey: 'seguidoId',
  otherKey: 'seguidorId'
});

// Relaciones directas para seguidores
db.Usuario.hasMany(db.Seguidor, {
  foreignKey: 'seguidorId',
  as: 'siguiendoRelaciones'
});
db.Usuario.hasMany(db.Seguidor, {
  foreignKey: 'seguidoId',
  as: 'seguidoresRelaciones'
});
db.Seguidor.belongsTo(db.Usuario, {
  foreignKey: 'seguidorId',
  as: 'seguidor'
});
db.Seguidor.belongsTo(db.Usuario, {
  foreignKey: 'seguidoId',
  as: 'seguido'
});

// Publicaciones -> Etiquetas
db.Publicacion.belongsToMany(db.Etiqueta, {
  through: 'publicaciones_etiquetas',
  foreignKey: 'publicacion_id',
  otherKey: 'etiqueta_id',
  as: 'etiquetas'
});
db.Etiqueta.belongsToMany(db.Publicacion, {
  through: 'publicaciones_etiquetas',
  foreignKey: 'etiqueta_id',
  otherKey: 'publicacion_id',
  as: 'publicaciones'
});

// Publicaciones Guardadas
db.Usuario.hasMany(db.PublicacionGuardada, {
  foreignKey: 'usuarioId',
  as: 'publicacionesGuardadas',
  onDelete: 'CASCADE'
});
db.PublicacionGuardada.belongsTo(db.Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});
db.Publicacion.hasMany(db.PublicacionGuardada, {
  foreignKey: 'publicacionId',
  as: 'guardadoPor',
  onDelete: 'CASCADE'
});
db.PublicacionGuardada.belongsTo(db.Publicacion, {
  foreignKey: 'publicacionId',
  as: 'publicacion'
});

// ===============================
// FUNCIÓN PARA SINCRONIZAR BASE DE DATOS
// ===============================
db.sincronizarBaseDatos = async (opciones = {}) => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente');
    
    await sequelize.sync(opciones);
    console.log('Modelos sincronizados con la base de datos');
    
    return true;
  } catch (error) {
    console.error('Error al sincronizar base de datos:', error);
    throw error;
  }
};

module.exports = db;
