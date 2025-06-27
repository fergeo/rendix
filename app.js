// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

// Conexión a MongoDB
import { conectarDB } from './config/db.js';

// Middleware autenticación JWT
import { requireLogin } from './middlewares/authMiddleware.js';

// Rutas
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1); // Necesario en Vercel para cookies secure

// Middlewares globales
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas públicas (login, logout, etc.)
app.use('/', authRoutes);

// Rutas protegidas con JWT - todas las admin
app.use('/admin', requireLogin, adminRoutes);
app.use('/admin/cursos', requireLogin, courseRoutes);
app.use('/admin/inscripciones', requireLogin, inscriptionRoutes);

// Rutas protegidas con JWT para estudiantes
app.use('/student', requireLogin, studentRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Conectar a la base de datos antes de exportar
await conectarDB();

export default app;
