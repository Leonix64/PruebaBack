const { Pool } = require('pg');

// Configuración para la conexión
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});

// Verificación de la conexión
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectar con la base de datos:', err.stack);
    }
    console.log('Conexión exitosa');
    release();
});

module.exports = pool;
