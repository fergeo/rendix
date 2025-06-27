// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// 1. Cargar variables de entorno desde .env (sin debug)
dotenv.config({ debug: false });

// 2. Importar conexión, middleware y rutas
import { conectarDB } from './config/db.js';
import { requireLogin } from './middlewares/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 3. Configurar proxy para cookies secure en producción
app.set('trust proxy', 1);

// 4. Middlewares globales
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Configurar motor de plantillas Pug y vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 6. Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// 7. Definir rutas públicas y protegidas
app.use('/', authRoutes);

app.use('/admin/cursos', requireLogin, courseRoutes);
app.use('/admin/inscripciones', requireLogin, inscriptionRoutes);
app.use('/admin', requireLogin, adminRoutes);

app.use('/student', requireLogin, studentRoutes);

// 8. Manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// 9. Conectar a MongoDB y arrancar servidor
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await conectarDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor activo en http://localhost:${PORT}/login`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
})();

export default app;
