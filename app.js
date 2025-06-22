import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'; // ✅ importar cookie-parser

// Rutas y middleware
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/students.js';
import { requireLogin } from './middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware para parsear cookies
app.use(cookieParser()); // ✅ importante para JWT en cookies

// Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', authRoutes);
app.use('/admin', requireLogin, adminRoutes);
app.use('/student', requireLogin, studentRoutes);

// Ruta protegida del menú de admin
app.get('/admin/menu', requireLogin, (req, res) => {
  const { usuario } = req.user; // ✅ usuario del token JWT
  res.render('admin/menu', { usuario });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor activo: http://localhost:${port}/login`);
});
