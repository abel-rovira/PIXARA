const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PublicacionGuardada = sequelize.define('PublicacionGuardada', {
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
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    }
  }, {
    tableName: 'publicaciones_guardadas',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'publicacion_id']
      }
    ]
  });

  return PublicacionGuardada;
};