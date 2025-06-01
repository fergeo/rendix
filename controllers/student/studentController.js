import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userPath = resolve(__dirname, '../../models/admin/userModel.json');
const studentPath = resolve(__dirname, '../../models/admin/studentsModel.json');
const inscriptionPath = resolve(__dirname, '../../models/admin/inscriptionModel.json');
const coursePath = resolve(__dirname, '../../models/admin/courseModel.json');
const asistenciaPath = resolve(__dirname, '../../models/student/asistenciaModel.json');

function generarId() {
  return Date.now().toString();
}

export const vistaCursosAlumno = async (req, res) => {
  try {
    const usuario = req.session.usuario;
    if (!usuario) {
      return res.redirect('/login');
    }

    const users = JSON.parse(await readFile(userPath, 'utf8'));
    const students = JSON.parse(await readFile(studentPath, 'utf8'));
    const inscriptions = JSON.parse(await readFile(inscriptionPath, 'utf8'));
    const courses = JSON.parse(await readFile(coursePath, 'utf8'));

    const user = users.find(u => u.usuario === usuario);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    const student = students.find(s => s.idUsuario === user.id);
    if (!student) {
      return res.status(404).send('Estudiante no encontrado');
    }

    const inscripcionesAlumno = inscriptions.filter(ins => ins.studentId === student.id);
    const cursosAlumno = inscripcionesAlumno.map(ins => {
      const curso = courses.find(c => c.id === ins.courseId);
      return curso ? { id: curso.id, nombre: curso.nombre, dia: curso.dia, horario: curso.horario } : null;
    }).filter(c => c !== null);

    // Detectar si viene la query para mostrar mensaje
    const asistenciaDada = req.query.asistencia === 'ok';

    res.render('student/menu', { cursos: cursosAlumno, asistenciaDada });
  } catch (error) {
    console.error('❌ Error al obtener los cursos del alumno:', error.message);
    res.status(500).send('Error interno del servidor');
  }
};

export const registrarAsistencia = async (req, res) => {
  try {
    const { cursoId } = req.body;
    const usuario = req.session.usuario;

    if (!usuario || !cursoId) {
      return res.status(400).json({ error: 'Faltan datos para registrar la asistencia' });
    }

    const users = JSON.parse(await readFile(userPath, 'utf8'));
    const students = JSON.parse(await readFile(studentPath, 'utf8'));

    const user = users.find(u => u.usuario === usuario);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const student = students.find(s => s.idUsuario === user.id);
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    let asistencias = [];
    try {
      const data = await readFile(asistenciaPath, 'utf8');
      asistencias = JSON.parse(data);
    } catch {
      // Si no existe el archivo, empezamos con lista vacía
      asistencias = [];
    }

    const ahora = new Date();
    const nuevaAsistencia = {
      id: generarId(),
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toTimeString().split(' ')[0],
      alumnoId: student.id,
      cursoId: cursoId
    };

    asistencias.push(nuevaAsistencia);
    await writeFile(asistenciaPath, JSON.stringify(asistencias, null, 2));

    // Redirigir a menú con query para mostrar mensaje
    res.redirect('/student/menu?asistencia=ok');
  } catch (err) {
    console.error('❌ Error al registrar asistencia:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
