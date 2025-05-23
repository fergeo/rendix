import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";
//import cursos from "/controller/cursos.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Necesario para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//readDataCursos();


// Configurar motor de vistas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear formularios
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { usuario, contrasena, rol } = req.body;

    // Aquí podrías hacer lógica de autenticación con base de datos, etc.
    console.log('Datos recibidos:', { usuario, contrasena, rol });

    res.send(`Bienvenido, ${usuario} como ${rol}`);
});


// Iniciar servidor
app.get("/", (req,res) => {
    res.send("Bienvenido a Rendix");
});

app.listen(3000, () => {
    console.log("Servidor escuchando");
});
