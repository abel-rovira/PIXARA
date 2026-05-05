const mongoose = require('mongoose');

const esquemaGuardado = new mongoose.Schema(
  {
    publicacionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publicacion',
      required: true,
      index: true
    },
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      index: true
    }
  },
  {
    bufferCommands: false,
    timestamps: {
      createdAt: 'fechaCreacion',
      updatedAt: false
    },
    versionKey: false
  }
);

esquemaGuardado.index({ publicacionId: 1, usuarioId: 1 }, { unique: true });

module.exports = mongoose.models.Guardado || mongoose.model('Guardado', esquemaGuardado);
