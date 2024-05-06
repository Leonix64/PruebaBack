const db = require('../config/db');

// Función para crear un nuevo registro
function Create(req, res) {
    const { title, description, image } = req.body;
    const userId = req.user ? req.user.id : null;

    // Verificar si el usuario está autenticado
    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Convertir la imagen a formato Buffer si es una cadena Base64
    const imageData = typeof image === 'string' ? Buffer.from(image, 'base64') : image;

    // Insertar el nuevo registro en la base de datos
    db.query('INSERT INTO uploads (title, description, image, user_id) VALUES ($1, $2, $3, $4)',
        [title, description, imageData, userId],
        (error, results, fields) => {
            if (error) {
                //console.error('Error al subir imagen:', error);
                return res.status(500).json({ error: 'Error al subir imagen' });
            }
            res.status(200).json({ message: 'Imagen subida correctamente' });
        }
    );
}

// Función para obtener los registros del usuario actual
function Read(req, res) {
    const userId = req.user ? req.user.id : null;

    // Verificar si el usuario está autenticado
    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Consultar los registros de subida del usuario
    db.query('SELECT id, title, description, image, created_at, user_id FROM uploads WHERE user_id = $1', [userId], (error, results, fields) => {
        if (error) {
            //console.error('Error al obtener datos de la tabla uploads:', error);
            return res.status(500).json({ error: 'Error al obtener datos' });
        }

        // Convertir la imagen de Buffer a Base64 antes de enviarla al frontend
        const uploadsWithBase64Image = results.rows.map(upload => ({
            ...upload,
            image: upload.image.toString('base64')
        }));

        res.status(200).json(uploadsWithBase64Image);
    });
}

// Función para actualizar un registro
function Update(req, res) {
    const userId = req.user ? req.user.id : null;
    const uploadId = req.params.id;

    // Verificar si el usuario está autenticado
    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { title, description, image } = req.body;

    // Convertir la imagen a formato Buffer si es una cadena Base64
    const imageData = typeof image === 'string' ? Buffer.from(image, 'base64') : image;

    // Actualizar el registro en la base de datos
    db.query(
        'UPDATE uploads SET title = $1, description = $2, image = $3 WHERE id = $4 AND user_id = $5',
        [title, description, imageData, uploadId, userId],
        (error, results) => {
            if (error) {
                console.error('Error al actualizar el registro de subida de imagen:', error);
                return res.status(500).json({ error: 'Error al actualizar el registro' });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ error: 'Registro no encontrado o no autorizado' });
            }

            res.status(200).json({ message: 'Registro actualizado correctamente' });
        }
    );
}

// Función para eliminar un registro
function Delete(req, res) {
    const userId = req.user ? req.user.id : null;
    const uploadId = req.params.id;

    // Verificar si el usuario está autenticado
    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Eliminar el registro de la base de datos
    db.query(
        'DELETE FROM uploads WHERE id = $1 AND user_id = $2',
        [uploadId, userId],
        (error, results) => {
            if (error) {
                console.error('Error al eliminar el registro:', error);
                return res.status(500).json({ error: 'Error al eliminar el registro' });
            }

            if (results.rowCount === 0) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }

            res.status(200).json({ message: 'Registro eliminado correctamente' });
        }
    );
}

module.exports = {
    Create,
    Read,
    Update,
    Delete,
};
