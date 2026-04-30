import { useMemo, useState } from 'react';
import { preguntasOnboarding } from '../../datos/contenidoProducto';

export default function PreferenceQuiz() {
  const [respuestas, setRespuestas] = useState({});
  const recomendacion = useMemo(() => {
    const valores = Object.values(respuestas);
    if (!valores.length) return 'Elige opciones para montar tu perfil de lectura.';
    if (valores.includes('Negocio') || valores.includes('Marca')) return 'Te conviene seguir estrategia, producto y creadores.';
    if (valores.includes('Técnico')) return 'Te conviene un feed de desarrollo, diseño de sistemas y tutoriales.';
    return 'Te conviene un feed visual, humano y de historias personales.';
  }, [respuestas]);

  return (
    <section className="quiz-box">
      <h2>Configura tu experiencia</h2>
      {preguntasOnboarding.map((pregunta) => (
        <div className="quiz-row" key={pregunta.id}>
          <strong>{pregunta.titulo}</strong>
          <div>
            {pregunta.opciones.map((opcion) => (
              <button
                type="button"
                className={respuestas[pregunta.id] === opcion ? 'selected' : ''}
                onClick={() => setRespuestas({ ...respuestas, [pregunta.id]: opcion })}
                key={opcion}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p>{recomendacion}</p>
    </section>
  );
}

