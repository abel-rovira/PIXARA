import { useEffect, useState } from 'react';
import PageHeader from '../componentes/compartido/EncabezadoPagina';
import LoadingState from '../componentes/compartido/EstadoCarga';
import ErrorState from '../componentes/compartido/EstadoError';
import { getDrafts } from '../servicios/servicioPublicaciones';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [estado, setEstado] = useState('cargando');

  const cargar = () => {
    setEstado('cargando');
    getDrafts()
      .then(({ data }) => {
        setDrafts(data.datos || []);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <section className="view">
      <PageHeader eyebrow="Creación" title="Borradores" text="Historias privadas listas para seguir escribiendo." actionLabel="Nuevo texto" actionTo="/escribir" />
      {estado === 'cargando' && <LoadingState text="Cargando borradores..." />}
      {estado === 'error' && <ErrorState onRetry={cargar} />}
      {estado === 'listo' && (
        <div className="simple-list">
          {drafts.length === 0 && <p>No tienes borradores todavía.</p>}
          {drafts.map((draft) => <a href={`/publicacion/${draft.id}`} key={draft.id}>{draft.titulo}<span>Borrador</span></a>)}
        </div>
      )}
    </section>
  );
}

