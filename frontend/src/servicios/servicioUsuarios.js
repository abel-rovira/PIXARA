import { api } from './clienteApi';

export function updateProfile(payload) {
  return api.put('/usuarios/perfil', payload);
}

export function updatePassword(payload) {
  return api.put('/usuarios/cambiar-contrasena', payload);
}


