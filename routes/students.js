// routes/students.js
import express from 'express';
import { vistaCursosAlumno } from '../controllers/student/studentController.js';

const router = express.Router();

router.get('/', vistaCursosAlumno);

export default router;
