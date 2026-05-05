const mongoose = require('mongoose');

const esquemaPublicacion = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      index: true
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 50000
    },
    imagenes: {
      type: [String],
      default: []
    },
    etiquetas: {
      type: [String],
      default: []
    },
    esBorrador: {
      type: Boolean,
      default: false,
      index: true
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

esquemaPublicacion.index({ titulo: 'text', contenido: 'text', etiquetas: 'text' });

esquemaPublicacion.methods.toJSON = function toJSON() {
  const publicacion = this.toObject();
  publicacion.id = publicacion._id.toString();
  delete publicacion._id;
  return publicacion;
};

module.exports = mongoose.models.Publicacion || mongoose.model('Publicacion', esquemaPublicacion);
