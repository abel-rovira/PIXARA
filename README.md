<div align="center">
  <h1>PIXARA</h1>
  <p><strong>Plataforma social/editorial para escribir, descubrir historias, seguir autores y crear comunidad alrededor de ideas.</strong></p>
</div>

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Video Demo](#video-demo)
- [Estado Actual](#estado-actual)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [MongoDB](#mongodb)
- [OAuth Google y Apple](#oauth-google-y-apple)
- [API Reference](#api-reference)
- [Scripts Útiles](#scripts-útiles)
- [Producción](#producción)
- [Solución de Problemas](#solución-de-problemas)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

---

## Descripción

**Pixara** es una web social/editorial moderna donde los usuarios pueden registrarse, publicar historias, subir imágenes, comentar, dar me gusta, guardar publicaciones, seguir perfiles y descubrir contenido por intereses.

El proyecto está orientado a una experiencia visual limpia, blanca, editorial y profesional, con navegación responsive, modo oscuro, selector de idioma, páginas legales, cookies, perfil editable y persistencia real con MongoDB.

---

## Video de PIXARA

Puedes añadir un video corto de unos 40 segundos para enseñar la experiencia principal de Pixara.

<video src="screenshots/demo-pixara-comprimido.mp4" controls width="100%"></video>

---

## Estado Actual

El proyecto actualmente incluye:

- Frontend en React + Vite.
- Backend en Node.js + Express.
- MongoDB conectado como base de datos real.
- Registro e inicio de sesión con JWT.
- Login social preparado con Google y Apple mediante OAuth real.
- Publicaciones reales con Markdown, etiquetas e imágenes.
- Perfil editable con foto de perfil.
- Eliminación de foto de perfil.
- Seguidores y seguidos visibles en el perfil.
- Me gusta, comentarios y guardados.
- Publicaciones privadas/borradores.
- Feed de historias con filtros: recientes, para ti, siguiendo y populares.
- Búsqueda de historias y usuarios.
- Estadísticas reales desde MongoDB.
- Modo oscuro.
- Idioma español/inglés.
- Banner de cookies.
- Páginas de soporte, privacidad, cookies y términos.
- Diseño responsive para móvil, tablet y escritorio.
- Seed inicial para crear usuarios y publicaciones de ejemplo.
- `.gitignore` y `AGENTS.md`.
- Herramienta para limpiar textos con codificación rota.

---

## Características

| Categoría | Funcionalidades |
|----------|-----------------|
| **Autenticación** | Registro, login, JWT, sesión persistente y usuario actual |
| **OAuth** | Google y Apple conectados a credenciales reales |
| **Usuarios** | Perfil, avatar, biografía, edición, seguidores y seguidos |
| **Publicaciones** | Crear, listar, detalle, imágenes, Markdown, etiquetas y borradores |
| **Interacción** | Me gusta, comentarios, guardados y publicaciones privadas |
| **Exploración** | Historias recientes, para ti, siguiendo, populares y búsqueda |
| **Diseño** | Interfaz blanca, editorial, responsive, modo oscuro e idiomas |
| **Legal** | Cookies, privacidad, términos y soporte |
| **Backend** | API REST con Express y MongoDB |
| **Base de datos** | MongoDB con Mongoose |

---

## Stack Tecnológico

### Frontend

- React
- Vite
- React Router DOM
- Axios
- React Markdown
- Remark GFM
- Lucide React
- React Hot Toast
- CSS propio en `frontend/src/estilos.css`

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Dotenv

---

## Estructura del Proyecto

```bash
web-social-blog-main/
├── AGENTS.md
├── README.md
├── .gitignore
├── backend/
│   ├── configuracion/
│   ├── controladores/
│   ├── middlewares/
│   ├── modelosMongo/
│   ├── rutas/
│   ├── uploads/
│   ├── utilidades/
│   ├── .env.example
│   └── servidor.js
├── frontend/
│   ├── index.html
│   └── src/
│       ├── Aplicacion.jsx
│       ├── principal.jsx
│       ├── estilos.css
│       ├── componentes/
│       ├── configuracion/
│       ├── datos/
│       ├── ganchos/
│       ├── idiomas/
│       ├── paginas/
│       ├── servicios/
│       └── utilidades/
├── herramientas/
│   └── limpiarCodificacion.js
└── mongodb/
    ├── sembrar-contenido-inicial.js
    ├── importar-mongodb.js
    ├── importar-mongodb.ps1
    └── colecciones/
```

---

## Requisitos Previos

- Node.js v18 o superior
- npm
- MongoDB local o MongoDB Atlas
- MongoDB Compass opcional para ver la base de datos

No necesitas MySQL. El objetivo actual del proyecto es MongoDB.

---

## Instalación

### 1. Clonar el proyecto

```bash
git clone https://github.com/tu-usuario/pixara.git
cd pixara
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Configurar backend

Crea un archivo `.env` dentro de `backend/`:

```env
PORT=5000
DB_PROVIDER=mongodb
JWT_SECRET=cambia_esto_por_un_secreto_largo
JWT_EXPIRACION=7d
MONGODB_URI=mongodb://localhost:27017/pixara
FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/autenticacion/oauth/callback

APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=
APPLE_CALLBACK_URL=http://localhost:5000/api/autenticacion/oauth/callback
```

### 4. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

Opcionalmente crea `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Ejecución

### 1. Arrancar MongoDB

En Windows:

```powershell
net start MongoDB
```

### 2. Arrancar backend

```bash
cd backend
npm start
```

Backend:

```bash
http://localhost:5000
```

### 3. Arrancar frontend

```bash
cd frontend
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

---

## MongoDB

La base de datos se conecta con:

```env
MONGODB_URI=mongodb://localhost:27017/pixara
```

Modelos principales:

- Usuario
- Publicación
- Comentario
- Me gusta
- Guardado
- Seguidor

Para crear contenido inicial:

```bash
node mongodb/sembrar-contenido-inicial.js
```

Usuarios de ejemplo creados por el seed:

- `pixara`
- `afinidad`
- `criterio`
- `mapa`
- `sombra`

Contraseña de ejemplo:

```bash
pixara123
```

---

## OAuth Google y Apple

El proyecto tiene flujo OAuth real preparado.

### Google

En Google Cloud Console configura:

```text
Authorized JavaScript origins:
http://localhost:5173

Authorized redirect URI:
http://localhost:5000/api/autenticacion/oauth/callback
```

Variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/autenticacion/oauth/callback
```

### Apple

Necesitas cuenta de Apple Developer, un Services ID y una clave privada.

Variables:

```env
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=
APPLE_CALLBACK_URL=http://localhost:5000/api/autenticacion/oauth/callback
```

Apple suele devolver el callback con `POST`, y el backend ya soporta `GET` y `POST` para `/api/autenticacion/oauth/callback`.

---

## API Reference

### Sitio

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/sitio/salud` | Estado de la API |
| `GET` | `/api/sitio/estadisticas` | Estadísticas reales |
| `GET` | `/api/sitio/modulos` | Módulos activos |
| `GET` | `/api/sitio/actividad` | Actividad reciente |
| `GET` | `/api/sitio/notificaciones` | Notificaciones |
| `POST` | `/api/sitio/newsletter` | Suscripción al boletín |
| `POST` | `/api/sitio/feedback` | Enviar feedback |

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/autenticacion/registro` | Registrar usuario |
| `POST` | `/api/autenticacion/login` | Iniciar sesión |
| `GET` | `/api/autenticacion/yo` | Usuario actual |
| `GET` | `/api/autenticacion/google` | Iniciar OAuth Google |
| `GET` | `/api/autenticacion/apple` | Iniciar OAuth Apple |
| `GET` | `/api/autenticacion/oauth/callback` | Callback OAuth |
| `POST` | `/api/autenticacion/oauth/callback` | Callback OAuth Apple |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/usuarios/buscar` | Buscar usuarios |
| `GET` | `/api/usuarios/:nombreUsuario` | Perfil de usuario |
| `PUT` | `/api/usuarios/perfil` | Actualizar perfil |
| `DELETE` | `/api/usuarios/perfil/avatar` | Eliminar foto de perfil |

### Publicaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/publicaciones` | Listar publicaciones |
| `GET` | `/api/publicaciones/feed` | Feed personalizado |
| `GET` | `/api/publicaciones/siguiendo` | Publicaciones de usuarios seguidos |
| `GET` | `/api/publicaciones/explorar` | Populares/tendencias |
| `GET` | `/api/publicaciones/buscar` | Buscar publicaciones |
| `GET` | `/api/publicaciones/:id` | Obtener publicación |
| `POST` | `/api/publicaciones` | Crear publicación |
| `PUT` | `/api/publicaciones/:id` | Actualizar o poner privada |
| `DELETE` | `/api/publicaciones/:id` | Eliminar publicación |
| `POST` | `/api/publicaciones/:id/me-gusta` | Dar o quitar me gusta |
| `POST` | `/api/publicaciones/:id/guardar` | Guardar o quitar guardado |
| `GET` | `/api/publicaciones/guardadas/mias` | Publicaciones guardadas |
| `GET` | `/api/publicaciones/borradores/mios` | Borradores |

### Comentarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/comentarios` | Crear comentario |

### Seguidores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/seguidores/seguir/:id` | Seguir usuario |
| `DELETE` | `/api/seguidores/dejar-seguir/:id` | Dejar de seguir |
| `GET` | `/api/seguidores/:id/seguidores` | Ver seguidores |
| `GET` | `/api/seguidores/:id/siguiendo` | Ver usuarios seguidos |

---

## Scripts Útiles

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

### Backend

```bash
npm start
npm run dev
```

### Revisar codificación rota

```bash
node herramientas/limpiarCodificacion.js
```

### Auditoría de vulnerabilidades

Ejecutar en raíz, backend y frontend:

```bash
npm audit --audit-level=low
```

---

## Producción

Antes de subir a producción:

- Cambia `JWT_SECRET` por una clave larga.
- Usa MongoDB Atlas o una instancia MongoDB real.
- Cambia `FRONTEND_URL` al dominio real.
- Cambia `VITE_API_URL` a la URL real del backend.
- Configura OAuth con URLs de producción.
- No uses uploads locales si tu hosting borra archivos al reiniciar; usa Cloudinary, S3 o similar.
- Ejecuta `npm audit --audit-level=low`.
- Ejecuta `npm run build` en frontend.
- Ejecuta `node --check servidor.js` en backend.

---

## Solución de Problemas

| Problema | Solución |
|----------|----------|
| `npm run dev` no existe | Ejecuta ese comando dentro de `frontend/`, no en la raíz ni en `backend/` |
| MongoDB no conecta | Ejecuta `net start MongoDB` o revisa `MONGODB_URI` |
| No se guarda un usuario | Revisa que `DB_PROVIDER=mongodb` y que el backend esté arrancado |
| OAuth no funciona | Faltan credenciales reales o la URL callback no coincide |
| Las imágenes no aparecen | Revisa la carpeta `backend/uploads/` y la URL del backend |
| Textos con codificación rota | Ejecuta `node herramientas/limpiarCodificacion.js` |
| El puerto está ocupado | Cambia `PORT` o cierra el proceso anterior |

---

## Roadmap

Próximos pasos recomendados:

- Recuperación de contraseña.
- Verificación de correo.
- Notificaciones reales persistentes.
- Panel de administración.
- Sistema de reportes/moderación.
- Almacenamiento de imágenes en Cloudinary o S3.
- Tests automatizados.
- Despliegue completo en producción.


---

<div align="center">
  <strong>PIXARA</strong> — leer, escribir y conectar sin ruido.
</div>
