const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const mongoose = require('../backend/node_modules/mongoose');
const Usuario = require('../backend/modelosMongo/UsuarioMongo');
const Publicacion = require('../backend/modelosMongo/PublicacionMongo');
const Comentario = require('../backend/modelosMongo/ComentarioMongo');
const MeGusta = require('../backend/modelosMongo/MeGustaMongo');
const Guardado = require('../backend/modelosMongo/GuardadoMongo');
const Seguidor = require('../backend/modelosMongo/SeguidorMongo');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixara';
const contrasenaInicial = 'pixara123';

const usuariosIniciales = [
  {
    nombreUsuario: 'pixara',
    correo: 'pixara@pixara.local',
    biografia: 'Equipo editorial de Pixara. Seleccionamos historias, ideas y conversaciones para descubrir mejor contenido.'
  },
  {
    nombreUsuario: 'afinidad',
    correo: 'afinidad@pixara.local',
    biografia: 'Perfil dedicado a lecturas sociales, recomendaciones y conexiones entre autores.'
  },
  {
    nombreUsuario: 'criterio',
    correo: 'criterio@pixara.local',
    biografia: 'Ensayos breves sobre cultura digital, comunidad y formas más limpias de descubrir historias.'
  },
  {
    nombreUsuario: 'mapa',
    correo: 'mapa@pixara.local',
    biografia: 'Explora tendencias, rutas de lectura y temas que están creciendo dentro de Pixara.'
  },
  {
    nombreUsuario: 'sombra',
    correo: 'sombra@pixara.local',
    biografia: 'Historias íntimas, observaciones nocturnas y textos para leer sin ruido.'
  }
];

const publicacionesIniciales = [
  {
    autor: 'pixara',
    titulo: 'Haz match con historias que sí van contigo',
    contenido: 'Descubre textos, autores y conversaciones según tus gustos reales, no por ruido ni postureo. Pixara ordena la lectura para que cada historia tenga una razón para aparecer en tu feed.',
    etiquetas: ['match', 'descubrir', 'lectura']
  },
  {
    autor: 'afinidad',
    titulo: 'Una forma más social de leer',
    contenido: 'Desliza entre historias, guarda lo que te interesa y conecta con autores que escriben como tú piensas. Leer también puede ser una forma de encontrar gente afín.',
    etiquetas: ['social', 'lectura', 'comunidad']
  },
  {
    autor: 'criterio',
    titulo: 'Menos feed infinito. Más intención.',
    contenido: 'Un espacio limpio para elegir qué leer, a quién seguir y qué conversaciones merecen tu tiempo. La experiencia editorial no debería competir contra tu atención, debería cuidarla.',
    etiquetas: ['criterio', 'comunidad', 'producto']
  },
  {
    autor: 'mapa',
    titulo: 'Rutas para descubrir nuevos autores',
    contenido: 'Cuando una plataforma está bien ordenada, cada lectura abre una puerta. Pixara puede convertirse en un mapa vivo de autores, temas y estilos que evolucionan con la comunidad.',
    etiquetas: ['autores', 'explorar', 'tendencias']
  },
  {
    autor: 'sombra',
    titulo: 'Leer sin prisa también es una función',
    contenido: 'No todo tiene que ser inmediato. Hay publicaciones que piden pausa, silencio y una interfaz que no moleste. Pixara busca ese espacio: menos ruido, más criterio.',
    etiquetas: ['ensayo', 'calma', 'editorial']
  },
  {
    autor: 'pixara',
    titulo: 'El perfil como carta de presentación',
    contenido: 'Un buen perfil no solo muestra publicaciones. También cuenta una intención: qué escribe una persona, qué temas le importan y qué tipo de comunidad quiere construir.',
    etiquetas: ['perfil', 'creadores', 'identidad']
  }
];

async function asegurarUsuario(datos) {
  let usuario = await Usuario.findOne({ nombreUsuario: datos.nombreUsuario });

  if (!usuario) {
    usuario = new Usuario({
      ...datos,
      contrasena: contrasenaInicial
    });
    await usuario.save();
    return usuario;
  }

  usuario.correo = usuario.correo || datos.correo;
  usuario.biografia = usuario.biografia || datos.biografia;
  await usuario.save();
  return usuario;
}

async function asegurarPublicacion(datos, usuariosPorNombre) {
  const autor = usuariosPorNombre.get(datos.autor);
  const existente = await Publicacion.findOne({ titulo: datos.titulo, usuarioId: autor._id });

  if (existente) return existente;

  return Publicacion.create({
    usuarioId: autor._id,
    titulo: datos.titulo,
    contenido: datos.contenido,
    etiquetas: datos.etiquetas,
    imagenes: [],
    esBorrador: false
  });
}

async function asegurarInteracciones(usuarios, publicaciones) {
  for (const publicacion of publicaciones) {
    const lectores = usuarios.filter((usuario) => String(usuario._id) !== String(publicacion.usuarioId)).slice(0, 3);

    for (const usuario of lectores) {
      await MeGusta.findOneAndUpdate(
        { publicacionId: publicacion._id, usuarioId: usuario._id },
        { publicacionId: publicacion._id, usuarioId: usuario._id },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }

    await Guardado.findOneAndUpdate(
      { publicacionId: publicacion._id, usuarioId: lectores[0]._id },
      { publicacionId: publicacion._id, usuarioId: lectores[0]._id },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const comentarioExiste = await Comentario.findOne({
      publicacionId: publicacion._id,
      contenido: 'Me gusta cómo está planteado, se siente muy Pixara.'
    });

    if (!comentarioExiste) {
      await Comentario.create({
        publicacionId: publicacion._id,
        usuarioId: lectores[1]._id,
        contenido: 'Me gusta cómo está planteado, se siente muy Pixara.'
      });
    }
  }

  for (const seguidor of usuarios) {
    for (const seguido of usuarios) {
      if (String(seguidor._id) === String(seguido._id)) continue;
      await Seguidor.findOneAndUpdate(
        { seguidorId: seguidor._id, seguidoId: seguido._id },
        { seguidorId: seguidor._id, seguidoId: seguido._id },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
  }
}

async function sembrar() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(`Conectado a MongoDB: ${mongoose.connection.name}`);

  const usuarios = [];
  for (const datos of usuariosIniciales) {
    usuarios.push(await asegurarUsuario(datos));
  }

  const usuariosPorNombre = new Map(usuarios.map((usuario) => [usuario.nombreUsuario, usuario]));
  const publicaciones = [];
  for (const datos of publicacionesIniciales) {
    publicaciones.push(await asegurarPublicacion(datos, usuariosPorNombre));
  }

  await asegurarInteracciones(usuarios, publicaciones);
  await mongoose.disconnect();

  console.log(`Contenido inicial listo: ${usuarios.length} usuarios y ${publicaciones.length} publicaciones.`);
  console.log(`Puedes entrar con cualquiera usando contraseña: ${contrasenaInicial}`);
}

sembrar().catch(async (error) => {
  console.error('Error al sembrar contenido inicial:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
