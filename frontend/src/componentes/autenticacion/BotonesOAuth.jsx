import toast from 'react-hot-toast';
import { startOAuth } from '../../servicios/servicioAutenticacion';

function IconoGoogle() {
  return (
    <svg className="oauth-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function IconoApple() {
  return (
    <svg className="oauth-icon apple-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M16.48 12.77c-.02-2.06 1.68-3.06 1.76-3.11-.96-1.4-2.44-1.59-2.96-1.61-1.25-.13-2.45.74-3.08.74-.64 0-1.62-.72-2.66-.7-1.37.02-2.64.8-3.35 2.03-1.43 2.48-.36 6.15 1.03 8.16.68.98 1.49 2.09 2.55 2.05 1.03-.04 1.41-.66 2.65-.66 1.23 0 1.59.66 2.68.64 1.1-.02 1.8-1 2.47-1.99.78-1.14 1.1-2.24 1.12-2.3-.02-.01-2.18-.84-2.21-3.25zM14.46 6.73c.56-.68.94-1.63.84-2.57-.81.03-1.8.54-2.38 1.22-.52.6-.98 1.57-.86 2.49.91.07 1.84-.46 2.4-1.14z" />
    </svg>
  );
}

export default function BotonesOAuth() {
  const handleOAuth = (provider) => {
    toast('Redirigiendo al proveedor...');
    startOAuth(provider);
  };

  return (
    <div className="oauth-stack">
      <button type="button" className="oauth-button" onClick={() => handleOAuth('google')}>
        <IconoGoogle /> Continuar con Google
      </button>
      <button type="button" className="oauth-button" onClick={() => handleOAuth('apple')}>
        <IconoApple /> Continuar con Apple
      </button>
    </div>
  );
}
