import express from 'express';
import { loginHandler } from '../controllers/admin/authController.js';
import { logout } from '../controllers/admin/logoutController.js'; // ✅ CORRECTO

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', loginHandler);

router.get('/admin/cursos', (req, res) => {
    res.render('admin/cursos');
});

router.post('/logout', logout);

export default router;