import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Para rutas correctas en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = resolve(__dirname, '../../models/admin/courseModel.json');

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

// Mostrar formulario de alta con cursos ya existentes
export const mostrarAlta = async (req, res) => {
    const cursos = await readCursos();
    res.render('admin/altaCurso', { cursos });
};

// Agregar un nuevo curso (desde formulario o API)
export const agregarCurso = async (req, res) => {
    const cursos = await readCursos();
    const { nombre, carrera, dia, horario } = req.body;

    // Validación básica
    if (!nombre || !carrera || !dia || !horario) {
        const mensaje = 'Faltan campos obligatorios';
        if (req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ error: mensaje });
        } else {
            return res.status(400).send(mensaje);
        }
    }

    // Verifica si ya existe un curso igual (opcional)
    const existe = cursos.some(c =>
        c.nombre === nombre &&
        c.carrera === carrera &&
        c.dia === dia &&
        c.horario === horario
    );

    if (existe) {
        const mensaje = 'El curso ya existe';
        if (req.headers.accept?.includes('application/json')) {
            return res.status(409).json({ error: mensaje });
        } else {
            return res.status(409).send(mensaje);
        }
    }

    const nuevoCurso = {
        id: Date.now().toString(),
        nombre,
        carrera,
        dia,
        horario,
    };

    cursos.push(nuevoCurso);
    await writeCursos(cursos);

    // Si es desde un cliente de API como Thunder Client
    if (req.headers.accept?.includes('application/json') || req.headers['content-type'] === 'application/json') {
        return res.status(201).json({ mensaje: '✅ Curso agregado correctamente', curso: nuevoCurso });
    }

    // Si es desde navegador (formulario HTML)
    return res.redirect('/admin/cursos/alta');
};


// Mostrar formulario de baja
export const mostrarBaja = async (req, res) => {
    const cursos = await readCursos();
    res.render('admin/bajaCurso', { cursos });
};

// Eliminar cursos (desde formulario o API)
export const borrarCursos = async (req, res) => {
    let cursos = await readCursos();
    const cursosSeleccionados = req.body.cursosSeleccionados;

    if (!cursosSeleccionados) {
        if (req.accepts('html')) {
            return res.redirect('/admin/cursos/baja');
        } else {
            return res.status(400).json({ error: 'No se especificaron cursos para eliminar' });
        }
    }

    if (Array.isArray(cursosSeleccionados)) {
        cursos = cursos.filter(c => !cursosSeleccionados.includes(c.id));
    } else {
        cursos = cursos.filter(c => c.id !== cursosSeleccionados);
    }

    await writeCursos(cursos);

    if (req.accepts('html')) {
        return res.redirect('/admin/cursos/baja');
    } else {
        return res.status(200).json({ mensaje: 'Cursos eliminados correctamente' });
    }
};

// Mostrar formulario de modificación
export const mostrarModificar = async (req, res) => {
    const cursos = await readCursos();
    res.render('admin/modificarCurso', { cursos });
};

// Modificar curso (desde formulario o API)
export const modificarCurso = async (req, res) => {
    const { cursoId, nombre, carrera, dia, horario } = req.body;
    let cursos = await readCursos();

    if (!cursoId || !nombre || !carrera || !dia || !horario) {
        if (req.accepts('html')) {
            return res.status(400).send('Todos los campos son obligatorios');
        } else {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
    }

    let cursoModificado = null;
    cursos = cursos.map(c => {
        if (c.id === cursoId) {
            cursoModificado = { ...c, nombre, carrera, dia, horario };
            return cursoModificado;
        }
        return c;
    });

    if (!cursoModificado) {
        return res.status(404).json({ error: 'Curso no encontrado' });
    }

    await writeCursos(cursos);

    if (req.accepts('html')) {
        return res.redirect('/admin/cursos/modificar');
    } else {
        return res.status(200).json({ mensaje: 'Curso modificado correctamente', curso: cursoModificado });
    }
};

// Consultar cursos (HTML o API)
export const listarCursos = async (req, res) => {
    const cursos = await readCursos();

    if (req.accepts('html')) {
        return res.render('admin/consultarCurso', { cursos });
    } else {
        return res.status(200).json(cursos);
    }
};
