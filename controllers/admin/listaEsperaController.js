import ListaEspera from '../../models/admin/ListaEspera.js';
import Curso from '../../models/admin/Curso.js';

export async function listarListaEspera(req, res) {
    try {
        // Buscar todos los registros y poblar el nombre del curso
        const lista = await ListaEspera.find()
        .populate('cursoId', 'nombre') // solo trae el nombre del curso
        .lean();

        res.render('admin/lista-espera', { lista });
    } catch (error) {
        console.error('Error al listar la lista de espera:', error);
        res.status(500).send('Error al cargar la lista de espera');
    }
}
