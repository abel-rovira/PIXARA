import axios from 'axios';
import { API_URL } from '../configuracion/entorno';

export const api = axios.create({ baseURL: API_URL });

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.errores) return Object.values(data.errores).flat().join(' ');
  return data?.mensaje || 'Ha ocurrido un error';
}

