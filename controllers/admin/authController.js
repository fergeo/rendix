import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../../models/admin/Usuario.js';

const SECRET_KEY = 'R3nd1X/0fge';

export const loginHandler = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    // Buscar usuario por nombre de usuario
    const usuarioDB = await Usuario.findOne({ usuario });
    if (!usuarioDB) {
      return res.status(401).send('Usuario o contraseña incorrectos');
    }

    // Comparar contrasena con hash almacenado
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
      sameSite: 'lax'
    });

    // Redirigir según rol
    switch (usuarioDB.rol) {
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
