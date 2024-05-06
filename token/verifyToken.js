const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET_KEY = crypto.randomBytes(32).toString('hex');

// Verificar y decodificar el token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];

  console.log('Token recibido:', token);

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.status(401).json({ error: 'Token no válido' });
    }

    console.log('Decoded user:', decoded.user);

    req.user = decoded.user;
    next();
  });
}

module.exports = {
  JWT_SECRET_KEY,
  verifyToken,
};