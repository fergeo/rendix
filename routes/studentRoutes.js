// routes/studentRoutes.js
import express from 'express';
import {
  vistaCursosAlumno,
  registrarAsistencia
} from '../controllers/student/studentController.js';

const router = express.Router();

// Ruta para mostrar los cursos del alumno (GET /student/)
router.get('/', vistaCursosAlumno);

// Ruta para registrar asistencia (POST /student/asistencia)
router.post('/asistencia', registrarAsistencia);

export default router;
