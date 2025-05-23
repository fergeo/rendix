import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';
import { requireLogin } from './middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configuración de sesión
app.use(session({
    secret: 'clave-secreta-rendix',
    resave: false,
    saveUninitialized: false
}));

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use('/', authRoutes);

// Ruta protegida para administrador
app.get('/admin/menu', requireLogin, (req, res) => {
    res.render('admin/menu', { usuario: req.session.usuario });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`✅ Servidor activo: http://localhost:${port}/login`);
});