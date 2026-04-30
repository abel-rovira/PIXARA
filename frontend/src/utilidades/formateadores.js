import { API_ORIGIN } from '../configuracion/entorno';

export function assetUrl(value) {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  return `${API_ORIGIN}${value}`;
}

export function plainText(markdown = '') {
  return markdown.replace(/[#*_>`[\]()]/g, '').replace(/\s+/g, ' ').trim();
}

