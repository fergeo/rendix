import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Rutas absolutas
const studentsPath = path.resolve('models/admin/studentsModel.json');
const coursesPath = path.resolve('models/admin/courseModel.json');
const inscriptionsPath = path.resolve('models/admin/inscriptionModel.json');
const usersPath = path.resolve('models/admin/userModel.json');

// Función para leer JSON con creación del archivo si no existe o está vacío
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

// Función para escribir JSON
async function writeJson(filePath, data) {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error escribiendo en ${filePath}:`, err);
  }
}

// Obtener cursos
export async function getCourses() {
  return await readJson(coursesPath);
}

// Obtener inscripciones
export async function getInscriptions() {
  return await readJson(inscriptionsPath);
}

// Función auxiliar para crear nombre de usuario
function generarUsuario(nombre, apellido) {
  const n = nombre.toLowerCase().replace(/\s+/g, '').slice(0, 3);
  const a = apellido.toLowerCase().replace(/\s+/g, '').slice(0, 3);
  return n + a;
}

// Agregar inscripción, estudiante y usuario
export async function addInscription(studentData, courseString) {
  // studentData debe tener: nombre, apellido, dni, direccion, correoElectronico, telefono

  // Validar que vienen los datos necesarios
  const requiredFields = ['nombre', 'apellido', 'dni', 'direccion', 'correoElectronico', 'telefono'];
  for (const field of requiredFields) {
    if (!studentData[field]) {
      throw new Error(`Falta el campo requerido: ${field}`);
    }
  }

  const [nombreCurso, carrera, dia, horario] = courseString.split('|');

  if ([nombreCurso, carrera, dia, horario].some(v => !v)) {
    throw new Error(`Formato de curso inválido: '${courseString}'`);
  }

  // Leer datos actuales
  const students = await readJson(studentsPath);
  const courses = await readJson(coursesPath);
  const inscriptions = await readJson(inscriptionsPath);
  const users = await readJson(usersPath);

  // Buscar curso
  const normalize = str => str.trim().toLowerCase();
  const curso = courses.find(c =>
    normalize(c.nombre) === normalize(nombreCurso) &&
    normalize(c.carrera) === normalize(carrera) &&
    normalize(c.dia) === normalize(dia) &&
    normalize(c.horario) === normalize(horario)
  );
  if (!curso) throw new Error('Curso no encontrado');

  // Buscar si ya existe estudiante por DNI
  let student = students.find(s => s.dni === studentData.dni);

  // Si no existe estudiante, crear nuevo
  if (!student) {
    const studentId = uuidv4();
    student = {
      id: studentId,
      nombre: studentData.nombre,
      apellido: studentData.apellido,
      dni: studentData.dni,
      direccion: studentData.direccion,
      correoElectronico: studentData.correoElectronico,
      telefono: studentData.telefono
    };
    students.push(student);
    await writeJson(studentsPath, students);
  }

  // Generar usuario para el alumno (3 letras nombre + 3 letras apellido)
  const usuario = generarUsuario(student.nombre, student.apellido);

  // Verificar si usuario existe en users.json
  const userExists = users.find(u => u.usuario === usuario);

  if (!userExists) {
    const newUser = {
      usuario,
      contrasena: student.dni, // contraseña igual al DNI
      rol: 'alumno'
    };
    users.push(newUser);
    await writeJson(usersPath, users);
  }

  // Crear inscripción
  const inscriptionId = uuidv4();

  inscriptions.push({
    id: inscriptionId,
    studentId: student.id,
    courseId: curso.id,
    nombreCurso,
    carreraCurso: carrera,
    dia,
    horario
  });

  await writeJson(inscriptionsPath, inscriptions);

  return { mensaje: 'Inscripción, estudiante y usuario creados o actualizados con éxito' };
}

// Eliminar inscripciones
export async function deleteInscriptions(ids) {
  const inscriptions = await readJson(inscriptionsPath);
  const filtered = inscriptions.filter(ins => !ids.includes(ins.id));
  await writeJson(inscriptionsPath, filtered);
  return { mensaje: 'Inscripciones eliminadas con éxito' };
}

// Actualizar inscripción
export async function updateInscription(id, updatedData) {
  const inscriptions = await readJson(inscriptionsPath);
  const idx = inscriptions.findIndex(ins => ins.id === id);
  if (idx !== -1) {
    inscriptions[idx] = { ...inscriptions[idx], ...updatedData };
    await writeJson(inscriptionsPath, inscriptions);
    return { mensaje: 'Inscripción actualizada con éxito' };
  } else {
    throw new Error('Inscripción no encontrada');
  }
}

// Render formulario de alta inscripción (solo para vista)
export async function renderAltaInscripcion(req, res) {
  try {
    const cursos = await getCourses();
    const inscripciones = await getInscriptions();
    res.render('admin/altaInscripcion', { cursos, inscripciones });
  } catch (error) {
    console.error('Error en renderAltaInscripcion:', error);
    res.status(500).send('Error cargando cursos e inscripciones');
  }
}
