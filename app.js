// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Conexión a MongoDB
import { conectarDB } from './config/db.js';

// Middleware
import { requireLogin } from './middlewares/authMiddleware.js';

// Rutas
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';         // Renombrado para evitar confusión
import courseRoutes from './routes/courseRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import studentRoutes from './routes/students.js';

conectarDB(); // Conectar a MongoDB Atlas

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middlewares globales
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas públicas
app.use('/', authRoutes);

// Rutas protegidas con JWT
// Agrupar rutas admin bajo /admin, usando el middleware requireLogin una sola vez
app.use('/admin', requireLogin, adminRoutes);         // adminRoutes contiene rutas generales, p.ej. menú
app.use('/admin/cursos', requireLogin, courseRoutes); // rutas específicas para cursos, prefijo /admin/cursos
app.use('/admin/inscripciones', requireLogin, inscriptionRoutes); // rutas específicas inscripciones

// Rutas para estudiantes
app.use('/student', requireLogin, studentRoutes);

// Manejar ruta menú admin dentro de adminRoutes.js (no aquí)
// Por eso eliminamos el get('/admin/menu') de este archivo

// Ruta 404 (al final)
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor activo en: http://localhost:${port}/login`);
});
