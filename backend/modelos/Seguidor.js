const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Seguidor = sequelize.define('Seguidor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    seguidorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'seguidor_id'
    },
    seguidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'seguido_id'
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    }
  }, {
    tableName: 'seguidores',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['seguidor_id', 'seguido_id']
      }
    ]
  });

  return Seguidor;
};