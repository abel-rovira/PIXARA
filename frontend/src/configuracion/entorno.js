export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export const OAUTH_ENDPOINTS = {
  google: `${API_URL}/autenticacion/google`,
  apple: `${API_URL}/autenticacion/apple`,
};

