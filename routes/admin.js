import { Router } from 'express';
import {
  mostrarAlta,
  agregarCurso,
  mostrarBaja,
  borrarCursos,
  mostrarModificar,
  modificarCurso,
  listarCursos,
} from '../controllers/admin/courseController.js';

import {
  getCourses,
  getInscriptions,
  addInscription,
  deleteInscriptions,
  updateInscription
} from '../controllers/admin/inscriptionController.js';

import { renderAltaInscripcion } from '../controllers/admin/inscriptionController.js';

const router = Router();

console.log('Cargando rutas admin.js');

// Página principal del administrador
router.get('/', (req, res) => {
  res.render('admin/menu', { usuario: req.session?.usuario || 'Admin' });
});


//CURSOS
// Submenú o índice de gestión de cursos
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


//INSCRIPCIONES
router.get('/inscripciones', (req, res) => {
  res.render('admin/inscripciones'); // archivo views/admin/menuInscripciones.pug
});

router.get('/modificarInscripcion', (req, res) => {
  const inscripciones = []; // Reemplaza con datos reales
  res.render('admin/modificarInscripcion', { inscripciones });
});




router.get('/bajaInscripcion', (req, res) => {
  // Aquí deberías cargar los datos y renderizar la vista
  res.render('admin/bajaInscripcion', { cursos: [], inscripciones: [] });
});


router.get('/consultarInscripcion', (req, res) => {
  res.render('admin/consultarInscripcion', { cursos: [], inscripciones: [] });
});

/*
router.get('/altaInscripcion', async (req, res) => {
  const cursos = await getCourses();
  const inscripciones = await getInscriptions();
  res.render('admin/altaInscripcion', { cursos, inscripciones });
});

router.get('/altaInscripcion', renderAltaInscripcion);

router.get('/altaInscripcion', (req, res) => {
  res.render('admin/altaInscripcion', { cursos: [], inscripciones: [] });
});
*/

router.get('/altaInscripcion', async (req, res) => {
  const cursos = await getCourses();
  const inscripciones = await getInscriptions();
  res.render('admin/altaInscripcion', { cursos, inscripciones });
});

router.post('/altaInscripcion', async (req, res) => {
  const { cursoSeleccionado, ...studentData } = req.body;
  await addInscription(studentData, cursoSeleccionado);
  res.redirect('/admin/altaInscripcion');
});



router.get('/bajaInscripcion', async (req, res) => {
  const inscripciones = await getInscriptions();
  res.render('admin/bajaInscripcion', { inscripciones });
});

router.post('/bajaInscripcion', async (req, res) => {
  const ids = Array.isArray(req.body.seleccionados)
    ? req.body.seleccionados
    : [req.body.seleccionados];
  await deleteInscriptions(ids);
  res.redirect('/admin/bajaInscripcion');
});

router.get('/consultarInscripcion', async (req, res) => {
  const inscripciones = await getInscriptions();
  res.render('admin/consultarInscripcion', { inscripciones });
});

router.get('/modificarInscripcion', async (req, res) => {
  const inscripciones = await getInscriptions();
  res.render('admin/modificarInscripcion', { inscripciones });
});

router.post('/modificarInscripcion', async (req, res) => {
  const { id, ...updatedData } = req.body;
  await updateInscription(id, updatedData);
  res.redirect('/admin/modificarInscripcion');
});


router.use((req, res, next) => {
  console.log(`Middleware admin: ${req.method} ${req.originalUrl}`);
  next();
});




















export default router;