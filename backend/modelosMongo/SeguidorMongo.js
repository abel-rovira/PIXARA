const mongoose = require('mongoose');

const esquemaSeguidor = new mongoose.Schema(
  {
    seguidorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      index: true
    },
    seguidoId: {
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

esquemaSeguidor.index({ seguidorId: 1, seguidoId: 1 }, { unique: true });

module.exports = mongoose.models.Seguidor || mongoose.model('Seguidor', esquemaSeguidor);
