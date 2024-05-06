const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../token/verifyToken');

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Token está en el formato "Bearer <token>"

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.status(401).json({ error: 'Token no válido', message: err.message });
    }

    req.user = decoded;
    next();
  });
}

module.exports = { authenticateUser };