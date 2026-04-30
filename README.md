<div align="center">
  <h1>PIXARA — Blog Social</h1>
  <p><strong>Plataforma de blogging social donde escritores comparten historias, conectan con lectores y construyen su audiencia.</strong></p>
</div>

---

## Tabla de Contenidos

- [Capturas de Pantalla](#capturas-de-pantalla)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [API Reference](#api-reference)
- [Despliegue](#despliegue)
- [Solución de Problemas](#solución-de-problemas)
- [Licencia](#licencia)

---

## Capturas de Pantalla

### Página Principal

<img width="1839" height="902" alt="image" src="https://github.com/user-attachments/assets/ef493285-5871-4c32-a64a-51950287aa63" />

### Login y Registro

| Login | Registro |
|-------|----------|
| <img width="644" height="553" alt="image" src="https://github.com/user-attachments/assets/f226331b-02c5-47ff-81fa-0de1c4011fcc" /> | <img width="514" height="634" alt="image" src="https://github.com/user-attachments/assets/47690620-7d90-40fb-8bda-868dced5a47d" /> |

---

## Características

| Categoría | Funcionalidades |
|-----------|----------------|
| **Autenticación** | Registro, inicio y cierre de sesión con JWT |
| **Publicaciones** | Crear, editar y eliminar con soporte completo de Markdown e imágenes |
| **Interacción** | Me gusta, comentarios y guardado de publicaciones |
| **Social** | Seguir/dejar de seguir usuarios, feed personalizado |
| **Perfil** | Avatar, biografía, historial de publicaciones y estadísticas |
| **Exploración** | Publicaciones trending, búsqueda en tiempo real y carrusel destacado |
| **Diseño** | Responsive — optimizado para móvil y escritorio |

---

## Stack Tecnológico

**Backend**
- Node.js + Express
- MySQL 8 + Sequelize ORM
- JWT · Bcrypt · Multer

**Frontend**
- React + React Router DOM
- TailwindCSS
- Axios · React Markdown · Lucide React · React Hot Toast

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://www.mysql.com/) v8 o superior
- npm o Yarn

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pixara.git
cd pixara
```

### 2. Configurar la base de datos

```bash
mysql -u root -p
```

```sql
CREATE DATABASE ns_red_social_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ns_red_social_blog;
SOURCE backend/sql/00_prueba_baseDatos.sql;
```

### 3. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=ns_red_social_blog
DB_PORT=3306
PORT=5000
JWT_SECRET=tu_clave_secreta_muy_segura
```

```bash
npm start
# Servidor disponible en http://localhost:5000
```

### 4. Configurar el Frontend

```bash
cd frontend
npm install
```

Crea el archivo `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
npm start
# Aplicación disponible en http://localhost:3000
```

---

## Uso

<details>
<summary><strong>Registro e Inicio de Sesión</strong></summary>

- Accede a `/registro` para crear una cuenta con nombre de usuario, email y contraseña.
- Accede a `/login` para iniciar sesión. Serás redirigido automáticamente al home.

</details>

<details>
<summary><strong>Crear una Publicación</strong></summary>

1. Inicia sesión y haz clic en **"Escribir"** en la barra de navegación.
2. Completa el título, el contenido (soporta Markdown) y añade imágenes opcionales.
3. Agrega etiquetas separadas por comas para mejorar la visibilidad.
4. Elige **Publicar** o **Guardar como borrador**.

</details>

<details>
<summary><strong>Interactuar con Publicaciones</strong></summary>

- **Me gusta** — haz clic en el ícono de corazón en cualquier publicación.
- **Guardar** — guarda publicaciones para leerlas más tarde desde la sección *Guardados*.
- **Comentar** — abre una publicación y escribe tu comentario al pie.

</details>

<details>
<summary><strong>Perfil y Seguimiento</strong></summary>

- Edita tu perfil (avatar, biografía, datos personales) desde tu página de usuario.
- Visita el perfil de otro usuario para seguirlo o dejar de seguirlo.
- Tu feed mostrará las publicaciones de las personas que sigues.

</details>

<details>
<summary><strong>Explorar y Buscar</strong></summary>

- La sección **Explorar** muestra las publicaciones con más actividad (trending).
- La **barra de búsqueda** filtra publicaciones por título o contenido en tiempo real.

</details>

---

## API Reference

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/autenticacion/registro` | Registrar nuevo usuario |
| `POST` | `/api/autenticacion/login` | Iniciar sesión |
| `GET` | `/api/autenticacion/yo` | Obtener usuario actual |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/usuarios/:nombreUsuario` | Obtener perfil |
| `PUT` | `/api/usuarios/perfil` | Actualizar perfil |
| `PUT` | `/api/usuarios/cambiar-contrasena` | Cambiar contraseña |
| `GET` | `/api/usuarios/buscar` | Buscar usuarios |

### Publicaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/publicaciones` | Listar publicaciones |
| `GET` | `/api/publicaciones/feed` | Feed personalizado |
| `GET` | `/api/publicaciones/explorar` | Publicaciones trending |
| `GET` | `/api/publicaciones/:id` | Obtener por ID |
| `POST` | `/api/publicaciones` | Crear publicación |
| `PUT` | `/api/publicaciones/:id` | Actualizar publicación |
| `DELETE` | `/api/publicaciones/:id` | Eliminar publicación |
| `POST` | `/api/publicaciones/:id/me-gusta` | Dar/quitar me gusta |
| `POST` | `/api/publicaciones/:id/guardar` | Guardar/quitar publicación |

### Comentarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/comentarios/publicacion/:id` | Obtener comentarios |
| `POST` | `/api/comentarios` | Crear comentario |
| `PUT` | `/api/comentarios/:id` | Actualizar comentario |
| `DELETE` | `/api/comentarios/:id` | Eliminar comentario |

### Seguidores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/seguidores/seguir/:usuarioId` | Seguir usuario |
| `DELETE` | `/api/seguidores/dejar-seguir/:usuarioId` | Dejar de seguir |
| `GET` | `/api/seguidores/:usuarioId/seguidores` | Listar seguidores |
| `GET` | `/api/seguidores/:usuarioId/siguiendo` | Listar seguidos |
| `GET` | `/api/seguidores/verificar/:usuarioId` | Verificar seguimiento |

---

## Despliegue

### Backend

```bash
NODE_ENV=production
JWT_SECRET=clave_larga_y_aleatoria

npm install -g pm2
pm2 start server.js --name pixara-api
```

Configura CORS para aceptar únicamente el dominio del frontend en producción.

### Frontend

```bash
npm run build
# Sirve la carpeta /build con Nginx, Apache o Vercel
```

> Asegúrate de que la carpeta `backend/uploads/` exista y tenga permisos de escritura en producción.

---

## Solución de Problemas

| Problema | Solución |
|----------|----------|
| Error de conexión a la base de datos | Verifica que MySQL esté activo y que las credenciales en `.env` sean correctas |
| Módulos no encontrados | Ejecuta `npm install`. Si persiste, elimina `node_modules` y `package-lock.json` y reinstala |
| Error al iniciar sesión | Comprueba que el backend esté en ejecución y revisa los logs de la consola |
| Las imágenes no cargan | Verifica que exista la carpeta `backend/uploads/` con permisos de escritura |

---

## Licencia

Distribuido bajo la Licencia ISC. Consulta el archivo `LICENSE` para más información.

---

<div align="center">
Para soporte o consultas, abre un issue en el repositorio del proyecto.
</div>

---

Guarda tus capturas en la carpeta `screenshots/` con estos nombres:

| Archivo | Sección |
|--------|---------|
| `screenshots/home.png` | Página principal |
| `screenshots/login.png` | Pantalla de login |
| `screenshots/registro.png` | Pantalla de registro |
| `screenshots/perfil.png` | Perfil de usuario |
