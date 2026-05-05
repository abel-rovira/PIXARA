# Base de datos MongoDB para Pixara

Esta carpeta contiene archivos JSON listos para importar en **MongoDB Compass**.

## Base de datos

Nombre recomendado:

```txt
pixara
```

## Colecciones

Importa estos archivos dentro de la base `pixara`:

```txt
colecciones/usuarios.json
colecciones/publicaciones.json
colecciones/comentarios.json
colecciones/megustas.json
colecciones/guardados.json
colecciones/seguidores.json
colecciones/notificaciones.json
colecciones/preferencias.json
colecciones/sesiones.json
colecciones/reportes.json
colecciones/feedback.json
colecciones/newsletter.json
```

## Cómo importarlo en MongoDB Compass

1. Abre MongoDB Compass.
2. Conecta con:

```txt
mongodb://localhost:27017
```

3. Crea o abre la base:

```txt
pixara
```

4. Crea una colección con el mismo nombre del archivo.

Ejemplo:

```txt
usuarios
```

5. Entra en la colección.
6. Pulsa `Add Data`.
7. Pulsa `Import JSON or CSV file`.
8. Selecciona:

```txt
mongodb/colecciones/usuarios.json
```

9. Repite con las demás colecciones.

## Usuario de prueba

El archivo `usuarios.json` incluye un usuario de prueba:

```txt
usuario: demo
correo: demo@pixara.local
contraseña: 123456
```

La contraseña ya está cifrada con bcrypt.

## Importación recomendada por terminal

Este comando no necesita `mongoimport`, usa Node y Mongoose:

```powershell
node mongodb/importar-mongodb.js
```

## Importación opcional con mongoimport

Si tienes `mongoimport`, puedes ejecutar desde la raíz del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File mongodb/importar-mongodb.ps1
```

Si no tienes `mongoimport`, usa Compass.
