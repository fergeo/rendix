import jwt from 'jsonwebtoken';
import Usuario from '../../models/admin/Usuario.js';

const SECRET_KEY = 'R3nd1X/0fge';

export const loginHandler = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    // Buscar usuario en MongoDB Atlas
    const usuarioValido = await Usuario.findOne({ usuario, contrasena });

    if (!usuarioValido) {
      return res.status(401).send('Usuario o contraseña incorrectos');
    }

    // Generar JWT con ID real de MongoDB
    const token = jwt.sign(
      {
        id: usuarioValido._id,
        usuario: usuarioValido.usuario,
        rol: usuarioValido.rol
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Enviar token como cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Redirigir según el rol
    switch (usuarioValido.rol) {
      case 'administrador':
        return res.redirect('/admin/menu');
      case 'alumno':
        return res.redirect('/student');
      default:
        return res.status(403).send('Rol no permitido');
    }
  } catch (error) {
    console.error('Error al autenticar:', error.message);
    return res.status(500).send('Error interno del servidor');
  }
};
