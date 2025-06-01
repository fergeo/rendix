import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Configurar ruta al archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = resolve(__dirname, '../../models/admin/courseModel.json');

// Leer cursos desde JSON
async function readCursos() {
    try {
        const data = await readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Escribir cursos al JSON
async function writeCursos(cursos) {
    await writeFile(dataPath, JSON.stringify(cursos, null, 2));
}

// Mostrar formulario de alta
export const mostrarAlta = async (req, res) => {
    const cursos = await readCursos();
    res.render('admin/altaCurso', { cursos });
};

// Agregar un nuevo curso
export const agregarCurso = async (req, res) => {
    const cursos = await readCursos();
    const { nombre, carrera, dia, horario } = req.body;

    if (!nombre || !carrera || !dia || !horario) {
        const mensaje = 'Faltan campos obligatorios';
        if (req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ error: mensaje });
        } else {
            return res.status(400).send(mensaje);
        }
    }

    const nuevoCurso = {
        id: Date.now().toString(),
        nombre,
        carrera,
        dia,
        horario
    };

    cursos.push(nuevoCurso);
    await writeCursos(cursos);

    if (req.headers.accept?.includes('application/json') || req.headers['content-type'] === 'application/json') {
        return res.status(201).json({ mensaje: '✅ Curso agregado correctamente', curso: nuevoCurso });
    } else {
        return res.redirect('/admin/cursos/alta');
    }
};

// Mostrar formulario de baja
export const mostrarBaja = async (req, res) => {
    const cursos = await readCursos();
    res.render('admin/bajaCurso', { cursos });
};

// Borrar cursos
export const borrarCursos = async (req, res) => {
    let cursos = await readCursos();
    const cursosSeleccionados = req.body.cursosSeleccionados;

    if (!cursosSeleccionados || cursosSeleccionados.length === 0) {
        const mensaje = 'No se especificaron cursos para eliminar';
        if (req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ error: mensaje });
        } else {
            return res.status(400).send(mensaje);
        }
    }

    const idsAEliminar = Array.isArray(cursosSeleccionados)
        ? cursosSeleccionados
        : [cursosSeleccionados];

    const cursosAntes = cursos.length;
    cursos = cursos.filter(c => !idsAEliminar.includes(c.id));
    const eliminados = cursosAntes - cursos.length;

    await writeCursos(cursos);

    if (req.headers.accept?.includes('application/json') || req.headers['content-type'] === 'application/json') {
        return res.status(200).json({ mensaje: `🗑️ Se eliminaron ${eliminados} curso(s)` });
    } else {
        return res.redirect('/admin/cursos/baja');
    }
};

// Mostrar formulario de modificación
export const mostrarModificar = async (req, res) => {
    const cursos = await readCursos();
    res.render('admin/modificarCurso', { cursos });
};

// Modificar curso existente
export const modificarCurso = async (req, res) => {
    const { cursoId, nombre, carrera, dia, horario } = req.body;
    let cursos = await readCursos();

    if (!cursoId || !nombre || !carrera || !dia || !horario) {
        const mensaje = 'Faltan campos obligatorios para modificar el curso';
        if (req.headers.accept?.includes('application/json')) {
            return res.status(400).json({ error: mensaje });
        } else {
            return res.status(400).send(mensaje);
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

    if (req.headers.accept?.includes('application/json') || req.headers['content-type'] === 'application/json') {
        return res.status(200).json({ mensaje: '✏️ Curso modificado correctamente', curso: cursoModificado });
    } else {
        return res.redirect('/admin/modificacion-curso');
    }
};


// Consultar todos los cursos
export const listarCursos = async (req, res) => {
    const cursos = await readCursos();

    const aceptaJSON = req.headers.accept?.includes('application/json');
    const esJSON = req.headers['content-type'] === 'application/json';

    if (aceptaJSON || esJSON || req.xhr) {
        return res.status(200).json({
            mensaje: '📚 Lista de cursos obtenida correctamente',
            cantidad: cursos.length,
            cursos
        });
    } else {
        return res.render('admin/consultarCurso', { cursos });
    }
};
