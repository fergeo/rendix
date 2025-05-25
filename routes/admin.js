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

const router = Router();

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

router.get('/altaInscripcion', (req, res) => {
  // Aquí deberías cargar los datos y renderizar la vista
  res.render('admin/altaInscripcion', { cursos: [], inscripciones: [] });
});

export default router;