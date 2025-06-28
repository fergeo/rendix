// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// 1. Cargar variables de entorno desde .env
dotenv.config();

// 2. Importar conexión, middleware y rutas
import { conectarDB } from './config/db.js';
import { requireLogin } from './middlewares/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// 3. Preparar __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 4. Crear la app
const app = express();

// 5. Configurar proxy para cookies secure en producción
app.set('trust proxy', 1);

// 6. Middlewares globales
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. Motor de vistas y archivos estáticos
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// 8. Redirección de raíz
app.get('/', (req, res) => {
  res.redirect('/login');
});

// 9. Rutas
app.use('/', authRoutes);
app.use('/admin/cursos', requireLogin, courseRoutes);
app.use('/admin/inscripciones', requireLogin, inscriptionRoutes);
app.use('/admin', requireLogin, adminRoutes);
app.use('/student', requireLogin, studentRoutes);

// 10. 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// 11. Conexión a DB (solo si no está conectada aún)
await conectarDB();

// 12. Exportar la app para Vercel
export default app;
