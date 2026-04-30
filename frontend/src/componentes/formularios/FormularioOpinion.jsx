import { useState } from 'react';
import toast from 'react-hot-toast';
import { sendFeedback } from '../../servicios/servicioSitio';
import { getErrorMessage } from '../../servicios/clienteApi';

export default function FeedbackForm() {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    try {
      await sendFeedback(form);
      toast.success('Mensaje enviado');
      setForm({ nombre: '', correo: '', mensaje: '' });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="form-panel wide" onSubmit={submit}>
      <label>Nombre<input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} /></label>
      <label>Correo<input type="email" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} /></label>
      <label>Mensaje<textarea value={form.mensaje} onChange={(event) => setForm({ ...form, mensaje: event.target.value })} required minLength={10} /></label>
      <button disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar feedback'}</button>
    </form>
  );
}

