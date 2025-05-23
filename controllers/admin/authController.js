import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const loginHandler = async (req, res) =>  {
    const { usuario, contrasena, rol } = req.body;

    // __dirname equivalente en ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const rutaUsuarios = path.join(__dirname, '..', '..', 'models', 'admin', 'userModel.json');

    console.log(rutaUsuarios);

    let usuariosData = [];

    try {
        const contenido = await readFile(rutaUsuarios, 'utf8');
        usuariosData = JSON.parse(contenido);
    } catch (error) {
        console.error('❌ Error leyendo userModel.json:', error.message);
        return res.status(500).send('❌ Error interno del servidor');
    }

    const usuarioValido = usuariosData.find(u =>
        u.usuario === usuario &&
        u.contrasena === contrasena &&
        u.rol === rol
    );

    if (usuarioValido) {
        req.session.usuario = usuarioValido.usuario;
        req.session.rol = usuarioValido.rol;

        // Redirigir según el rol
        switch (usuarioValido.rol) {
            case 'administrador':
                res.redirect('/admin/menu');
                break;
            default:
                res.status(403).send('❌ Rol no permitido');
        }
    } else {
        res.status(401).send('❌ Usuario, contraseña o rol incorrectos');
    }
};