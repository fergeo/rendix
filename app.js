// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Conexión a MongoDB
import { conectarDB } from './config/db.js';

// Middleware autenticación JWT
import { requireLogin } from './middlewares/authMiddleware.js';

// Rutas
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import studentRoutes from './routes/studentRoutes.js'; // ✅ Corrección aquí

// Conectar a la base de datos
conectarDB();

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
app.use('/admin', requireLogin, adminRoutes);
app.use('/admin/cursos', requireLogin, courseRoutes);
app.use('/admin/inscripciones', requireLogin, inscriptionRoutes);
app.use('/student', requireLogin, studentRoutes);

// Ruta 404 (si no se encuentra ninguna anterior)
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor activo en: http://localhost:${port}/login`);
});

export default app;
