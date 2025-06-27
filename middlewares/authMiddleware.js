// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error('La variable de entorno JWT_SECRET no está definida');
}

export const requireLogin = (req, res, next) => {
  let token = null;

  // Obtener token desde cookie
  if (req.cookies?.token) {
    token = req.cookies.token;
  // O desde el encabezado Authorization: Bearer <token>
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Si no hay token, redirigir a login
  if (!token) {
    return res.redirect('/login');
  }

  try {
    // Verificar y decodificar token usando la clave del .env
    const decoded = jwt.verify(token, SECRET_KEY);

    // Guardar los datos del usuario en req.user
    req.user = decoded;
    next(); // Permitir acceso a la ruta protegida
  } catch (err) {
    console.error('Error de autenticación JWT:', err.message);
    return res.redirect('/login');
  }
};
