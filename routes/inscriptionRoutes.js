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

/**
 * Rutas para CRUD de Inscripciones
 * Montadas bajo /admin/inscripciones en app.js
 */

// Alta de inscripción (formulario y acción)
router.get('/alta', renderAltaInscripcion);
router.post('/alta', addInscription);

// Consulta/Listado de inscripciones
router.get('/consultar', renderConsultaInscripciones);

// Baja de inscripciones (formulario y acción)
router.get('/baja', renderBajaInscripciones);
router.post('/baja', deleteInscriptions);

// Modificación de inscripciones
router.get('/modificar', renderModificarInscripcion);            // Lista inscripciones para modificar
router.get('/modificar/:id', renderModificarInscripcionById);    // Formulario para inscripción específica
router.post('/modificar', updateInscription);                    // Procesa actualización

export default router;
