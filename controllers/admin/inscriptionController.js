import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const studentsPath = path.resolve('models/admin/studentsModel.json');
const coursesPath = path.resolve('models/admin/courseModel.json');
const inscriptionsPath = path.resolve('models/admin/inscriptionModel.json');

export async function getCourses() {
    const data = await readFile(coursesPath, 'utf-8');
    return JSON.parse(data);
}

export async function getInscriptions() {
    const data = await readFile(inscriptionsPath, 'utf-8');
    return JSON.parse(data);
}

export async function addInscription(studentData, courseString) {
    const [nombreCurso, carrera, dia, horario] = courseString.split('|');

    const studentId = uuidv4();
    const inscriptionId = uuidv4();

    // Guardar estudiante
    const students = JSON.parse(await readFile(studentsPath, 'utf-8'));
    students.push({ id: studentId, ...studentData });
    await writeFile(studentsPath, JSON.stringify(students, null, 2));

    // Buscar curso
    const courses = JSON.parse(await readFile(coursesPath, 'utf-8'));
    const curso = courses.find(c => c.nombre === nombreCurso && c.carrera === carrera && c.dia === dia && c.horario === horario);

    if (!curso) throw new Error('Curso no encontrado');

    // Guardar inscripción
    const inscriptions = JSON.parse(await readFile(inscriptionsPath, 'utf-8'));
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
    await writeFile(inscriptionsPath, JSON.stringify(inscriptions, null, 2));
}

export async function deleteInscriptions(ids) {
    const inscriptions = JSON.parse(await readFile(inscriptionsPath, 'utf-8'));
    const filtered = inscriptions.filter(ins => !ids.includes(ins.id));
    await writeFile(inscriptionsPath, JSON.stringify(filtered, null, 2));
}

export async function updateInscription(id, updatedData) {
    const inscriptions = JSON.parse(await readFile(inscriptionsPath, 'utf-8'));
    const idx = inscriptions.findIndex(ins => ins.id === id);
    if (idx !== -1) {
        inscriptions[idx] = { ...inscriptions[idx], ...updatedData };
        await writeFile(inscriptionsPath, JSON.stringify(inscriptions, null, 2));
    }
}

export async function renderAltaInscripcion(req, res) {
   /* 
    try {
        console.log('Cargando cursos desde:', coursesPath);
        const coursesData = await readFile(coursesPath, 'utf-8');
        console.log('Contenido leído:', coursesData);
        const cursos = JSON.parse(coursesData);
        res.render('admin/altaInscripcion', { cursos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error cargando cursos');
    }
        */
         console.log('Entré a renderAltaInscripcion');
  res.send('Funciona el controlador');
    try {
    const cursos = await getCourses();
    const inscripciones = await getInscriptions();
    res.render('admin/altaInscripcion', { cursos, inscripciones });
  } catch (error) {
    console.error('Error en renderAltaInscripcion:', error);
    res.status(500).send('Error cargando cursos e inscripciones');
  }
}

