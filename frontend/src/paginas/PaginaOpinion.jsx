import EncabezadoPagina from '../componentes/compartido/EncabezadoPagina';
import FormularioOpinion from '../componentes/formularios/FormularioOpinion';

export default function PaginaOpinion() {
  return (
    <section className="view">
      <EncabezadoPagina eyebrow="Contacto" title="Ayúdanos a mejorar Pixara" text="Envía ideas, errores o mejoras. El endpoint ya está conectado al backend." />
      <FormularioOpinion />
    </section>
  );
}
