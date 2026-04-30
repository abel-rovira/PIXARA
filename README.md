<div align="center">
  <h1>PIXARA</h1>
  <p><strong>Plataforma social de escritura donde lectores descubren historias, autores publican contenido y la comunidad conecta alrededor de ideas.</strong></p>
</div>

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Estado Actual](#estado-actual)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Modo Demo](#modo-demo)
- [MongoDB](#mongodb)
- [OAuth Google y Apple](#oauth-google-y-apple)
- [API Reference](#api-reference)
- [Scripts Útiles](#scripts-útiles)
- [Solución de Problemas](#solución-de-problemas)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

---

## Descripción

**Pixara** es una web social/editorial pensada para publicar, descubrir y guardar historias.  
La experiencia está diseñada con una estética limpia, blanca, minimalista y profesional, evitando el aspecto típico de una plantilla generada.

Actualmente el proyecto funciona en **modo demo**, sin depender de MySQL ni de una base de datos obligatoria. Está preparado para que más adelante se conecte una base de datos real con **MongoDB**.

---

## Estado Actual

El proyecto actualmente incluye:

- Frontend en React + Vite.
- Backend en Node.js + Express.
- Modo demo funcional sin base de datos.
- Preparación para futura integración con MongoDB.
- Login y registro demo.
- Publicaciones demo.
- Guardados demo.
- Borradores demo.
- Comentarios demo.
- Estadísticas demo.
- Notificaciones demo.
- Newsletter y feedback conectados al backend.
- OAuth visual preparado con Google y Apple.
- Diseño responsive.
- Archivos y carpetas del frontend organizados en español.
- `.gitignore` configurado.
- `AGENTS.md` con reglas del proyecto.
- Herramienta para detectar textos con codificación rota.

---

## Características

| Categoría | Funcionalidades |
|----------|-----------------|
| **Autenticación** | Login demo, registro demo, sesión local y preparación para JWT real |
| **OAuth** | Botones con iconos originales de Google y Apple |
| **Publicaciones** | Listado, detalle, creación demo, Markdown, imágenes y etiquetas |
| **Interacción** | Me gusta, comentarios y guardados |
| **Social** | Perfil, seguidores demo y comunidad |
| **Exploración** | Carrusel destacado, tendencias, búsqueda y temas |
| **Usuario** | Perfil, ajustes, notificaciones, guardados y borradores |
| **Producto** | Página de producto, planes, creadores, comunidad y soporte |
| **Legal** | Privacidad, cookies y términos |
| **Diseño** | Interfaz blanca, minimalista, responsive y más profesional |
| **Backend** | API demo funcional sin MySQL |
| **MongoDB** | Preparado para futura conexión mediante `MONGODB_URI` |

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
- CSS propio en `estilos.css`

### Backend

- Node.js
- Express
- JWT
- Multer
- Dotenv
- Base de datos MongoDB

### Preparado para futuro

- MongoDB
- Autenticación OAuth real
- Persistencia real de usuarios, publicaciones, comentarios y guardados

---

## Estructura del Proyecto

```bash
web-social-blog-main/
├── AGENTS.md
├── .gitignore
├── backend/
│   ├── configuracion/
│   │   ├── mongo.js
│   │   ├── jwt.js
│   │   └── baseDatos.js
│   ├── controladores/
│   ├── middlewares/
│   ├── modelos/
│   ├── rutas/
│   │   ├── demostracion.js
│   │   ├── autenticacion.js
│   │   ├── publicaciones.js
│   │   ├── comentarios.js
│   │   ├── seguidores.js
│   │   ├── sitio.js
│   │   └── usuarios.js
│   ├── uploads/
│   ├── utilidades/
│   ├── .env.example
│   └── servidor.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Aplicacion.jsx
│   │   ├── principal.jsx
│   │   ├── estilos.css
│   │   ├── componentes/
│   │   ├── configuracion/
│   │   ├── datos/
│   │   ├── ganchos/
│   │   ├── paginas/
│   │   ├── servicios/
│   │   └── utilidades/
│   └── index.html
└── herramientas/
    └── limpiarCodificacion.js
```

---

## Requisitos Previos

- Node.js v18 o superior
- npm

No necesitas MySQL para arrancar el proyecto actual.

MongoDB será necesario más adelante cuando se implemente la persistencia real.

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

Crea un archivo `.env` en `backend/` usando como referencia `.env.example`.

Ejemplo recomendado actualmente:

```env
PORT=5000
DB_PROVIDER=demo
JWT_SECRET=pixara_demo_secret
JWT_EXPIRACION=7d
MONGODB_URI=mongodb://localhost:27017/pixara
FRONTEND_URL=http://localhost:5173
```

### 4. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

Opcionalmente puedes crear un `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Uso

### Arrancar backend

```bash
cd backend
npm start
```

Backend disponible en:

```bash
http://localhost:5000
```

### Arrancar frontend

```bash
cd frontend
npm run dev
```

Frontend disponible normalmente en:

```bash
http://localhost:5173
```

---

## Modo Demo

El proyecto está configurado por defecto con:

```env
DB_PROVIDER=demo
```

Esto permite que la aplicación funcione sin base de datos.

En modo demo funcionan:

- Login
- Registro
- Usuario actual
- Publicaciones
- Búsqueda
- Guardados
- Borradores
- Comentarios
- Likes
- Seguidores
- Estadísticas
- Notificaciones
- Newsletter
- Feedback

Este modo sirve para desarrollar diseño, experiencia y flujos antes de conectar MongoDB.

---

## MongoDB

MongoDB todavía no está conectado como base de datos real, pero el proyecto ya está preparado para ello.

Variable preparada:

```env
MONGODB_URI=mongodb://localhost:27017/pixara
```

Cuando se implemente MongoDB, los modelos recomendados serán:

- Usuario
- Publicación
- Comentario
- Me gusta
- Guardado
- Seguidor
- Notificación
- Preferencias
- Sesión OAuth

---

## OAuth Google y Apple

El frontend ya incluye botones de acceso con iconos SVG de:

- Google
- Apple

Actualmente las rutas están preparadas, pero falta configurar credenciales reales.

Variables previstas:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/autenticacion/oauth/callback

APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=
APPLE_CALLBACK_URL=http://localhost:5000/api/autenticacion/oauth/callback
```

---

## API Reference

### Sitio

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/sitio/salud` | Estado de la API |
| `GET` | `/api/sitio/estadisticas` | Estadísticas generales |
| `GET` | `/api/sitio/modulos` | Módulos activos |
| `GET` | `/api/sitio/actividad` | Actividad reciente |
| `GET` | `/api/sitio/notificaciones` | Notificaciones demo |
| `POST` | `/api/sitio/newsletter` | Suscripción al boletín |
| `POST` | `/api/sitio/feedback` | Enviar feedback |

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/autenticacion/registro` | Registro demo |
| `POST` | `/api/autenticacion/login` | Login demo |
| `GET` | `/api/autenticacion/yo` | Usuario actual |
| `GET` | `/api/autenticacion/google` | OAuth Google preparado |
| `GET` | `/api/autenticacion/apple` | OAuth Apple preparado |

### Publicaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/publicaciones` | Listar publicaciones |
| `GET` | `/api/publicaciones/feed` | Feed |
| `GET` | `/api/publicaciones/explorar` | Tendencias |
| `GET` | `/api/publicaciones/buscar` | Buscar publicaciones |
| `GET` | `/api/publicaciones/:id` | Obtener publicación |
| `POST` | `/api/publicaciones` | Crear publicación demo |
| `POST` | `/api/publicaciones/:id/me-gusta` | Dar me gusta |
| `POST` | `/api/publicaciones/:id/guardar` | Guardar publicación |
| `GET` | `/api/publicaciones/guardadas/mias` | Publicaciones guardadas |
| `GET` | `/api/publicaciones/borradores/mios` | Borradores |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/usuarios/buscar` | Buscar usuarios |
| `GET` | `/api/usuarios/:nombreUsuario` | Perfil de usuario |
| `PUT` | `/api/usuarios/perfil` | Actualizar perfil demo |
| `PUT` | `/api/usuarios/cambiar-contrasena` | Cambiar contraseña demo |

### Comentarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/comentarios` | Crear comentario demo |

### Seguidores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/seguidores/seguir/:id` | Seguir usuario |
| `DELETE` | `/api/seguidores/dejar-seguir/:id` | Dejar de seguir |

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

## Verificación del Proyecto

Comandos recomendados antes de subir cambios:

```bash
cd frontend
npm run build
```

```bash
cd backend
node --check servidor.js
node --check rutas/demostracion.js
```

```bash
node herramientas/limpiarCodificacion.js
```

---

## Solución de Problemas

| Problema | Solución |
|----------|----------|
| El frontend no arranca | Ejecuta `npm install` dentro de `frontend` |
| El backend no arranca | Revisa el `.env` y asegúrate de tener `DB_PROVIDER=demo` |
| Aparecen textos raros como `OpiniÃ³n` | Ejecuta `node herramientas/limpiarCodificacion.js` |
| OAuth no inicia sesión real | Faltan credenciales reales de Google/Apple |
| No hay datos reales | El proyecto está en modo demo hasta conectar MongoDB |
| El puerto está ocupado | Cambia `PORT` en `backend/.env` o cierra el proceso anterior |

---

## Roadmap

Próximos pasos recomendados:

- Conectar MongoDB real.
- Crear modelos de usuario, publicación, comentario y guardado.
- Sustituir rutas demo por controladores MongoDB.
- Implementar OAuth real con Google.
- Implementar OAuth real con Apple.
- Añadir recuperación de contraseña.
- Añadir subida real de imágenes.
- Añadir panel de administración.
- Añadir sistema de reportes.
- Añadir tests.
- Preparar despliegue en producción.

---

## Licencia

Distribuido bajo licencia ISC.

---

<div align="center">
  <strong>Pixara</strong> — una plataforma social para leer, escribir y conectar.
</div>
