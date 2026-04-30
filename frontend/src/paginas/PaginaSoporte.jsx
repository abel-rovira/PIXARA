export default function SupportPage() {
  return (
    <section className="static-page">
      <p className="section-label">Soporte</p>
      <h1>Centro de ayuda</h1>
      <p>Encuentra ayuda para cuentas, publicaciones, privacidad, comentarios, reportes y configuración.</p>
      <div className="support-grid">
        <article><h2>Cuenta</h2><p>Login, registro, perfil y recuperación.</p></article>
        <article><h2>Publicar</h2><p>Markdown, imágenes, borradores y etiquetas.</p></article>
        <article><h2>Comunidad</h2><p>Seguidores, comentarios, normas y reportes.</p></article>
      </div>
    </section>
  );
}

