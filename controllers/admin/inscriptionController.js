import Inscripcion from '../../models/admin/Inscripcion.js';
import Alumno from '../../models/admin/Alumno.js';
import Curso from '../../models/admin/Curso.js';
import Usuario from '../../models/admin/Usuario.js';
import ListaEspera from '../../models/admin/ListaEspera.js';
import bcrypt from 'bcryptjs';  // <-- Importar bcryptjs

// Obtener inscripciones con detalles (alumno + curso)
export async function getInscripcionesWithDetails() {
  const inscripciones = await Inscripcion.find().lean();
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

// Renderizar vista para alta de inscripción
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

// Generar nombre de usuario (primeras 3 letras de nombre + apellido)
function generarUsuario(nombre, apellido) {
  return (nombre.slice(0, 3) + apellido.slice(0, 3)).toLowerCase();
}

// Agregar inscripción y crear alumno y usuario si no existen
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

    // Validar campos obligatorios mínimos
    if (!nombre || !apellido || !dni || !cursoSeleccionado) {
      return res.status(400).send('Faltan datos obligatorios para la inscripción');
    }

    // Buscar curso y validar capacidad
    const curso = await Curso.findById(cursoSeleccionado);
    if (!curso) {
      return res.status(404).send('Curso no encontrado');
    }

    curso.inscriptos = curso.inscriptos || 0;
    const capacidadMax = curso.carrera.toLowerCase().includes('carrera') ? 30 : 20;

    if (curso.inscriptos >= capacidadMax) {
      // Agregar a lista de espera si el curso está completo
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

    // Buscar alumno por DNI
    let alumno = await Alumno.findOne({ dni });

    // Validar que el alumno no esté inscrito ya en el curso
    if (alumno) {
      const inscripcionExistente = await Inscripcion.findOne({
        studentId: alumno._id,
        courseId: curso._id
      });
      if (inscripcionExistente) {
        return res.status(400).send('El alumno ya está inscrito en este curso');
      }
    }

    // Generar usuario
    const username = generarUsuario(nombre, apellido);

    // Buscar o crear usuario
    let usuario = await Usuario.findOne({ usuario: username });
    if (!usuario) {
      // Hashear la contraseña (en este caso usamos dni como contraseña)
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(dni, salt);

      usuario = await Usuario.create({
        usuario: username,
        contrasena: hashedPassword,  // <-- contraseña hasheada
        rol: 'alumno'
      });
    }

    // Crear alumno si no existe
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

    // Crear inscripción
    await Inscripcion.create({
      studentId: alumno._id,
      courseId: curso._id
    });

    // Actualizar cantidad de inscriptos
    curso.inscriptos += 1;
    await curso.save();

    return res.redirect('/admin/inscripciones/alta');
  } catch (err) {
    console.error('Error al inscribir:', err);
    return res.status(500).send('Error al procesar la inscripción');
  }
}


// Renderizar vista para consultar inscripciones
export async function renderConsultaInscripciones(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/consultarInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderConsultaInscripciones:', err);
    res.status(500).send('Error cargando consulta de inscripciones');
  }
}

// Renderizar vista para baja de inscripciones
export async function renderBajaInscripciones(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/bajaInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderBajaInscripciones:', err);
    res.status(500).send('Error cargando baja de inscripciones');
  }
}

// Eliminar inscripciones seleccionadas
export async function deleteInscriptions(req, res) {
  try {
    const { seleccionados } = req.body;
    const ids = Array.isArray(seleccionados) ? seleccionados : [seleccionados];

    for (const id of ids) {
      const inscripcion = await Inscripcion.findById(id);
      if (inscripcion) {
        // Reducir inscriptos del curso
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

// Renderizar listado para modificar inscripciones
export async function renderModificarInscripcion(req, res) {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/modificarInscripcion', { inscripciones });
  } catch (err) {
    console.error('Error en renderModificarInscripcion:', err);
    res.status(500).send('Error cargando modificación de inscripciones');
  }
}

// Renderizar formulario para modificar inscripción por id
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

// Actualizar inscripción y datos relacionados
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

    // Actualizar datos del alumno
    alumno.nombre = nombre;
    alumno.apellido = apellido;
    alumno.dni = dni;
    alumno.direccion = direccion;
    alumno.correoElectronico = correo;
    alumno.telefono = telefono;
    await alumno.save();

    // Buscar curso nuevo para asignar a la inscripción
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
