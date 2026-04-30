import { Link } from 'react-router-dom';

const textosLegales = {
  privacidad: {
    titulo: 'Política de privacidad',
    texto: 'Aquí se detallará cómo Pixara recoge, usa y protege los datos de usuarios cuando conectemos autenticación real y base de datos.',
  },
  cookies: {
    titulo: 'Política de cookies',
    texto: 'Pixara usa cookies técnicas para sesión, preferencias y mejora de experiencia. Podrás ampliar esta página con categorías y consentimiento granular.',
  },
  terminos: {
    titulo: 'Términos de uso',
    texto: 'Normas básicas para publicar, comentar, seguir autores y usar la plataforma respetando a la comunidad.',
  },
};

export default function PaginaLegal({ tipo = 'privacidad' }) {
  const pagina = textosLegales[tipo] || textosLegales.privacidad;

  return (
    <section className="static-page">
      <p className="section-label">Legal</p>
      <h1>{pagina.titulo}</h1>
      <p>{pagina.texto}</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
