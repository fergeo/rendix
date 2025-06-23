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
 * Rutas para el CRUD de Inscripciones
 * Todas montadas bajo /admin/inscripciones en app.js
 */

// === Alta de Inscripción ===
router.get('/alta', renderAltaInscripcion);     // Muestra el formulario
router.post('/alta', addInscription);           // Procesa y guarda inscripción

// === Consulta de Inscripciones ===
router.get('/consultar', renderConsultaInscripciones);

// === Baja de Inscripciones ===
router.get('/baja', renderBajaInscripciones);   // Muestra listado con checkbox
router.post('/baja', deleteInscriptions);       // Procesa bajas seleccionadas

// === Modificación de Inscripciones ===
router.get('/modificar', renderModificarInscripcion);           // Muestra lista
router.get('/modificar/:id', renderModificarInscripcionById);   // Carga inscripción seleccionada
router.post('/modificar', updateInscription);                   // Procesa modificación

export default router;
