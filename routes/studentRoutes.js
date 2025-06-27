// routes/studentRoutes.js
import express from 'express';
import {
  vistaCursosAlumno,
  registrarAsistencia
} from '../controllers/student/studentController.js';

const router = express.Router();

/**
 * Rutas para funcionalidades del alumno
 * Montadas bajo /student en app.js
 */

// Mostrar los cursos del alumno (GET /student/)
router.get('/', vistaCursosAlumno);

// Registrar asistencia del alumno (POST /student/asistencia)
router.post('/asistencia', registrarAsistencia);

export default router;
