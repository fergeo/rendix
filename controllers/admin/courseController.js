import Curso from '../../models/admin/Curso.js';

// Clase controladora
class CursoController {
  // Mostrar formulario de alta
  static async mostrarAlta(req, res) {
    const cursos = await Curso.find();
    res.render('admin/altaCurso', { cursos });
  }

  // Crear curso
  static async agregarCurso(req, res) {
    const { nombre, carrera, dia, horario } = req.body;

    if (!nombre || !carrera || !dia || !horario) {
      const mensaje = 'Faltan campos obligatorios';
      return req.headers.accept?.includes('application/json')
        ? res.status(400).json({ error: mensaje })
        : res.status(400).send(mensaje);
    }

    const capacidad = carrera.toLowerCase() === 'curso' ? 20 : 30;
    const nuevoCurso = new Curso({ nombre, carrera, dia, horario, capacidad, inscriptos: 0 });

    await nuevoCurso.save();

    return req.headers.accept?.includes('application/json') || req.headers['content-type'] === 'application/json'
      ? res.status(201).json({ mensaje: 'Curso agregado correctamente', curso: nuevoCurso })
      : res.redirect('/admin/cursos/alta');
  }

  // Mostrar formulario de baja
  static async mostrarBaja(req, res) {
    const cursos = await Curso.find();
    res.render('admin/bajaCurso', { cursos });
  }

  // Borrar cursos
  static async borrarCursos(req, res) {
    const cursosSeleccionados = req.body.cursosSeleccionados;
    if (!cursosSeleccionados || cursosSeleccionados.length === 0) {
      const mensaje = 'No se especificaron cursos para eliminar';
      return req.headers.accept?.includes('application/json')
        ? res.status(400).json({ error: mensaje })
        : res.status(400).send(mensaje);
    }

    const idsAEliminar = Array.isArray(cursosSeleccionados)
      ? cursosSeleccionados
      : [cursosSeleccionados];

    const result = await Curso.deleteMany({ _id: { $in: idsAEliminar } });

    return req.headers.accept?.includes('application/json') || req.headers['content-type'] === 'application/json'
      ? res.status(200).json({ mensaje: `Se eliminaron ${result.deletedCount} curso(s)` })
      : res.redirect('/admin/cursos/baja');
  }

  // Mostrar formulario de modificación
  static async mostrarModificar(req, res) {
    const cursos = await Curso.find();
    res.render('admin/modificarCurso', { cursos });
  }

  // Modificar curso existente
  static async modificarCurso(req, res) {
    const { cursoId, nombre, carrera, dia, horario, capacidad, inscriptos } = req.body;

    if (!cursoId || !nombre || !carrera || !dia || !horario || !capacidad || inscriptos === undefined) {
      const mensaje = 'Faltan campos obligatorios';
      return req.headers.accept?.includes('application/json')
        ? res.status(400).json({ error: mensaje })
        : res.status(400).send(mensaje);
    }

    const cursoActualizado = await Curso.findByIdAndUpdate(
      cursoId,
      { nombre, carrera, dia, horario, capacidad, inscriptos },
      { new: true }
    );

    if (!cursoActualizado) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    return req.headers.accept?.includes('application/json') || req.headers['content-type'] === 'application/json'
      ? res.status(200).json({ mensaje: 'Curso modificado correctamente', curso: cursoActualizado })
      : res.redirect('/admin/cursos/modificar');
  }

  // Consultar cursos
  static async listarCursos(req, res) {
    const cursos = await Curso.find();

    return req.headers.accept?.includes('application/json') || req.xhr
      ? res.status(200).json({ mensaje: 'Lista de cursos', cantidad: cursos.length, cursos })
      : res.render('admin/consultarCurso', { cursos });
  }
}

export default CursoController;
