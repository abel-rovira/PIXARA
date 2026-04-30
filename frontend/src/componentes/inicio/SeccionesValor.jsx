import { Link } from 'react-router-dom';
import { featureGrid, homeSections } from '../../datos/contenidoInicio';

export default function ValueSections() {
  return (
    <>
      <section className="value-section">
        {homeSections.map((item) => (
          <article key={item.titulo}>
            <h2>{item.titulo}</h2>
            <p>{item.texto}</p>
          </article>
        ))}
      </section>

      <section className="feature-section">
        <div>
          <p className="section-label">Plataforma completa</p>
          <h2>Todo preparado para crecer cuando conectes la base de datos.</h2>
          <Link to="/onboarding">Ver onboarding</Link>
        </div>
        <div className="feature-grid">
          {featureGrid.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="newsletter-section">
        <h2>Recibe lo mejor de Pixara</h2>
        <p>Una portada limpia, autores seleccionados y nuevas historias cada semana.</p>
        <form>
          <input type="email" placeholder="tu@email.com" />
          <button type="button">Suscribirme</button>
        </form>
      </section>
    </>
  );
}

