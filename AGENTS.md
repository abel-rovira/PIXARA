# AGENTS.md

## Idioma

Todo el proyecto, comentarios, textos visibles, documentación y mensajes al usuario deben estar en español.

## Objetivo del producto

Pixara es una web social/editorial moderna: minimalista, blanca, limpia, cuadrada y con sensación de producto real. Debe parecer una plataforma cuidada, no una maqueta generada rápido.

## Estilo visual

- Priorizar diseño blanco, ordenado, amplio y profesional.
- Usar bordes rectos o radios muy pequeños.
- Evitar degradados exagerados, sombras fuertes, estilos genéricos de IA y decoración innecesaria.
- El menú principal debe ser textual, limpio y centrado.
- El carrusel debe mantener imágenes/visuales con tamaño consistente.
- Todo debe ser responsive y no romper en móvil.

## Backend

- No usar MySQL como objetivo final.
- El modo actual por defecto es `demo`, para que la app funcione sin base de datos.
- La base de datos final se hará con MongoDB cuando se implemente persistencia real.
- No crear esquemas MongoDB definitivos hasta que se decida el modelo de datos.
- Mantener endpoints funcionales aunque sea con datos demo.

## Frontend

- Mantener Vite + React.
- Separar servicios, páginas, componentes y datos.
- No concentrar nuevas funcionalidades grandes en `App.jsx`.
- Toda funcionalidad nueva debe tener estado de carga/error cuando llame a API.

## Verificación

Antes de cerrar cambios importantes:

```bash
cd frontend
npm run build
```

```bash
cd backend
node --check servidor.js
```

También comprobar:

```bash
npm audit --audit-level=low
```

en raíz, frontend y backend cuando se cambien dependencias.
