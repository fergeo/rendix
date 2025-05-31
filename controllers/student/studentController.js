import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas a los archivos JSON
const usersPath = path.resolve(__dirname, '../../models/admin/userModel.json');
const studentsPath = path.resolve(__dirname, '../../models/admin/studentsModel.json');
const inscriptionsPath = path.resolve(__dirname, '../../models/admin/inscriptionModel.json');
const coursesPath = path.resolve(__dirname, '../../models/admin/courseModel.json');

// Función utilitaria para leer cualquier JSON
async function readJSON(filePath) {
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`❌ Error leyendo ${filePath}:`, err.message);
    return [];
  }
}

export const vistaCursosAlumno = async (req, res) => {
  try {
    const username = req.session.usuario;
    if (!username) {
      return res.status(401).send('No has iniciado sesión.');
    }

    // 1. Obtener el usuario
    const usuarios = await readJSON(usersPath);
    const usuario = usuarios.find(u => u.usuario === username);
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado.');
    }

    // 2. Obtener el estudiante con idUsuario
    const estudiantes = await readJSON(studentsPath);
    const estudiante = estudiantes.find(e => e.idUsuario === usuario.id);
    if (!estudiante) {
      return res.status(404).send('Estudiante no asociado a este usuario.');
    }

    // 3. Obtener inscripciones del estudiante
    const inscripciones = await readJSON(inscriptionsPath);
    const inscripcionesAlumno = inscripciones.filter(i => i.studentId === estudiante.id);
    if (inscripcionesAlumno.length === 0) {
      return res.render('student/student', { cursos: [] }); // Sin cursos
    }

    // 4. Obtener cursos según courseId
    const cursos = await readJSON(coursesPath);
    const cursosInscripto = inscripcionesAlumno.map(i => {
      const curso = cursos.find(c => c.id === i.courseId);
      return curso ? {
        nombre: curso.nombre,
        dia: curso.dia,
        horario: curso.horario
      } : null;
    }).filter(curso => curso !== null); // Eliminar nulos

    // 5. Renderizar vista
    return res.render('student/menu', { cursos: cursosInscripto });

  } catch (error) {
    console.error('❌ Error en vistaCursosAlumno:', error.message);
    return res.status(500).send('Error interno del servidor');
  }
};
