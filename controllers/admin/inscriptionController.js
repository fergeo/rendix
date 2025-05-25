import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Rutas absolutas a archivos JSON
const studentsPath = path.resolve('models/admin/studentsModel.json');
const coursesPath = path.resolve('models/admin/courseModel.json');
const inscriptionsPath = path.resolve('models/admin/inscriptionModel.json');
const usersPath = path.resolve('models/admin/userModel.json');

// Leer JSON de forma segura, crea archivo si no existe
async function readJson(filePath) {
  try {
    if (!existsSync(filePath)) {
      await writeFile(filePath, '[]', 'utf-8');
    }
    const data = await readFile(filePath, 'utf-8');
    return data.trim() ? JSON.parse(data) : [];
  } catch (err) {
    console.error(`Error leyendo ${filePath}:`, err);
    return [];
  }
}

// Escribir JSON de forma segura
async function writeJson(filePath, data) {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error escribiendo en ${filePath}:`, err);
  }
}

// Obtener lista de cursos
export async function getCourses() {
  return await readJson(coursesPath);
}

// Obtener lista de inscripciones
export async function getInscriptions() {
  return await readJson(inscriptionsPath);
}

// Agregar inscripción con creación de estudiante y usuario si no existe
export async function addInscription(studentData, courseString) {
  const [nombreCurso, carrera, dia, horario] = courseString.split('|');

  const studentId = uuidv4();
  const inscriptionId = uuidv4();

  // Leer datos existentes
  const students = await readJson(studentsPath);
  const courses = await readJson(coursesPath);
  const inscriptions = await readJson(inscriptionsPath);
  const users = await readJson(usersPath);

  // Buscar curso válido
  const curso = courses.find(c =>
    c.nombre === nombreCurso &&
    c.carrera === carrera &&
    c.dia === dia &&
    c.horario === horario
  );

  if (!curso) throw new Error('Curso no encontrado');

  // Agregar estudiante
  students.push({ id: studentId, ...studentData });
  await writeJson(studentsPath, students);

  // Agregar inscripción
  inscriptions.push({
    id: inscriptionId,
    studentId,
    courseId: curso.id,
    nombreCurso,
    carreraCurso: carrera,
    dia,
    horario,
    ...studentData
  });
  await writeJson(inscriptionsPath, inscriptions);

  // Crear usuario si no existe
  const userExists = users.find(u => u.usuario === studentData.usuario);
  if (!userExists) {
    users.push({
      usuario: studentData.usuario,
      contrasena: studentData.contrasena,
      rol: 'estudiante'
    });
    await writeJson(usersPath, users);
  }

  return { mensaje: 'Inscripción, estudiante y usuario creados con éxito' };
}

// Eliminar inscripciones por IDs
export async function deleteInscriptions(ids) {
  const inscriptions = await readJson(inscriptionsPath);
  const filtered = inscriptions.filter(ins => !ids.includes(ins.id));
  await writeJson(inscriptionsPath, filtered);
  return { mensaje: 'Inscripciones eliminadas con éxito' };
}

// Actualizar inscripción por ID
export async function updateInscription(id, updatedData) {
  const inscriptions = await readJson(inscriptionsPath);
  const idx = inscriptions.findIndex(ins => ins.id === id);
  if (idx === -1) throw new Error('Inscripción no encontrada');

  inscriptions[idx] = { ...inscriptions[idx], ...updatedData };
  await writeJson(inscriptionsPath, inscriptions);

  return { mensaje: 'Inscripción actualizada con éxito' };
}

// Renderizar formulario de alta inscripción (para views)
export async function renderAltaInscripcion(req, res) {
  console.log('Entré a renderAltaInscripcion');
  try {
    const cursos = await getCourses();
    const inscripciones = await getInscriptions();
    res.render('admin/altaInscripcion', { cursos, inscripciones });
  } catch (error) {
    console.error('Error en renderAltaInscripcion:', error);
    res.status(500).send('Error cargando cursos e inscripciones');
  }
}
