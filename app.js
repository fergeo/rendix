import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

// Rutas y middlewares
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/admin.js';
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

// Middleware para parsear formularios
app.use(express.urlencoded({ extended: true }));

// Motor de plantillas: Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Aquí va express.static
app.use(express.static(path.join(__dirname, 'public')));

// Rutas públicas (login, registro)
app.use('/', authRoutes);

// Rutas protegidas de administración
app.use('/admin', requireLogin, adminRoutes);

app.get('/admin/menu', requireLogin, (req, res) => {
    res.render('admin/menu', { usuario: req.session.usuario });
});

// Otras rutas y configuración...

app.listen(port, () => {
    console.log(`✅ Servidor activo: http://localhost:${port}/login`);
});
