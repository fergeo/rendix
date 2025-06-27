// routes/adminRoutes.js
import express from 'express';
import { listarAsistencias } from '../controllers/admin/asistenciaController.js';
import { listarListaEspera } from '../controllers/admin/listaEsperaController.js';

const router = express.Router();

// Redirige /admin a /admin/menu
router.get('/', (req, res) => {
  res.redirect('/admin/menu');
});

// Vista del menú de administrador
router.get('/menu', (req, res) => {
  const usuario = req.user?.usuario || 'Administrador';
  res.render('admin/menu', { usuario });
});

// Vista de gestión de cursos (puedes cambiar a controlador si lo necesitas)
router.get('/cursos', (req, res) => {
  res.render('admin/cursos');
});

// Vista de gestión de inscripciones (idem anterior)
router.get('/inscripciones', (req, res) => {
  res.render('admin/inscripciones');
});

// Vista de gestión de asistencias (controlador con lógica)
router.get('/asistencias', listarAsistencias);

// Vista de gestión de lista de espera (controlador con lógica)
router.get('/lista-espera', listarListaEspera);

export default router;
