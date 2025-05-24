import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Para rutas correctas en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = resolve(__dirname, '../../model/admin/courseModel.json');

async function readCursos() {
    try {
        const data = await readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

async function writeCursos(cursos) {
    await writeFile(dataPath, JSON.stringify(cursos, null, 2));
}

export const mostrarAlta = async (req, res) => {
    const cursos = await readCursos();
    res.render('altaCurso', { cursos });
};

export const agregarCurso = async (req, res) => {
    const cursos = await readCursos();
    const { nombre, carrera, dia, horario } = req.body;

    const nuevoCurso = {
        id: Date.now().toString(),
        nombre,
        carrera,
        dia,
        horario,
    };

    cursos.push(nuevoCurso);
    await writeCursos(cursos);
    res.redirect('/admin/alta');
};

export const mostrarBaja = async (req, res) => {
    const cursos = await readCursos();
    res.render('bajaCurso', { cursos });
};

export const borrarCursos = async (req, res) => {
    const cursosSeleccionados = req.body.cursosSeleccionados;
    let cursos = await readCursos();

    if (Array.isArray(cursosSeleccionados)) {
        cursos = cursos.filter(c => !cursosSeleccionados.includes(c.id));
    } else if (cursosSeleccionados) {
        cursos = cursos.filter(c => c.id !== cursosSeleccionados);
    }

    await writeCursos(cursos);
    res.redirect('/admin/baja');
};

export const mostrarModificar = async (req, res) => {
    const cursos = await readCursos();
    res.render('modificarCurso', { cursos });
};

export const modificarCurso = async (req, res) => {
    const { cursoId, nombre, carrera, dia, horario } = req.body;
    let cursos = await readCursos();

    cursos = cursos.map(c =>
        c.id === cursoId ? { ...c, nombre, carrera, dia, horario } : c
    );

    await writeCursos(cursos);
    res.redirect('/admin/modificar');
};

export const listarCursos = async (req, res) => {
    const cursos = await readCursos();
    res.render('consultarCurso', { cursos });
};