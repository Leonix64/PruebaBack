const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');

const authController = require('./controllers/authController');
const uploadController = require('./controllers/uploadController');

const app = express();

// Middleware para parsear las solicitudes JSON
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));

// Rutas para el auth
app.post('/registro', authController.Registro);
app.post('/login', authController.Login);

// Rutas para el CRUD
app.post('/create', authMiddleware.authenticateUser, uploadController.Create);
app.get('/read', authMiddleware.authenticateUser, uploadController.Read);
app.put('/update/:id', authMiddleware.authenticateUser, uploadController.Update);
app.delete('/delete/:id', authMiddleware.authenticateUser, uploadController.Delete);

// Puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
