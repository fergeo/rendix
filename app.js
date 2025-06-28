// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { conectarDB } from './config/db.js';
import { requireLogin } from './middlewares/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use('/', authRoutes);
app.use('/admin/cursos', requireLogin, courseRoutes);
app.use('/admin/inscripciones', requireLogin, inscriptionRoutes);
app.use('/admin', requireLogin, adminRoutes);
app.use('/student', requireLogin, studentRoutes);

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Detectar si estamos en Vercel (NO arrancar el servidor)
const isVercel = !!process.env.VERCEL;

// Conectar y arrancar (solo en local o Render)
if (!isVercel) {
  const PORT = process.env.PORT || 3000;
  (async () => {
    try {
      await conectarDB();
      app.listen(PORT, () => {
        console.log(`Servidor activo en http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Error iniciando servidor:', error);
      process.exit(1);
    }
  })();
} else {
  // En Vercel solo conectar (una sola vez por función)
  await conectarDB();
}

// Exportar app para Vercel
export default app;
