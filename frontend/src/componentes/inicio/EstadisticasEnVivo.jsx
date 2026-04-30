import { useEffect, useState } from 'react';
import { getSiteStats } from '../../servicios/servicioSitio';

const inicial = { usuarios: 0, publicaciones: 0, comentarios: 0, guardados: 0, crecimiento: [] };

export default function LiveStats() {
  const [stats, setStats] = useState(inicial);

  useEffect(() => {
    getSiteStats()
      .then(({ data }) => setStats(data.datos || inicial))
      .catch(() => setStats(inicial));
  }, []);

  const items = [
    ['Usuarios', stats.usuarios],
    ['Historias', stats.publicaciones],
    ['Comentarios', stats.comentarios],
    ['Guardados', stats.guardados]
  ];

  return (
    <section className="live-stats">
      {items.map(([label, value]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
      <div className="stat-chart">
        {(stats.crecimiento || []).map((item) => (
          <i key={item.etiqueta} style={{ height: `${Math.max(18, item.valor)}%` }} title={item.etiqueta} />
        ))}
      </div>
    </section>
  );
}

