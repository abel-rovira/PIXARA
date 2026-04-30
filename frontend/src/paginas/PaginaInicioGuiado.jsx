import { Link } from 'react-router-dom';

export default function OnboardingPage() {
  return (
    <section className="static-page">
      <p className="section-label">Onboarding</p>
      <h1>Configura Pixara en tres pasos</h1>
      <div className="support-grid">
        <article><h2>1. Elige intereses</h2><p>Define temas para personalizar el feed.</p></article>
        <article><h2>2. Sigue autores</h2><p>Construye tu radar de lectura.</p></article>
        <article><h2>3. Publica</h2><p>Escribe tu primera historia y compártela.</p></article>
      </div>
      <Link to="/registro">Crear cuenta</Link>
    </section>
  );
}

