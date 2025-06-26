// routes/adminRoutes.js
import express from 'express';
import { listarAsistencias } from '../controllers/admin/asistenciaController.js';
import { listarListaEspera } from '../controllers/admin/listaEsperaController.js'; // <- NUEVO

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

// Vista de gestión de cursos
router.get('/cursos', (req, res) => {
  res.render('admin/cursos'); // Asegúrate de que views/admin/cursos.pug exista
});

// Vista de gestión de inscripciones
router.get('/inscripciones', (req, res) => {
  res.render('admin/inscripciones'); // Asegúrate de que views/admin/inscripciones.pug exista
});

// Vista de gestión de asistencias
router.get('/asistencias', listarAsistencias); // Renderiza datos desde MongoDB

// Vista de gestión de lista de espera
router.get('/lista-espera', listarListaEspera); // <- NUEVO

export default router;
