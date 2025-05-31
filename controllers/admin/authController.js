import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const loginHandler = async (req, res) => {
    const { usuario, contrasena } = req.body;

    // __dirname equivalente en ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const rutaUsuarios = path.join(__dirname, '..', '..', 'models', 'admin', 'userModel.json');

    let usuariosData = [];

    try {
        const contenido = await readFile(rutaUsuarios, 'utf8');
        usuariosData = JSON.parse(contenido);
    } catch (error) {
        console.error('❌ Error leyendo userModel.json:', error.message);
        return res.status(500).send('❌ Error interno del servidor');
    }

    // Buscar usuario válido por nombre y contraseña
    const usuarioValido = usuariosData.find(u =>
        u.usuario === usuario &&
        u.contrasena === contrasena
    );

    if (usuarioValido) {
        // Guardar en sesión
        req.session.usuario = usuarioValido.usuario;
        req.session.rol = usuarioValido.rol;

        // Redirigir según el rol que ya se recuperó del JSON
        switch (usuarioValido.rol) {
            case 'administrador':
                return res.redirect('/admin/menu');
            case 'alumno':
                return res.redirect('/student');
            default:
                return res.status(403).send('❌ Rol no permitido');
        }
    } else {
        return res.status(401).send('❌ Usuario o contraseña incorrectos');
    }
};
