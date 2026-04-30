-- Agregar campo para saber si el avatar es personalizado
ALTER TABLE usuarios 
ADD COLUMN avatar_personalizado BOOLEAN DEFAULT FALSE AFTER avatar;

-- Actualizar avatars existentes con el nuevo formato
UPDATE usuarios 
SET avatar = CONCAT('https://ui-avatars.com/api/?name=', 
                    REPLACE(nombre_usuario, ' ', '+'), 
                    '&background=random&size=150'),
    avatar_personalizado = FALSE
WHERE avatar = 'https://via.placeholder.com/150' OR avatar IS NULL;