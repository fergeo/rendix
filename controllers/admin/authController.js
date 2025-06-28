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
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
      }
      return res.status(401).send('Usuario o contraseña incorrectos');
    }

    // Comparar contraseña con hash almacenado
    const passwordMatch = await bcrypt.compare(contrasena, usuarioDB.contrasena);
    if (!passwordMatch) {
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
      }
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

    // Si el cliente espera JSON, respondemos con token en JSON (para tests y API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ token });
    }

    // Redirigir según rol para navegadores tradicionales
    if (usuarioDB.rol === 'administrador') {
      return res.redirect('/admin/menu');
    } else if (usuarioDB.rol === 'alumno') {
      return res.redirect('/student');
    } else {
      return res.status(403).send('Rol no permitido');
    }
  } catch (error) {
    console.error('Error al autenticar:', error);
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
    return res.status(500).send('Error interno del servidor');
  }
};
