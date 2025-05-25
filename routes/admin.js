import { Router } from 'express';

import {
  mostrarAlta,
  agregarCurso,
  mostrarBaja,
  borrarCursos,
  mostrarModificar,
  modificarCurso,
  listarCursos
} from '../controllers/admin/courseController.js';

import {
  getCourses,
  getInscriptions,
  addInscription,
  deleteInscriptions,
  updateInscription,
  renderAltaInscripcion
} from '../controllers/admin/inscriptionController.js';

const router = Router();

// Middleware de logging
router.use((req, res, next) => {
  console.log(`Middleware admin: ${req.method} ${req.originalUrl}`);
  next();
});

console.log('Cargando rutas admin.js');

// Página principal del administrador
router.get('/', (req, res) => {
  res.render('admin/menu', { usuario: req.session?.usuario || 'Admin' });
});


// ================= CURSOS =================

// Menú de gestión de cursos
router.get('/cursos', (req, res) => {
  res.render('admin/cursos');
});

// Alta de curso
router.get('/cursos/alta', mostrarAlta);
router.post('/cursos/alta', agregarCurso);

// Baja de curso
router.get('/cursos/baja', mostrarBaja);
router.post('/cursos/borrar', borrarCursos);

// Modificación de curso
router.get('/modificacion-curso', mostrarModificar);
router.post('/cursos/modificar', modificarCurso);

// Consulta de cursos
router.get('/cursos/consulta', listarCursos);


// ================= INSCRIPCIONES =================

// Menú de inscripciones
router.get('/inscripciones', (req, res) => {
  res.render('admin/inscripciones'); // views/admin/inscripciones.pug
});

// Alta de inscripción (vista + acción)
router.get('/altaInscripcion', renderAltaInscripcion);

router.post('/altaInscripcion', async (req, res) => {
  try {
    const { cursoSeleccionado, ...studentData } = req.body;
    await addInscription(studentData, cursoSeleccionado);
    res.redirect('/admin/altaInscripcion');
  } catch (err) {
    console.error('Error en altaInscripcion POST:', err);
    res.status(500).send('Error al agregar inscripción');
  }
});

// Endpoint de API para pruebas (Thunder Client)
router.post('/inscripciones', async (req, res) => {
  try {
    const mensaje = await addInscription(req.body, req.body.course);
    res.status(201).json(mensaje);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Baja de inscripción
router.get('/bajaInscripcion', async (req, res) => {
  try {
    const inscripciones = await getInscriptions();
    res.render('admin/bajaInscripcion', { inscripciones });
  } catch (err) {
    res.status(500).send('Error cargando inscripciones');
  }
});

router.post('/bajaInscripcion', async (req, res) => {
  try {
    const ids = Array.isArray(req.body.seleccionados)
      ? req.body.seleccionados
      : [req.body.seleccionados];
    await deleteInscriptions(ids);
    res.redirect('/admin/bajaInscripcion');
  } catch (err) {
    res.status(500).send('Error al eliminar inscripciones');
  }
});

// Consulta de inscripciones
router.get('/consultarInscripcion', async (req, res) => {
  try {
    const inscripciones = await getInscriptions();
    res.render('admin/consultarInscripcion', { inscripciones });
  } catch (err) {
    res.status(500).send('Error al consultar inscripciones');
  }
});

// Modificación de inscripciones
router.get('/modificarInscripcion', async (req, res) => {
  try {
    const inscripciones = await getInscriptions();
    res.render('admin/modificarInscripcion', { inscripciones });
  } catch (err) {
    res.status(500).send('Error al cargar inscripciones');
  }
});

router.post('/modificarInscripcion', async (req, res) => {
  try {
    const { id, ...updatedData } = req.body;
    await updateInscription(id, updatedData);
    res.redirect('/admin/modificarInscripcion');
  } catch (err) {
    res.status(500).send('Error al modificar inscripción');
  }
});

export default router;
