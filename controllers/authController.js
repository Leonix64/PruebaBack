const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { JWT_SECRET_KEY } = require('../token/verifyToken');

// Ruta para Login
function Login(req, res) {
    const { name, password } = req.body;

    db.query('SELECT * FROM users WHERE name = $1', [name], async (err, result) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ error: 'Error interno al buscar usuario' });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Credenciales incorrectas' });
        }

        const user = result.rows[0];

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            const payload = {
                id: user.id,
                name: user.name,
                last_name: user.last_name,
                age: user.age,
                phone: user.phone,
                sex: user.sex,
            }

            const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token });
            console.log(token);

        } catch (err) {
            console.error('Error al comparar contraseñas:', err);
            return res.status(500).json({ error: 'Error interno al comparar contraseñas' });
        }
    });
}

// Ruta para Registro
function Registro(req, res) {
    const { name, last_name, age, phone, sex, password } = req.body;

    // Hash de la contraseña
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error al generar el hash de la contraseña:', err);
            return res.status(500).json({ error: 'Error interno al registrar usuario' });
        }

        db.query('INSERT INTO users (name, last_name, age, phone, sex, password) VALUES ($1, $2, $3, $4, $5, $6)', [name, last_name, age, phone, sex, hashedPassword], (error, results, fields) => {
            if (error) {
                console.error('Error al registrar usuario:', error);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.status(200).json({ message: 'Usuario registrado correctamente' });
        });
    });
}

module.exports = {
    Login,
    Registro,
};
