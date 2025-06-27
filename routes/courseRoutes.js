// routes/courseRoutes.js
import express from 'express';
import CursoController from '../controllers/admin/courseController.js';

const router = express.Router();

// Alta de curso (formulario y acción)
router.get('/alta', CursoController.mostrarAlta);
router.post('/alta', CursoController.agregarCurso);

// Baja de curso (formulario y acción)
router.get('/baja', CursoController.mostrarBaja);
router.post('/baja', CursoController.borrarCursos);

// Modificación de curso (formulario y acción)
router.get('/modificar', CursoController.mostrarModificar);
router.post('/modificar', CursoController.modificarCurso);

// Consulta/listado de cursos
router.get('/consultar', CursoController.listarCursos);

export default router;
