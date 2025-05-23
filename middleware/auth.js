import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { verificarUsuario } from './controllers/authController.js';
import { estaAutenticado, soloRol } from './middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'clave-secreta-123',
    resave: false,
    saveUninitialized: true
}));

// Rutas públicas
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { usuario, contrasena, rol } = req.body;
    const esValido = await verificarUsuario(usuario, contrasena, rol);

    if (esValido) {
        req.session.usuario = usuario;
        req.session.rol = rol;

        if (rol === 'administrador') {
            res.redirect('/admin');
        } else {
            res.redirect('/menu');
        }
    } else {
        res.status(401).send('Usuario no válido. <a href="/login">Volver</a>');
    }
});

// Rutas protegidas para usuarios logueados
app.get('/menu', estaAutenticado, (req, res) => {
    res.render('menu');
});

// Rutas exclusivas para administrador
app.get('/admin', estaAutenticado, soloRol('administrador'), (req, res) => {
    res.render('admin/admin', { usuario: req.session.usuario });
});

// Ejemplo de rutas protegidas para otros roles si quieres
app.get('/inscripcion', estaAutenticado, soloRol('administrador'), (req, res) => {
    res.send('Pantalla Inscripción');
});
app.get('/asistencia', estaAutenticado, soloRol('administrador'), (req, res) => {
    res.send('Listado de Asistencia');
});
app.get('/recibos', estaAutenticado, soloRol('administrador'), (req, res) => {
    res.send('Aceptar Recibos');
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});