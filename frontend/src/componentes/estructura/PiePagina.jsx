import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>pixara</strong>
        <p>Historias, autores y conversaciones con una experiencia limpia.</p>
      </div>
      <nav>
        <Link to="/soporte">Soporte</Link>
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/cookies">Cookies</Link>
        <Link to="/terminos">Términos</Link>
      </nav>
    </footer>
  );
}

