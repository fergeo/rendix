import Inscripcion from '../../models/admin/Inscripcion.js';
import Alumno from '../../models/admin/Alumno.js';
import Curso from '../../models/admin/Curso.js';
import Usuario from '../../models/admin/Usuario.js';
import ListaEspera from '../../models/admin/ListaEspera.js';

// Obtener inscripciones con detalles
export async function getInscripcionesWithDetails() {
  const inscripciones = await Inscripcion.find();
  const resultados = [];

  for (const ins of inscripciones) {
    const alumno = await Alumno.findById(ins.studentId).lean();
    const curso = await Curso.findById(ins.courseId).lean();
    if (!alumno || !curso) continue;

    resultados.push({
      id: ins._id,
      studentId: alumno._id,
      courseId: curso._id,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      dni: alumno.dni,
      direccion: alumno.direccion,
      correo: alumno.correoElectronico,
      telefono: alumno.telefono,
      nombreCurso: curso.nombre,
      carreraCurso: curso.carrera,
      dia: curso.dia,
      horario: curso.horario
    });
  }

  return resultados;
}

// Renderizar alta de inscripción
export async function renderAltaInscripcion(req, res) {
  try {
    const cursos = await Curso.find();
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/altaInscripcion', { cursos, inscripciones });
  } catch (err) {
    console.error('Error en renderAltaInscripcion:', err);
    res.status(500).send('Error cargando alta de inscripciones');
  }
}

// Generar nombre de usuario
function generarUsuario(nombre, apellido) {
  return nombre.toLowerCase().slice(0, 3) + apellido.toLowerCase().slice(0, 3);
}

// Agregar inscripción
export async function addInscription(req, res) {
  try {
    // En formulario envías cursoSeleccionado, no cursoId
    const {
      nombre,
      apellido,
      dni,
      direccion,
      correoElectronico,
      telefono,
      cursoSeleccionado
    } = req.body;

    const curso = await Curso.findById(cursoSeleccionado);
    if (!curso) throw new Error('Curso no encontrado');

    const capacidadMax = curso.carrera.toLowerCase().includes('carrera') ? 30 : 20;

    if (curso.inscriptos >= capacidadMax) {
      await ListaEspera.create({
        nombre,
        apellido,
        dni,
        correoElectronico,
        telefono,
        cursoId: curso._id,
        enEspera: true
      });
      // Redirigir a alta con mensaje en query o flash (opcional)
      return res.redirect('/admin/inscripciones/alta');
    }

    const username = generarUsuario(nombre, apellido);
    let usuario = await Usuario.findOne({ usuario: username });
    if (!usuario) {
      usuario = await Usuario.create({
        usuario: username,
        contrasena: dni,
        rol: 'alumno'
      });
    }

    let alumno = await Alumno.findOne({ dni });
    if (!alumno) {
      alumno = await Alumno.create({
        nombre,
        apellido,
        dni,
        direccion,
        correoElectronico,
        telefono,
        idUsuario: usuario._id
      });
    }

    await Inscripcion.create({
      studentId: alumno._id,
      courseId: curso._id
    });

    // Incrementar inscriptos y guardar
    curso.inscriptos = (curso.inscriptos || 0) + 1;
    await curso.save();

    return res.redirect('/admin/inscripciones/alta');
  } catch (err) {
    console.error('Error al inscribir:', err);
    return res.status(500).send('Error al procesar la inscripción');
  }
}

// Consultar inscripciones
export async function renderConsultaInscripciones(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/consultarInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderConsultaInscripciones:', err);
    res.status(500).send('Error cargando consulta de inscripciones');
  }
}

// Renderizar baja de inscripciones
export async function renderBajaInscripciones(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/bajaInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderBajaInscripciones:', err);
    res.status(500).send('Error cargando baja de inscripciones');
  }
}

// Eliminar inscripciones
export async function deleteInscriptions(req, res) {
  try {
    const { inscripcionesSeleccionadas } = req.body;
    const ids = Array.isArray(inscripcionesSeleccionadas)
      ? inscripcionesSeleccionadas
      : [inscripcionesSeleccionadas];
    await Inscripcion.deleteMany({ _id: { $in: ids } });
    return res.redirect('/admin/inscripciones/baja');
  } catch (err) {
    console.error('Error al borrar inscripciones:', err);
    res.status(500).send('Error eliminando inscripciones');
  }
}

// Renderizar listado para modificación (sin inscripción seleccionada)
export async function renderModificarInscripcion(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/modificarInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderModificarInscripcion:', err);
    res.status(500).send('Error cargando modificación de inscripciones');
  }
}

// Renderizar formulario con inscripción seleccionada para modificar
export async function renderModificarInscripcionById(req, res) {
  try {
    const id = req.params.id;
    const inscripciones = await getInscripcionesWithDetails();
    // Buscar la inscripción que corresponde al id
    const inscripcionSeleccionada = inscripciones.find(i => i.id.toString() === id.toString());

    if (!inscripcionSeleccionada) {
      return res.status(404).send('Inscripción no encontrada');
    }

    res.render('admin/modificarInscripcion', { 
      inscripciones,
      inscripcionSeleccionada
    });
  } catch (err) {
    console.error('Error en renderModificarInscripcionById:', err);
    res.status(500).send('Error cargando inscripción para modificar');
  }
}

// Actualizar inscripción
export async function updateInscription(req, res) {
  try {
    const {
      idInscripcion,
      nombre,
      apellido,
      dni,
      direccion,
      correo,
      telefono,
      nombreCurso,
      carreraCurso,
      dia,
      horario
    } = req.body;

    // Buscar la inscripción para actualizar curso y alumno
    const inscripcion = await Inscripcion.findById(idInscripcion);
    if (!inscripcion) return res.status(404).send('Inscripción no encontrada');

    // Actualizar alumno asociado
    const alumno = await Alumno.findById(inscripcion.studentId);
    if (!alumno) return res.status(404).send('Alumno no encontrado');

    alumno.nombre = nombre;
    alumno.apellido = apellido;
    alumno.dni = dni;
    alumno.direccion = direccion;
    alumno.correoElectronico = correo;
    alumno.telefono = telefono;
    await alumno.save();

    // Buscar curso por nombre, carrera, día y horario para actualizar courseId
    const curso = await Curso.findOne({
      nombre: nombreCurso,
      carrera: carreraCurso,
      dia: dia,
      horario: horario
    });

    if (curso) {
      inscripcion.courseId = curso._id;
    } else {
      // Si no encuentra curso, puede optar por no cambiar o enviar error
      return res.status(400).send('Curso no encontrado con los datos proporcionados');
    }

    await inscripcion.save();

    return res.redirect('/admin/inscripciones/modificar');
  } catch (err) {
    console.error('Error al actualizar inscripción:', err);
    res.status(500).send('Error al modificar inscripción');
  }
}
