import PageHeader from '../componentes/compartido/EncabezadoPagina';
import { planes } from '../datos/contenidoProducto';

export default function PricingPage() {
  return (
    <section className="view">
      <PageHeader eyebrow="Planes" title="Preparado para monetizar" text="Estructura de planes para cuando quieras activar pagos, suscripciones o funciones premium." />
      <div className="pricing-grid">
        {planes.map((plan) => (
          <article key={plan.nombre}>
            <h2>{plan.nombre}</h2>
            <strong>{plan.precio}</strong>
            <p>{plan.descripcion}</p>
            <button type="button">Elegir</button>
          </article>
        ))}
      </div>
    </section>
  );
}

