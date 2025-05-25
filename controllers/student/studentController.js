import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas absolutas a los archivos JSON
const studentsPath = path.join(__dirname, '../../models/admin/studentsModel.json');
const inscriptionsPath = path.join(__dirname, '../../models/admin/inscriptionModel.json');
const coursesPath = path.join(__dirname, '../../models/admin/courseModel.json');

export function renderStudentDashboard(req, res) {
  const userId = req.session.usuario?.id; // Sesión debe contener el usuario con su id

  if (!userId) {
    return res.redirect('/login');
  }

  // Cargar archivos
  const students = JSON.parse(fs.readFileSync(studentsPath, 'utf-8'));
  const inscriptions = JSON.parse(fs.readFileSync(inscriptionsPath, 'utf-8'));
  const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));

  // Encontrar el estudiante vinculado al usuario
  const student = students.find(s => s.idUsuario === userId);
  if (!student) {
    return res.render('student/menu', { cursos: [], mensaje: 'No se encontró el estudiante.' });
  }

  // Encontrar inscripciones del estudiante
  const studentInscriptions = inscriptions.filter(i => i.studentId === student.id);

  // Buscar los cursos relacionados
  const cursos = studentInscriptions.map(ins => {
    const curso = courses.find(c => c.id === ins.courseId);
    return curso ? {
      nombreCurso: curso.nombreCurso,
      dia: curso.dia,
      horario: curso.horario
    } : null;
  }).filter(Boolean); // Elimina posibles nulls si no se encontró un curso

  res.render('student/menu', { cursos });
}
