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

// Submenú o índice de gestión de cursos
router.get('/cursos', (req, res) => {
  res.render('admin/cursos');
});

// Alta de curso
router.get('/alta', mostrarAlta);
router.post('/alta-curso', agregarCurso);

// Baja de curso
router.get('/baja', mostrarBaja);
router.post('/cursos/borrar', borrarCursos);

// Modificación de curso
router.get('/modificar', mostrarModificar);
router.post('/cursos/modificar', modificarCurso);

// Consulta de cursos
router.get('/consulta', listarCursos);

export default router;