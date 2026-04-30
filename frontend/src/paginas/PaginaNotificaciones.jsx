import { useEffect, useState } from 'react';
import PageHeader from '../componentes/compartido/EncabezadoPagina';
import LoadingState from '../componentes/compartido/EstadoCarga';
import { getNotifications } from '../servicios/servicioSitio';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(({ data }) => setItems(data.datos || []))
      .finally(() => setCargando(false));
  }, []);

  return (
    <section className="view">
      <PageHeader eyebrow="Centro" title="Notificaciones" text="Avisos de producto, comunidad y afinidad preparados para evolucionar." />
      {cargando ? <LoadingState text="Cargando notificaciones..." /> : (
        <div className="notification-list">
          {items.map((item) => (
            <article className={item.leida ? 'read' : ''} key={item.id}>
              <span>{item.tipo}</span>
              <h2>{item.titulo}</h2>
              <p>{item.texto}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

