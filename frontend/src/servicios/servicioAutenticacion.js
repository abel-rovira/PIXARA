import { api } from './clienteApi';
import { OAUTH_ENDPOINTS } from '../configuracion/entorno';

export function login(payload) {
  return api.post('/autenticacion/login', payload);
}

export function register(payload) {
  return api.post('/autenticacion/registro', payload);
}

export function getCurrentUser() {
  return api.get('/autenticacion/yo');
}

export function startOAuth(provider) {
  const url = OAUTH_ENDPOINTS[provider];
  if (!url) return;
  window.location.href = url;
}


