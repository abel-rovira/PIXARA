const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const esquemaUsuario = new mongoose.Schema(
  {
    nombreUsuario: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
      index: true
    },
    correo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    contrasena: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    avatar: {
      type: String,
      default: ''
    },
    biografia: {
      type: String,
      default: '',
      maxlength: 500
    },
    enlaces: {
      type: [String],
      default: []
    },
    rol: {
      type: String,
      enum: ['usuario', 'moderador', 'admin'],
      default: 'usuario'
    },
    proveedorAuth: {
      type: String,
      enum: ['local', 'google', 'apple'],
      default: 'local'
    },
    googleId: {
      type: String,
      default: '',
      index: true
    },
    appleId: {
      type: String,
      default: '',
      index: true
    },
    ultimoAcceso: {
      type: Date,
      default: null
    }
  },
  {
    bufferCommands: false,
    timestamps: {
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion'
    },
    versionKey: false
  }
);

esquemaUsuario.pre('save', async function cifrarContrasena() {
  if (!this.isModified('contrasena')) return;
  this.contrasena = await bcrypt.hash(this.contrasena, 12);
});

esquemaUsuario.methods.compararContrasena = function compararContrasena(contrasena) {
  return bcrypt.compare(contrasena, this.contrasena);
};

esquemaUsuario.methods.toJSON = function toJSON() {
  const usuario = this.toObject();
  usuario.id = usuario._id.toString();
  delete usuario._id;
  delete usuario.contrasena;
  return usuario;
};

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', esquemaUsuario);
