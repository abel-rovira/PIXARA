const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comentario = sequelize.define('Comentario', {
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
    publicacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'publicacion_id'
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    }
  }, {
    tableName: 'comentarios',
    timestamps: false
  });

  return Comentario;
};