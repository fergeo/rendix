import express from 'express';
import { renderStudentDashboard } from '../controllers/student/studentController.js';
import { requireLogin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para mostrar el menú del alumno
router.get('/', requireLogin, renderStudentDashboard);

export default router;
