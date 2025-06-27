import express from 'express';
import { loginHandler } from '../controllers/admin/authController.js';
import { logout } from '../controllers/admin/logoutController.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', loginHandler);
router.post('/logout', logout);

export default router;
