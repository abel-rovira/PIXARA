import { useEffect, useState } from 'react';
import PageHeader from '../componentes/compartido/EncabezadoPagina';
import LoadingState from '../componentes/compartido/EstadoCarga';
import ErrorState from '../componentes/compartido/EstadoError';
import { getTrendingPosts } from '../servicios/servicioPublicaciones';
import { plainText } from '../utilidades/formateadores';

export default function TrendsPage() {
  const [posts, setPosts] = useState([]);
  const [estado, setEstado] = useState('cargando');

  const cargar = () => {
    setEstado('cargando');
    getTrendingPosts()
      .then(({ data }) => {
        setPosts(data.datos || []);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <section className="view">
      <PageHeader eyebrow="Tendencias" title="Lo que se está moviendo" text="Una vista limpia para detectar historias con más conversación y señales sociales." />
      {estado === 'cargando' && <LoadingState text="Cargando tendencias..." />}
      {estado === 'error' && <ErrorState onRetry={cargar} />}
      {estado === 'listo' && (
        <div className="trend-board">
          {posts.map((post, index) => (
            <article key={post.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{post.titulo}</h2>
                <p>{plainText(post.contenido || '').slice(0, 240)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

