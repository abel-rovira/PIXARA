import { api } from './clienteApi';

export function getSiteHealth() {
  return api.get('/sitio/salud');
}

export function getSiteStats() {
  return api.get('/sitio/estadisticas');
}

export function getSiteModules() {
  return api.get('/sitio/modulos');
}

export function getActivity() {
  return api.get('/sitio/actividad');
}

export function getNotifications() {
  return api.get('/sitio/notificaciones');
}

export function subscribeNewsletter(correo) {
  return api.post('/sitio/newsletter', { correo });
}

export function sendFeedback(payload) {
  return api.post('/sitio/feedback', payload);
}


