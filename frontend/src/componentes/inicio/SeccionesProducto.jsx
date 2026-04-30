import { Link } from 'react-router-dom';
import { ventajasProducto } from '../../datos/contenidoProducto';

export default function ProductSections() {
  return (
    <section className="product-sections">
      <div className="product-panel lead">
        <span>Pixara OS</span>
        <h2>Una red editorial con sensación de producto, no de plantilla.</h2>
        <p>Inicio limpio, carrusel grande, tarjetas cuadradas, rutas sociales y módulos pensados para crecer sin rehacerlo todo.</p>
        <Link to="/producto">Ver producto</Link>
      </div>
      <div className="product-grid-mini">
        {ventajasProducto.map((item) => (
          <article key={item.titulo}>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

