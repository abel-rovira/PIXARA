import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthToken } from '../servicios/clienteApi';

function decodificarUsuario(valor) {
  try {
    const base64 = valor.replace(/-/g, '+').replace(/_/g, '/');
    const texto = decodeURIComponent(
      atob(base64)
        .split('')
        .map((caracter) => `%${caracter.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('Conectando cuenta...');
  const error = params.get('error');

  useEffect(() => {
    if (error) {
      setEstado(error);
      return;
    }

    const token = params.get('token');
    const usuario = decodificarUsuario(params.get('usuario') || '');

    if (!token || !usuario) {
      setEstado('No se pudo completar la conexión externa.');
      return;
    }

    localStorage.setItem('pixara_token', token);
    localStorage.setItem('pixara_usuario', JSON.stringify(usuario));
    setAuthToken(token);
    setEstado('Sesión iniciada. Redirigiendo...');

    const temporizador = window.setTimeout(() => {
      navigate('/', { replace: true });
      window.location.reload();
    }, 600);

    return () => window.clearTimeout(temporizador);
  }, [error, navigate, params]);

  return (
    <section className="static-page">
      <p className="section-label">OAuth</p>
      <h1>{error ? 'No se pudo conectar' : 'Conectando cuenta'}</h1>
      <p>{estado}</p>
      {error && <Link to="/login">Volver al login</Link>}
    </section>
  );
}
