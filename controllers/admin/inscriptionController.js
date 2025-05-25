import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Rutas a los JSON
const studentsPath     = path.resolve('models/admin/studentsModel.json');
const coursesPath      = path.resolve('models/admin/courseModel.json');
const inscriptionsPath = path.resolve('models/admin/inscriptionModel.json');
const usersPath        = path.resolve('models/admin/userModel.json');

// Lee o inicializa un JSON
async function readJson(filePath) {
  try {
    if (!existsSync(filePath)) {
      await writeFile(filePath, '[]', 'utf-8');
    }
    const raw = await readFile(filePath, 'utf-8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Error leyendo ${filePath}:`, err);
    return [];
  }
}

// Escribe un JSON
async function writeJson(filePath, data) {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error escribiendo en ${filePath}:`, err);
  }
}

// Devuelve lista de cursos
export async function getCourses() {
  return await readJson(coursesPath);
}

// Devuelve lista cruda de inscripciones
export async function getInscriptions() {
  return await readJson(inscriptionsPath);
}

// ------------------------------------------------------
// Mezcla inscripciones con datos de estudiantes y cursos
// ------------------------------------------------------
export async function getInscripcionesWithDetails() {
  const estudiantes   = await readJson(studentsPath);
  const cursos        = await readJson(coursesPath);
  const inscripciones = await readJson(inscriptionsPath);

  return inscripciones.map(ins => {
    const est = estudiantes.find(e => e.id === ins.studentId) || {};
    const cur = cursos.find(c => c.id === ins.courseId) || {};
    return {
      id: ins.id,
      studentId: ins.studentId,
      courseId: ins.courseId,

      // Datos del estudiante
      nombre: est.nombre || '',
      apellido: est.apellido || '',
      dni: est.dni || '',
      direccion: est.direccion || '',
      correo: est.correoElectronico || '',
      telefono: est.telefono || '',

      // Datos del curso
      nombreCurso: cur.nombre || '',
      carreraCurso: cur.carrera || '',
      dia: cur.dia || '',
      horario: cur.horario || ''
    };
  });
}

// ------------------------------------------------------
// Renderizar Alta Inscripción
// ------------------------------------------------------
export async function renderAltaInscripcion(req, res) {
  try {
    const cursos        = await getCourses();
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/altaInscripcion', { cursos, inscripciones });
  } catch (err) {
    console.error('Error en renderAltaInscripcion:', err);
    res.status(500).send('Error cargando alta de inscripciones');
  }
}

// ------------------------------------------------------
// Agregar Inscripción
// ------------------------------------------------------
function generarUsuario(nombre, apellido) {
  return nombre.toLowerCase().slice(0,3) + apellido.toLowerCase().slice(0,3);
}

export async function addInscription(studentData, courseId) {
  const required = ['nombre','apellido','dni','direccion','correoElectronico','telefono'];
  for (const f of required) {
    if (!studentData[f]) {
      throw new Error(`Falta el campo requerido: ${f}`);
    }
  }
  const students     = await readJson(studentsPath);
  const courses      = await readJson(coursesPath);
  const inscriptions = await readJson(inscriptionsPath);
  const users        = await readJson(usersPath);

  // Curso
  const curso = courses.find(c => c.id === courseId);
  if (!curso) throw new Error('Curso no encontrado');

  // Estudiante / Usuario
  let student = students.find(s => s.dni === studentData.dni);
  let userId;
  if (!student) {
    const usuarioStr = generarUsuario(studentData.nombre, studentData.apellido);
    let user = users.find(u => u.usuario === usuarioStr);
    if (!user) {
      userId = uuidv4();
      user = { id: userId, usuario: usuarioStr, contrasena: studentData.dni, rol: 'alumno' };
      users.push(user);
      await writeJson(usersPath, users);
    } else {
      userId = user.id;
    }
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

  // Inscripción nueva
  const inscriptionId = uuidv4();
  inscriptions.push({ id: inscriptionId, studentId: student.id, courseId: curso.id });
  await writeJson(inscriptionsPath, inscriptions);

  return { mensaje: 'Inscripción creada con éxito' };
}

// ------------------------------------------------------
// Renderizar Consulta Inscripciones
// ------------------------------------------------------
export async function renderConsultaInscripciones(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/consultarInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderConsultaInscripciones:', err);
    res.status(500).send('Error cargando consulta de inscripciones');
  }
}

// ------------------------------------------------------
// Renderizar Baja Inscripciones
// ------------------------------------------------------
export async function renderBajaInscripciones(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/bajaInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderBajaInscripciones:', err);
    res.status(500).send('Error cargando baja de inscripciones');
  }
}

// ------------------------------------------------------
// Eliminar Inscripciones
// ------------------------------------------------------
export async function deleteInscriptions(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids]; // asegurarse que sea array
  }

  // Normalizar IDs a string para evitar problemas
  ids = ids.map(String);

  const inscriptions = await readJson(inscriptionsPath);
  const filtered = inscriptions.filter(ins => !ids.includes(String(ins.id)));

  await writeJson(inscriptionsPath, filtered);
  return { mensaje: 'Inscripciones eliminadas con éxito' };
}

// ------------------------------------------------------
// Renderizar Modificar Inscripciones
// ------------------------------------------------------
export async function renderModificarInscripcion(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/modificarInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderModificarInscripcion:', err);
    res.status(500).send('Error cargando modificación de inscripciones');
  }
}

// ------------------------------------------------------
// Procesar Modificación Inscripciones
// ------------------------------------------------------
export async function updateInscription(id, updatedData) {
  const inscriptions = await readJson(inscriptionsPath);
  const idx = inscriptions.findIndex(ins => ins.id === id);
  if (idx === -1) throw new Error('Inscripción no encontrada');

  // Actualizar solo studentId y courseId si están presentes y son válidos
  const newInscription = { ...inscriptions[idx] };

  if (updatedData.studentId) newInscription.studentId = updatedData.studentId;
  if (updatedData.courseId) newInscription.courseId = updatedData.courseId;

  // Podrías agregar otras propiedades si es necesario, pero en tu caso la inscripción solo tiene esos campos

  inscriptions[idx] = newInscription;
  await writeJson(inscriptionsPath, inscriptions);

  return { mensaje: 'Inscripción actualizada con éxito' };
}
