const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombreUsuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'nombre_usuario'
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      defaultValue: function() {
        // Generar avatar por defecto basado en el nombre de usuario
        const nombre = this.nombreUsuario || 'usuario';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=random&size=150`;
      }
    },
    avatarPersonalizado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'avatar_personalizado'
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enlaces: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fecha_creacion'
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.contrasena) {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }
        // Generar avatar por defecto si no se proporciona uno
        if (!usuario.avatar || usuario.avatar === 'https://via.placeholder.com/150') {
          usuario.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombreUsuario)}&background=random&size=150`;
          usuario.avatarPersonalizado = false;
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('contrasena')) {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }
      }
    }
  });

  Usuario.prototype.compararContrasena = async function(contrasenaIngresada) {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
  };

  Usuario.prototype.toJSON = function() {
    const valores = { ...this.get() };
    delete valores.contrasena;
    return valores;
  };

  return Usuario;
};