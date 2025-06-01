import { Router } from 'express';

// Controladores de Cursos
import {
  mostrarAlta,
  agregarCurso,
  mostrarBaja,
  borrarCursos,
  mostrarModificar,
  modificarCurso,
  listarCursos
} from '../controllers/admin/courseController.js';

// Controladores de Inscripciones
import {
  addInscription,
  deleteInscriptions,
  updateInscription,
  renderAltaInscripcion,
  renderConsultaInscripciones,
  renderBajaInscripciones,
  renderModificarInscripcion,
  getInscripcionesWithDetails // lo necesitaremos para la lista
} from '../controllers/admin/inscriptionController.js';


// Controladores de Aistencias
import { listarAsistencias } from '../controllers/admin/asistenciaController.js';


const router = Router();

// ─── Middleware de logging ────────────────────────────────────────────
router.use((req, res, next) => {
  console.log(`🛠 [ADMIN] ${req.method} ${req.originalUrl}`);
  next();
});
console.log('⚙️  Rutas de administración cargadas');


// ─── Menú principal del administrador ─────────────────────────────────
router.get('/', (req, res) => {
  res.render('admin/menu', { usuario: req.session.usuario || 'Admin' });
});

// ─── Sección de CURSOS ────────────────────────────────────────────────
router.get('/cursos', (req, res) => {
  res.render('admin/cursos');
});

// Alta de curso
router.get('/cursos/alta', mostrarAlta);
router.post('/cursos/alta', agregarCurso);

// Baja de curso
router.get('/cursos/baja', mostrarBaja);
router.post('/cursos/borrar', borrarCursos);
router.delete('/cursos/borrar', borrarCursos);

// Modificación de curso
router.get('/modificacion-curso', mostrarModificar);
router.post('/cursos/modificar', modificarCurso);
router.put('/cursos/modificar', modificarCurso);

// Consulta de cursos
router.get('/cursos/consulta', listarCursos);



// ─── Sección de INSCRIPCIONES ─────────────────────────────────────────
router.get('/inscripciones', (req, res) => {
  res.render('admin/inscripciones');
});

// Alta de inscripción
router.get('/altaInscripcion', renderAltaInscripcion);
router.post('/altaInscripcion', async (req, res) => {
  try {
    const { cursoSeleccionado, ...studentData } = req.body;
    await addInscription(studentData, cursoSeleccionado);
    res.redirect('/admin/altaInscripcion');
  } catch (err) {
    console.error('❌ Error altaInscripcion POST:', err);
    res.status(500).send('Error al agregar inscripción');
  }
});

// Consulta de inscripciones
router.get('/consultarInscripcion', renderConsultaInscripciones);

// Baja de inscripciones
router.get('/bajaInscripcion', renderBajaInscripciones);
router.post('/bajaInscripcion', async (req, res) => {
  try {
    let ids = req.body.seleccionados || [];

    if (!Array.isArray(ids)) ids = [ids]; // normaliza a array

    await deleteInscriptions(ids);
    res.redirect('/admin/bajaInscripcion');
  } catch (err) {
    console.error('❌ Error bajaInscripcion POST:', err);
    res.status(500).send('Error al eliminar inscripciones');
  }
});

// ─── Modificación de inscripciones ────────────────────────────────────

// Ruta para listar todas las inscripciones (vista general para modificar)
router.get('/modificarInscripcion', async (req, res) => {
  try {
    const inscripciones = await getInscripcionesWithDetails();
    res.render('admin/modificarInscripcion', { inscripciones });
  } catch (err) {
    console.error('❌ Error en GET modificarInscripcion:', err);
    res.status(500).send('Error al cargar la lista de inscripciones');
  }
});

// Ruta para mostrar formulario con la inscripción a modificar (por ID)
router.get('/modificarInscripcion/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const inscripciones = await getInscripcionesWithDetails();
    const inscripcionSeleccionada = inscripciones.find(ins => ins.id === id);

    if (!inscripcionSeleccionada) {
      return res.status(404).send('Inscripción no encontrada');
    }

    res.render('admin/modificarInscripcion', {
      inscripcionSeleccionada,
      inscripciones
    });
  } catch (err) {
    console.error('❌ Error en GET modificarInscripcion/:id:', err);
    res.status(500).send('Error al cargar la inscripción para modificar');
  }
});

// POST para procesar la modificación enviada desde el formulario
router.post('/modificarInscripcion', async (req, res) => {
  try {
    const { idInscripcion, ...updatedData } = req.body;

    if (!idInscripcion) {
      throw new Error('Falta el ID de la inscripción');
    }

    await updateInscription(idInscripcion, updatedData);

    // Redirige a la lista general de inscripciones para modificar
    res.redirect('/admin/modificarInscripcion');
    // O si prefieres redirigir a la edición del mismo registro:
    // res.redirect(`/admin/modificarInscripcion/${idInscripcion}`);
  } catch (err) {
    console.error('❌ Error modificarInscripcion POST:', err);
    res.status(500).send('Error al modificar inscripción');
  }
});


// ─── Sección de ASISTENCIAS ────────────────────────────────────────────────

router.get('/asistencias', listarAsistencias);





export default router;
