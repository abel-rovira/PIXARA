import { Link } from 'react-router-dom';

export default function OAuthCallbackPage() {
  return (
    <section className="static-page">
      <p className="section-label">OAuth</p>
      <h1>Conexión externa preparada</h1>
      <p>Cuando configuremos Google o Apple en backend, esta pantalla recibirá el token y completará la sesión.</p>
      <Link to="/login">Volver al login</Link>
    </section>
  );
}

