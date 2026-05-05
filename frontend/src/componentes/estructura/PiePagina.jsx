import { Link } from 'react-router-dom';

export default function Footer({ textos }) {
  return (
    <footer className="site-footer">
      <div>
        <strong className="footer-brand">PIXARA</strong>
        <p>{textos?.descripcion || 'Historias, autores y conversaciones con una experiencia limpia.'}</p>
      </div>
      <nav>
        <Link to="/soporte">{textos?.soporte || 'Soporte'}</Link>
        <Link to="/privacidad">{textos?.privacidad || 'Privacidad'}</Link>
        <Link to="/cookies">{textos?.cookies || 'Cookies'}</Link>
        <Link to="/terminos">{textos?.terminos || 'Términos'}</Link>
      </nav>
    </footer>
  );
}

