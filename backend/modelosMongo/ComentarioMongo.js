const mongoose = require('mongoose');

const esquemaComentario = new mongoose.Schema(
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
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
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

esquemaComentario.methods.toJSON = function toJSON() {
  const comentario = this.toObject();
  comentario.id = comentario._id.toString();
  delete comentario._id;
  return comentario;
};

module.exports = mongoose.models.Comentario || mongoose.model('Comentario', esquemaComentario);
