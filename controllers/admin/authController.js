// controllers/admin/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../../models/admin/Usuario.js';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error('La variable de entorno JWT_SECRET no está definida');
}

export const loginHandler = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    // Buscar usuario por nombre de usuario
    const usuarioDB = await Usuario.findOne({ usuario });
    if (!usuarioDB) {
      return res.status(401).send('Usuario o contraseña incorrectos');
    }

    // Comparar contraseña con hash almacenado
    const passwordMatch = await bcrypt.compare(contrasena, usuarioDB.contrasena);
    if (!passwordMatch) {
      return res.status(401).send('Usuario o contraseña incorrectos');
    }

    // Generar JWT con id real de MongoDB
    const token = jwt.sign(
      {
        id: usuarioDB._id,
        usuario: usuarioDB.usuario,
        rol: usuarioDB.rol
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Enviar token como cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hora
    });

    // Redirigir según rol
    if (usuarioDB.rol === 'administrador') {
      return res.redirect('/admin/menu');
    } else if (usuarioDB.rol === 'alumno') {
      return res.redirect('/student');
    } else {
      return res.status(403).send('Rol no permitido');
    }
  } catch (error) {
    console.error('Error al autenticar:', error);
    return res.status(500).send('Error interno del servidor');
  }
};
