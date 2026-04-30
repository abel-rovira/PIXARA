import { useEffect, useState } from 'react';
import PageHeader from '../componentes/compartido/EncabezadoPagina';
import LoadingState from '../componentes/compartido/EstadoCarga';
import { getActivity, getSiteModules } from '../servicios/servicioSitio';

export default function CommunityPage() {
  const [actividad, setActividad] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([getActivity(), getSiteModules()])
      .then(([activity, modules]) => {
        setActividad(activity.data.datos || []);
        setModulos(modules.data.datos || []);
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <section className="view">
      <PageHeader eyebrow="Comunidad" title="Todo lo social en un mismo sitio" text="Actividad, perfiles, temas vivos y módulos listos para crecer con usuarios reales." />
      {cargando ? <LoadingState text="Cargando comunidad..." /> : (
        <div className="two-column-section">
          <div className="activity-list">
            <h2>Actividad reciente</h2>
            {actividad.map((item) => (
              <article key={item.id}>
                <strong>{item.titulo}</strong>
                <span>@{item.usuario}</span>
              </article>
            ))}
          </div>
          <div className="module-list">
            <h2>Módulos activos</h2>
            {modulos.map((item) => (
              <article key={item.id}>
                <h3>{item.titulo}</h3>
                <p>{item.descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

