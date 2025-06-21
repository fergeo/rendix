// api/index.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import serverless from 'serverless-http';

// Importar rutas y middleware
import authRoutes from '../routes/authRoutes.js';
import adminRoutes from '../routes/admin.js';
import studentRoutes from '../routes/students.js';
import { requireLogin } from '../middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de sesión
app.use(session({
  secret: 'clave-secreta-rendix',
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

// Archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// Rutas públicas (login, registro, etc.)
app.use('/', authRoutes);

// Rutas protegidas del administrador
app.use('/admin', adminRoutes);

// Ruta protegida para el menú de admin
app.get('/admin/menu', requireLogin, (req, res) => {
  res.render('admin/menu', { usuario: req.session.usuario });
});

// Rutas protegidas para alumnos
app.use('/student', studentRoutes);

// Ruta por defecto (404)
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Exportar como función serverless
export const handler = serverless(app);
