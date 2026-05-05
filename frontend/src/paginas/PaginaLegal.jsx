import { Link } from 'react-router-dom';

const paginasLegales = {
  privacidad: {
    etiqueta: 'Privacidad',
    titulo: 'Política de privacidad',
    entradilla:
      'En Pixara tratamos la privacidad como parte del producto. Esta página explica qué datos podemos recoger, para qué los usamos y qué control tiene cada usuario sobre su cuenta.',
    secciones: [
      {
        titulo: '1. Datos que podemos recoger',
        parrafos: [
          'Cuando una persona crea una cuenta podemos guardar datos básicos como nombre de usuario, correo electrónico, contraseña cifrada, foto de perfil, biografía, preferencias de idioma, modo visual y actividad necesaria para que la plataforma funcione.',
          'También podemos registrar publicaciones, comentarios, likes, guardados, seguidores, borradores, imágenes subidas y la información técnica mínima asociada a cada acción, como fechas de creación y actualización.',
          'Si en el futuro se activan servicios externos como inicio con Google o Apple, Pixara solo solicitará los datos imprescindibles para identificar la cuenta y completar el acceso.'
        ]
      },
      {
        titulo: '2. Para qué usamos la información',
        parrafos: [
          'Usamos los datos para crear y mantener cuentas, mostrar perfiles públicos, publicar contenido, permitir comentarios, guardar publicaciones, gestionar seguidores y mejorar la experiencia general de lectura.',
          'También podemos usar información agregada para entender qué funciones se utilizan más, detectar errores, prevenir abuso, mejorar rendimiento y diseñar nuevas funcionalidades.',
          'No vendemos datos personales. Si algún día se incorporan analíticas o proveedores externos, deberán utilizarse con criterios de minimización y con información clara para el usuario.'
        ]
      },
      {
        titulo: '3. Contenido público',
        parrafos: [
          'Las publicaciones, comentarios, nombre de usuario, avatar y biografía pueden mostrarse públicamente dentro de Pixara. Antes de publicar, el usuario debe revisar que no incluye información privada que no quiera compartir.',
          'Los borradores no están pensados para mostrarse públicamente. Aun así, recomendamos no guardar contraseñas, datos bancarios ni información sensible dentro del editor.'
        ]
      },
      {
        titulo: '4. Seguridad',
        parrafos: [
          'Las contraseñas se almacenan cifradas. La autenticación usa tokens para mantener la sesión y proteger rutas privadas como perfil, publicación, comentarios, guardados y seguidores.',
          'Ningún sistema es perfecto. Por eso se recomienda usar contraseñas únicas, mantener el navegador actualizado y cerrar sesión en dispositivos compartidos.'
        ]
      },
      {
        titulo: '5. Derechos del usuario',
        parrafos: [
          'El usuario podrá solicitar acceso, rectificación, eliminación o limitación del tratamiento de sus datos cuando la plataforma esté en producción real.',
          'También podrá editar su perfil, cambiar su foto, eliminarla, borrar publicaciones propias y cerrar sesión desde la interfaz.'
        ]
      },
      {
        titulo: '6. Conservación de datos',
        parrafos: [
          'Conservamos la información mientras la cuenta esté activa o mientras sea necesaria para mantener la plataforma, resolver incidencias, cumplir obligaciones legales o proteger la comunidad.',
          'Cuando una publicación se elimina, también pueden eliminarse elementos relacionados como comentarios, likes y guardados asociados.'
        ]
      }
    ]
  },
  cookies: {
    etiqueta: 'Cookies',
    titulo: 'Política de cookies',
    entradilla:
      'Pixara utiliza cookies y almacenamiento local para recordar preferencias y mantener una experiencia cómoda. Esta página resume qué se guarda y por qué.',
    secciones: [
      {
        titulo: '1. Qué son las cookies',
        parrafos: [
          'Las cookies son pequeños archivos que el navegador guarda para recordar información entre visitas. También existen tecnologías parecidas, como localStorage, que permiten guardar preferencias del usuario en el propio navegador.',
          'En Pixara se usan de forma limitada y orientada a la experiencia del producto.'
        ]
      },
      {
        titulo: '2. Cookies y datos técnicos necesarios',
        parrafos: [
          'Podemos guardar información necesaria para iniciar sesión, mantener el token de usuario, recordar si se aceptó el aviso de cookies y conservar preferencias básicas como idioma o modo oscuro.',
          'Sin estos datos algunas partes de la web seguirían cargando, pero la experiencia sería peor: habría que iniciar sesión o configurar preferencias en cada visita.'
        ]
      },
      {
        titulo: '3. Preferencias guardadas',
        parrafos: [
          'Actualmente Pixara puede guardar preferencias como aceptación de cookies, idioma elegido, tema claro u oscuro y datos locales de sesión.',
          'Estas preferencias se almacenan en el navegador y pueden eliminarse borrando los datos del sitio desde la configuración del navegador.'
        ]
      },
      {
        titulo: '4. Analítica y mejora',
        parrafos: [
          'Si en el futuro se añaden herramientas de analítica, se deberán usar para entender rendimiento, errores y uso general de funciones, evitando recopilar más datos de los necesarios.',
          'Cualquier integración nueva debería explicarse aquí para que el usuario sepa qué herramienta se utiliza y con qué finalidad.'
        ]
      },
      {
        titulo: '5. Cómo gestionar cookies',
        parrafos: [
          'El usuario puede bloquear, borrar o limitar cookies desde su navegador. Los pasos dependen de Chrome, Edge, Firefox, Safari u otro navegador.',
          'Bloquear cookies esenciales puede impedir que ciertas funciones, como sesión o preferencias, funcionen correctamente.'
        ]
      }
    ]
  },
  terminos: {
    etiqueta: 'Términos',
    titulo: 'Términos de uso',
    entradilla:
      'Estos términos explican las reglas básicas para usar Pixara, publicar contenido y participar en la comunidad de forma segura y respetuosa.',
    secciones: [
      {
        titulo: '1. Uso de la plataforma',
        parrafos: [
          'Pixara es una plataforma social/editorial para escribir, leer, comentar, guardar publicaciones y seguir a otros usuarios.',
          'Al usar la web, el usuario acepta utilizarla de forma responsable, sin intentar dañar el servicio, acceder a cuentas ajenas o manipular funcionalidades.'
        ]
      },
      {
        titulo: '2. Cuenta de usuario',
        parrafos: [
          'Cada usuario es responsable de la seguridad de su cuenta, de la información que publica y de mantener actualizados sus datos.',
          'No está permitido suplantar a otras personas, crear cuentas para abuso, automatizar spam o utilizar nombres que confundan deliberadamente a otros usuarios.'
        ]
      },
      {
        titulo: '3. Contenido publicado',
        parrafos: [
          'El usuario conserva la responsabilidad sobre sus publicaciones, imágenes, comentarios y cualquier otro material que comparta.',
          'No se debe publicar contenido ilegal, amenazas, acoso, datos privados de terceros, material con derechos sin permiso o contenido diseñado para engañar a otros usuarios.',
          'Pixara podrá moderar, ocultar o eliminar contenido que incumpla estas reglas cuando exista un sistema de moderación activo.'
        ]
      },
      {
        titulo: '4. Comunidad e interacción',
        parrafos: [
          'Los comentarios y seguidores existen para crear conversación real. Se espera un trato respetuoso, incluso cuando existan opiniones distintas.',
          'No se permite usar likes, comentarios o seguimiento para acosar, intimidar, manipular artificialmente métricas o enviar publicidad no solicitada.'
        ]
      },
      {
        titulo: '5. Disponibilidad del servicio',
        parrafos: [
          'Pixara puede cambiar, mejorar o pausar funciones durante desarrollo, mantenimiento o despliegues técnicos.',
          'Aunque se busca estabilidad, no se garantiza disponibilidad permanente, especialmente mientras el proyecto esté en fase de construcción.'
        ]
      },
      {
        titulo: '6. Cambios en los términos',
        parrafos: [
          'Estos términos pueden actualizarse cuando cambien funcionalidades, legislación aplicable o necesidades del producto.',
          'La versión visible en esta página será la referencia principal para los usuarios.'
        ]
      }
    ]
  }
};

export default function PaginaLegal({ tipo = 'privacidad' }) {
  const pagina = paginasLegales[tipo] || paginasLegales.privacidad;

  return (
    <section className="static-page legal-page">
      <p className="section-label">{pagina.etiqueta}</p>
      <h1>{pagina.titulo}</h1>
      <p>{pagina.entradilla}</p>

      <div className="legal-content">
        {pagina.secciones.map((seccion) => (
          <article key={seccion.titulo}>
            <h2>{seccion.titulo}</h2>
            {seccion.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
          </article>
        ))}
      </div>

      <div className="legal-note">
        <strong>Última actualización</strong>
        <p>Documento preparado para la fase actual de desarrollo de Pixara. Antes de lanzar el proyecto públicamente conviene revisarlo con asesoramiento legal.</p>
      </div>

      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
