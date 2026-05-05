const bloquesSoporte = [
  {
    titulo: 'Cuenta y acceso',
    texto: 'Ayuda para registro, inicio de sesión, cierre de sesión, datos de perfil, contraseña y acceso a la cuenta.',
    puntos: ['Crear una cuenta con usuario, correo y contraseña.', 'Editar nombre, biografía y foto de perfil.', 'Eliminar la foto de perfil cuando ya no quieras mostrarla.']
  },
  {
    titulo: 'Publicaciones',
    texto: 'Todo lo relacionado con escribir, publicar, guardar borradores, subir imágenes y organizar historias con etiquetas.',
    puntos: ['Crear publicaciones desde el editor con vista previa.', 'Añadir imágenes de portada y etiquetas propias.', 'Guardar borradores para revisarlos antes de publicar.']
  },
  {
    titulo: 'Comunidad',
    texto: 'Funciones sociales para seguir autores, comentar publicaciones, dar like y guardar contenido para leer más tarde.',
    puntos: ['Seguir o dejar de seguir perfiles.', 'Comentar de forma respetuosa.', 'Usar likes y guardados para organizar lecturas.']
  },
  {
    titulo: 'Privacidad y seguridad',
    texto: 'Información sobre sesión, datos públicos, cookies, preferencias y buenas prácticas para proteger la cuenta.',
    puntos: ['Usar contraseñas únicas.', 'No publicar información sensible.', 'Cerrar sesión en equipos compartidos.']
  }
];

const preguntas = [
  {
    pregunta: 'No puedo iniciar sesión, ¿qué hago?',
    respuesta: 'Comprueba que el backend esté arrancado, que MongoDB esté activo y que el correo o usuario coincida con la cuenta registrada. Si acabas de cambiar variables de entorno, reinicia el servidor.'
  },
  {
    pregunta: 'He creado una publicación y no aparece.',
    respuesta: 'Revisa si la guardaste como borrador. Las publicaciones publicadas aparecen en el feed, mientras que los borradores se consultan desde la sección de borradores.'
  },
  {
    pregunta: '¿Dónde se guardan mis imágenes?',
    respuesta: 'Las imágenes subidas se guardan en la carpeta de uploads del backend y se sirven desde la ruta /uploads. En producción conviene usar almacenamiento dedicado.'
  },
  {
    pregunta: '¿Puedo borrar mi foto de perfil?',
    respuesta: 'Sí. En tu perfil entra en editar y usa la opción de eliminar foto. El avatar quedará vacío y se mostrará el identificador visual por defecto.'
  },
  {
    pregunta: '¿Por qué no debo escribir hashtags duplicados?',
    respuesta: 'Pixara limpia las etiquetas para evitar duplicados. Puedes escribirlas con o sin #, separadas por espacios o comas, y la plataforma las normaliza.'
  }
];

export default function SupportPage() {
  return (
    <section className="static-page support-page">
      <p className="section-label">Soporte</p>
      <h1>Centro de ayuda</h1>
      <p>Encuentra ayuda para cuentas, publicaciones, privacidad, comentarios, reportes y configuración. Esta página reúne las dudas típicas de una plataforma social/editorial como Pixara.</p>

      <div className="support-grid">
        {bloquesSoporte.map((bloque) => (
          <article key={bloque.titulo}>
            <h2>{bloque.titulo}</h2>
            <p>{bloque.texto}</p>
            <ul>
              {bloque.puntos.map((punto) => <li key={punto}>{punto}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <div className="legal-content">
        <article>
          <h2>Antes de pedir ayuda</h2>
          <p>Si estás desarrollando localmente, comprueba primero que el frontend y el backend estén ejecutándose en sus puertos correctos. Normalmente el frontend estará en http://localhost:5173 y el backend en http://localhost:5000.</p>
          <p>También revisa que MongoDB esté iniciado y que el archivo de entorno del backend tenga la variable MONGODB_URI apuntando a la base correcta.</p>
        </article>

        <article>
          <h2>Buenas prácticas al publicar</h2>
          <p>Usa títulos claros, imágenes propias o permitidas, etiquetas concretas y contenido que aporte algo a otros lectores. Antes de publicar, revisa la vista previa para comprobar formato, saltos de línea y enlaces.</p>
          <p>Evita publicar datos personales, contraseñas, información de terceros o contenido copiado sin permiso.</p>
        </article>
      </div>

      <div className="faq-list">
        {preguntas.map((item) => (
          <details key={item.pregunta}>
            <summary>{item.pregunta}</summary>
            <p>{item.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
