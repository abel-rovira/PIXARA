import { useState } from 'react';
import toast from 'react-hot-toast';
import { subscribeNewsletter } from '../../servicios/servicioSitio';
import { getErrorMessage } from '../../servicios/clienteApi';

export default function NewsletterSignup() {
  const [correo, setCorreo] = useState('');
  const [enviando, setEnviando] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    try {
      await subscribeNewsletter(correo);
      toast.success('Te avisaremos de las novedades');
      setCorreo('');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="inline-form" onSubmit={submit}>
      <input type="email" value={correo} onChange={(event) => setCorreo(event.target.value)} placeholder="tu@email.com" required />
      <button disabled={enviando}>{enviando ? 'Enviando...' : 'Unirme'}</button>
    </form>
  );
}

