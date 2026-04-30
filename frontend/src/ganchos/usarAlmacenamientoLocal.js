import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key);
    if (raw === null) return initialValue;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  });

  useEffect(() => {
    if (value === undefined || value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

