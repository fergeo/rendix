import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Express
const app = express();
const port = 3000;

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// GET: Mostrar login
app.get('/login', (req, res) => {
  res.render('login');
});

// POST: Validar credenciales contra userModel.json
app.post('/login', (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  const rutaJson = path.join(__dirname, 'models', 'admin', 'userModel.json');

  let usuariosData = [];

  try {
    const contenido = fs.readFileSync(rutaJson, 'utf8');
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
    res.redirect('/admin/menu');
  } else {
    res.status(401).send('❌ Usuario, contraseña o rol incorrectos');
  }
});

// GET: Menú después del login
app.get('/admin/menu', (req, res) => {
  res.render('admin/menu');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor escuchando en: http://localhost:${port}/login`);
});