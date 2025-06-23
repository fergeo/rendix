// routes/courseRoutes.js
import express from 'express';
import CursoController from '../controllers/admin/courseController.js';

const router = express.Router();

// Alta
router.get('/alta', CursoController.mostrarAlta);
router.post('/alta', CursoController.agregarCurso);

// Baja
router.get('/baja', CursoController.mostrarBaja);
router.post('/borrar', CursoController.borrarCursos);

// Modificar
router.get('/modificacion', CursoController.mostrarModificar);
router.post('/modificar', CursoController.modificarCurso);

// Consulta
router.get('/consultar', CursoController.listarCursos);

export default router;
