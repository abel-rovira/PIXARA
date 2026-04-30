import PageHeader from '../componentes/compartido/EncabezadoPagina';
import ProductSections from '../componentes/inicio/SeccionesProducto';
import LiveStats from '../componentes/inicio/EstadisticasEnVivo';
import NewsletterSignup from '../componentes/formularios/SuscripcionBoletin';

export default function ProductPage() {
  return (
    <section className="view">
      <PageHeader
        eyebrow="Producto"
        title="Pixara para leer, crear y conectar"
        text="Una experiencia social editorial con estructura moderna, diseño limpio y módulos preparados para evolucionar."
        actionLabel="Crear cuenta"
        actionTo="/registro"
      />
      <LiveStats />
      <ProductSections />
      <section className="newsletter-section">
        <div>
          <span className="section-label">Lanzamiento</span>
          <h2>Recibe novedades del producto</h2>
          <p>Deja tu correo y prueba las mejoras cuando estén listas.</p>
        </div>
        <NewsletterSignup />
      </section>
    </section>
  );
}


