const mongoose = require('mongoose');

const esquemaMeGusta = new mongoose.Schema(
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

esquemaMeGusta.index({ publicacionId: 1, usuarioId: 1 }, { unique: true });

module.exports = mongoose.models.MeGusta || mongoose.model('MeGusta', esquemaMeGusta);
