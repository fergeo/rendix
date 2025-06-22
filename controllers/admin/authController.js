import { readFile } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const SECRET_KEY = 'clave-jwt-rendix';

export const loginHandler = async (req, res) => {
  const { usuario, contrasena } = req.body;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rutaUsuarios = path.join(__dirname, '..', '..', 'models', 'admin', 'userModel.json');

  try {
    const contenido = await readFile(rutaUsuarios, 'utf8');
    const usuariosData = JSON.parse(contenido);

    const usuarioValido = usuariosData.find(u =>
      u.usuario === usuario && u.contrasena === contrasena
    );

    if (!usuarioValido) {
      return res.status(401).send('❌ Usuario o contraseña incorrectos');
    }

    const token = jwt.sign(
      { id: usuarioValido.id, usuario: usuarioValido.usuario, rol: usuarioValido.rol },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Enviar el token como cookie httpOnly o como header/JSON
    res.cookie('token', token, { httpOnly: true });
    
    // Redirigir según el rol
    switch (usuarioValido.rol) {
      case 'administrador':
        return res.redirect('/admin/menu');
      case 'alumno':
        return res.redirect('/student');
      default:
        return res.status(403).send('❌ Rol no permitido');
    }
  } catch (error) {
    console.error('❌ Error al autenticar:', error.message);
    return res.status(500).send('❌ Error interno del servidor');
  }
};
