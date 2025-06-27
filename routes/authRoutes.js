import express from 'express';
import { loginHandler } from '../controllers/admin/authController.js';
import { logout } from '../controllers/admin/logoutController.js';

const router = express.Router();

// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Procesar formulario de login
router.post('/login', loginHandler);

// Procesar logout (puedes usar GET o POST según preferencia)
router.post('/logout', logout);
// Opcional: para que logout pueda ser accedido vía GET (p. ej. link simple)
router.get('/logout', logout);

export default router;
