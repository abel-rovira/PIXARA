import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../componentes/compartido/EncabezadoPagina';
import { getErrorMessage } from '../servicios/clienteApi';
import { updatePassword } from '../servicios/servicioUsuarios';

export default function SettingsPage() {
  const [form, setForm] = useState({ contrasenaActual: '', nuevaContrasena: '' });
  const [enviando, setEnviando] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    try {
      await updatePassword(form);
      toast.success('Contraseña actualizada');
      setForm({ contrasenaActual: '', nuevaContrasena: '' });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="view">
      <PageHeader eyebrow="Cuenta" title="Ajustes" text="Seguridad, preferencias y datos de usuario." />
      <form className="form-panel wide" onSubmit={submit}>
        <h2>Cambiar contraseña</h2>
        <label>Contraseña actual<input type="password" value={form.contrasenaActual} onChange={(event) => setForm({ ...form, contrasenaActual: event.target.value })} required /></label>
        <label>Nueva contraseña<input type="password" value={form.nuevaContrasena} onChange={(event) => setForm({ ...form, nuevaContrasena: event.target.value })} required minLength={6} /></label>
        <button disabled={enviando}>{enviando ? 'Guardando...' : 'Actualizar'}</button>
      </form>
    </section>
  );
}

