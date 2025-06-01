// routes/students.js
import express from 'express';
import {
  vistaCursosAlumno,
  registrarAsistencia
} from '../controllers/student/studentController.js';

const router = express.Router();

// Ruta para mostrar los cursos del alumno
router.get('/', vistaCursosAlumno);

// Ruta para registrar asistencia (botón "Dar Asistencia")
router.post('/asistencia', registrarAsistencia);

export default router;
