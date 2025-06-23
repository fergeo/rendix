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
      id: ins._id.toString(),
      studentId: alumno._id.toString(),
      courseId: curso._id.toString(),
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
    const cursos = await Curso.find().lean();
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
    const {
      nombre,
      apellido,
      dni,
      direccion,
      correoElectronico,
      telefono,
      cursoSeleccionado
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !dni || !cursoSeleccionado) {
      return res.status(400).send('Faltan datos obligatorios para la inscripción');
    }

    const curso = await Curso.findById(cursoSeleccionado);
    if (!curso) throw new Error('Curso no encontrado');

    curso.inscriptos = curso.inscriptos || 0;
    const capacidadMax = curso.carrera.toLowerCase().includes('carrera') ? 30 : 20;

    if (curso.inscriptos >= capacidadMax) {
      await ListaEspera.create({
        nombre,
        apellido,
        dni,
        correoElectronico,
        telefono,
        cursoId: curso._id
      });
      return res.redirect('/admin/inscripciones/alta');
    }

    let alumno = await Alumno.findOne({ dni });

    // Evitar inscribir alumno ya inscrito en el mismo curso
    if (alumno) {
      const inscripcionExistente = await Inscripcion.findOne({
        studentId: alumno._id,
        courseId: curso._id
      });
      if (inscripcionExistente) {
        // Ya está inscrito, redirigir o mostrar mensaje
        return res.status(400).send('El alumno ya está inscrito en este curso');
      }
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

    curso.inscriptos += 1;
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
    const { seleccionados } = req.body;
    const ids = Array.isArray(seleccionados) ? seleccionados : [seleccionados];

    for (const id of ids) {
      const inscripcion = await Inscripcion.findById(id);
      if (inscripcion) {
        const curso = await Curso.findById(inscripcion.courseId);
        if (curso && curso.inscriptos > 0) {
          curso.inscriptos -= 1;
          await curso.save();
        }
        await inscripcion.deleteOne();
      }
    }

    return res.redirect('/admin/inscripciones/baja');
  } catch (err) {
    console.error('Error al borrar inscripciones:', err);
    res.status(500).send('Error eliminando inscripciones');
  }
}

// Renderizar listado para modificar sin inscripción seleccionada
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
    const inscripcionSeleccionada = inscripciones.find(i => i.id === id);

    if (!inscripcionSeleccionada) {
      return res.status(404).send('Inscripción no encontrada');
    }

    res.render('admin/modificarInscripcion', { inscripciones, inscripcionSeleccionada });
  } catch (err) {
    console.error('Error en renderModificarInscripcionById:', err);
    res.status(500).send('Error cargando inscripción para modificar');
  }
}

// Actualizar inscripción y redirigir
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

    const inscripcion = await Inscripcion.findById(idInscripcion);
    if (!inscripcion) return res.status(404).send('Inscripción no encontrada');

    const alumno = await Alumno.findById(inscripcion.studentId);
    if (!alumno) return res.status(404).send('Alumno no encontrado');

    alumno.nombre = nombre;
    alumno.apellido = apellido;
    alumno.dni = dni;
    alumno.direccion = direccion;
    alumno.correoElectronico = correo;
    alumno.telefono = telefono;
    await alumno.save();

    const curso = await Curso.findOne({
      nombre: nombreCurso,
      carrera: carreraCurso,
      dia: dia,
      horario: horario
    });

    if (!curso) {
      return res.status(400).send('Curso no encontrado con los datos proporcionados');
    }

    inscripcion.courseId = curso._id;
    await inscripcion.save();

    return res.redirect(`/admin/inscripciones/modificar/${idInscripcion}`);
  } catch (err) {
    console.error('Error al actualizar inscripción:', err);
    res.status(500).send('Error al modificar inscripción');
  }
}
