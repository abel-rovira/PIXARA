-- Base de datos
CREATE DATABASE ns_red_social_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ns_red_social_blog;

-- Tabla usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT 'https://via.placeholder.com/150',
    biografia TEXT,
    enlaces JSON,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tabla publicaciones
CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    imagenes JSON,
    es_borrador BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- tabla etiquetas
CREATE TABLE etiquetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- tabla intermedia publicaciones_etiquetas
CREATE TABLE publicaciones_etiquetas (
    publicacion_id INT NOT NULL,
    etiqueta_id INT NOT NULL,
    PRIMARY KEY (publicacion_id, etiqueta_id),
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE
);

-- tabla comentarios
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    publicacion_id INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE
);

-- tabla me_gusta
CREATE TABLE me_gusta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    publicacion_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY usuario_publicacion (usuario_id, publicacion_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE
);

-- tabla seguidores
CREATE TABLE seguidores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seguidor_id INT NOT NULL,
    seguido_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY seguidor_seguido (seguidor_id, seguido_id),
    FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (seguido_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- tabla publicaciones_guardadas
CREATE TABLE publicaciones_guardadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    publicacion_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY usuario_publicacion (usuario_id, publicacion_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE
);