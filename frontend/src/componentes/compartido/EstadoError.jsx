export default function ErrorState({ title = 'Algo ha fallado', text = 'Prueba de nuevo en unos segundos.', onRetry }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{text}</p>
      {onRetry && <button className="retry" type="button" onClick={onRetry}>Reintentar</button>}
    </div>
  );
}

