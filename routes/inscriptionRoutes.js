// routes/inscriptionRoutes.js
import express from 'express';
import {
  renderAltaInscripcion,
  addInscription,
  renderConsultaInscripciones,
  renderBajaInscripciones,
  deleteInscriptions,
  renderModificarInscripcion,
  renderModificarInscripcionById,
  updateInscription
} from '../controllers/admin/inscriptionController.js';

const router = express.Router();

// Alta
router.get('/alta', renderAltaInscripcion);
router.post('/alta', addInscription);

// Consulta
router.get('/consultar', renderConsultaInscripciones);

// Baja
router.get('/baja', renderBajaInscripciones);
router.post('/borrar', deleteInscriptions);

// Modificar (listado sin inscripción seleccionada)
router.get('/modificar', renderModificarInscripcion);

// Modificar (cargar inscripción específica para edición)
router.get('/modificar/:id', renderModificarInscripcionById);

// Modificar (guardar cambios)
router.post('/modificar', updateInscription);

export default router;
