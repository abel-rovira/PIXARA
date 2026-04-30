import { api } from './clienteApi';

export function getSavedPosts() {
  return api.get('/publicaciones/guardadas/mias');
}

export function getDrafts() {
  return api.get('/publicaciones/borradores/mios');
}

export function getTrendingPosts() {
  return api.get('/publicaciones/explorar');
}


