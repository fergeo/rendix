import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Rutas absolutas
const studentsPath = path.resolve('models/admin/studentsModel.json');
const coursesPath = path.resolve('models/admin/courseModel.json');
const inscriptionsPath = path.resolve('models/admin/inscriptionModel.json');
const usersPath = path.resolve('models/admin/userModel.json');

// Leer JSON con fallback a []
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

// Escribir JSON
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

// Crear nombre de usuario
function generarUsuario(nombre, apellido) {
  const n = nombre.toLowerCase().replace(/\s+/g, '').slice(0, 3);
  const a = apellido.toLowerCase().replace(/\s+/g, '').slice(0, 3);
  return n + a;
}

// Agregar inscripción, estudiante y usuario
export async function addInscription(studentData, courseId) {
  const requiredFields = ['nombre', 'apellido', 'dni', 'direccion', 'correoElectronico', 'telefono'];
  for (const field of requiredFields) {
    if (!studentData[field]) {
      throw new Error(`Falta el campo requerido: ${field}`);
    }
  }

  const students = await readJson(studentsPath);
  const courses = await readJson(coursesPath);
  const inscriptions = await readJson(inscriptionsPath);
  const users = await readJson(usersPath);

  const curso = courses.find(c => c.id === courseId);
  if (!curso) throw new Error('Curso no encontrado');

  let student = students.find(s => s.dni === studentData.dni);

  let userId;
  if (!student) {
    // Crear usuario
    const usuario = generarUsuario(studentData.nombre, studentData.apellido);
    let user = users.find(u => u.usuario === usuario);

    if (!user) {
      userId = uuidv4();
      user = {
        id: userId,
        usuario,
        contrasena: studentData.dni,
        rol: 'alumno'
      };
      users.push(user);
      await writeJson(usersPath, users);
    } else {
      userId = user.id;
    }

    // Crear estudiante
    const studentId = uuidv4();
    student = {
      id: studentId,
      nombre: studentData.nombre,
      apellido: studentData.apellido,
      dni: studentData.dni,
      direccion: studentData.direccion,
      correoElectronico: studentData.correoElectronico,
      telefono: studentData.telefono,
      idUsuario: userId
    };
    students.push(student);
    await writeJson(studentsPath, students);
  }

  // Crear inscripción
  const inscriptionId = uuidv4();
  inscriptions.push({
    id: inscriptionId,
    studentId: student.id,
    courseId: curso.id
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

// Vista alta inscripción actualizada
export async function renderAltaInscripcion(req, res) {
  try {
    const cursos = await getCourses();
    const inscripciones = await getInscriptions();
    const estudiantes = await readJson(studentsPath);

    // Asociar inscripciones con datos completos
    const inscripcionesConDatos = inscripciones.map(ins => {
      const estudiante = estudiantes.find(e => e.id === ins.studentId);
      const curso = cursos.find(c => c.id === ins.courseId);

      return {
        id: ins.id,
        nombreEstudiante: estudiante?.nombre || 'Desconocido',
        apellidoEstudiante: estudiante?.apellido || 'Desconocido',
        dniEstudiante: estudiante?.dni || 'Desconocido',
        nombreCurso: curso?.nombre || 'Desconocido',
        carreraCurso: curso?.carrera || 'Desconocido',
        dia: curso?.dia || 'Desconocido',
        horario: curso?.horario || 'Desconocido'
      };
    });

    res.render('admin/altaInscripcion', {
      cursos,
      inscripciones: inscripcionesConDatos
    });
  } catch (error) {
    console.error('Error en renderAltaInscripcion:', error);
    res.status(500).send('Error cargando cursos e inscripciones');
  }
}
