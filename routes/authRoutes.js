// routes/authRoutes.js
import express from 'express';
import { loginHandler } from '../controllers/admin/authController.js';
import { logout } from '../controllers/admin/logoutController.js';

const router = express.Router();

// Ruta raíz: redirige automáticamente a /login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login'); // Asegurate de tener views/login.pug
});

// Procesar login
router.post('/login', loginHandler);

// Procesar logout
router.post('/logout', logout);

export default router;
