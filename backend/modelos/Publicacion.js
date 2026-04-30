const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Publicacion = sequelize.define('Publicacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuario_id'
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imagenes: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    esBorrador: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'es_borrador'
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_actualizacion'
    }
  }, {
    tableName: 'publicaciones',
    timestamps: false,
    hooks: {
      beforeUpdate: (publicacion) => {
        publicacion.fechaActualizacion = new Date();
      }
    }
  });

  return Publicacion;
};