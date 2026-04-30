import { useEffect, useState } from 'react';
import PageHeader from '../componentes/compartido/EncabezadoPagina';
import LoadingState from '../componentes/compartido/EstadoCarga';
import ErrorState from '../componentes/compartido/EstadoError';
import { getSavedPosts } from '../servicios/servicioPublicaciones';

export default function SavedPostsPage() {
  const [posts, setPosts] = useState([]);
  const [estado, setEstado] = useState('cargando');

  const cargar = () => {
    setEstado('cargando');
    getSavedPosts()
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
      <PageHeader eyebrow="Biblioteca" title="Tus historias guardadas" text="Un espacio para volver a lo que merece otra lectura." actionLabel="Explorar" actionTo="/explorar" />
      {estado === 'cargando' && <LoadingState text="Cargando guardados..." />}
      {estado === 'error' && <ErrorState onRetry={cargar} />}
      {estado === 'listo' && (
        <div className="simple-list">
          {posts.length === 0 && <p>No tienes publicaciones guardadas todavía.</p>}
          {posts.map((post) => <a href={`/publicacion/${post.id}`} key={post.id}>{post.titulo}<span>@{post.autor?.nombreUsuario}</span></a>)}
        </div>
      )}
    </section>
  );
}

