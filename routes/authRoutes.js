import express from 'express';
import { loginHandler } from '../controllers/admin/authController.js';
import { logout } from '../controllers/admin/logoutController.js'; // ✅ CORRECTO

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/logout', logout);

router.post('/login', loginHandler);

export default router;