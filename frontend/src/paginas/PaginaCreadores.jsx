import PageHeader from '../componentes/compartido/EncabezadoPagina';
import PreferenceQuiz from '../componentes/interactivo/CuestionarioPreferencias';

export default function CreatorsPage() {
  return (
    <section className="view">
      <PageHeader eyebrow="Creadores" title="Herramientas para publicar mejor" text="Un espacio para autores con borradores, métricas, guardados y recomendaciones de contenido." actionLabel="Escribir" actionTo="/escribir" />
      <PreferenceQuiz />
    </section>
  );
}

