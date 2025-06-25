// controllers/student/studentController.js
import mongoose from 'mongoose';
import Asistencia from '../../models/student/Asistencia.js';
import Usuario from '../../models/admin/Usuario.js';
import Alumno from '../../models/admin/Alumno.js';
import Curso from '../../models/admin/Curso.js';
import Inscripcion from '../../models/admin/Inscripcion.js'; // Asegúrate de que este modelo exista

// Mostrar los cursos del alumno
export const vistaCursosAlumno = async (req, res) => {
  try {
    const usuarioJWT = req.user?.usuario;
    if (!usuarioJWT) {
      return res.redirect('/login');
    }

    // Buscar usuario
    const user = await Usuario.findOne({ usuario: usuarioJWT }).lean();
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Buscar alumno asociado
    const student = await Alumno.findOne({ idUsuario: user._id }).lean();
    if (!student) {
      return res.status(404).send('Alumno no encontrado');
    }

    // Buscar inscripciones del alumno
    const inscripciones = await Inscripcion.find({ studentId: student._id }).lean();

    // Obtener detalles de los cursos inscritos
    const cursoIds = inscripciones.map(ins => ins.courseId);
    const cursosAlumno = await Curso.find({ _id: { $in: cursoIds } }).lean();

    const asistenciaDadaEn = req.query.curso || null;

    res.render('student/cursosAlumno', { cursos: cursosAlumno, asistenciaDadaEn });
  } catch (error) {
    console.error('❌ Error al obtener los cursos del alumno:', error.message);
    res.status(500).send('Error interno del servidor');
  }
};

// Registrar asistencia del alumno
export const registrarAsistencia = async (req, res) => {
  try {
    const { cursoId } = req.body;
    const usuarioJWT = req.user?.usuario;

    if (!usuarioJWT || !cursoId) {
      return res.status(400).json({ error: 'Faltan datos para registrar la asistencia' });
    }

    // Validar y convertir cursoId
    if (!mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({ error: 'ID de curso inválido' });
    }

    const cursoObjectId = new mongoose.Types.ObjectId(cursoId);

    const user = await Usuario.findOne({ usuario: usuarioJWT }).lean();
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const student = await Alumno.findOne({ idUsuario: user._id }).lean();
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const hoy = new Date().toISOString().split('T')[0];

    const asistenciaExistente = await Asistencia.findOne({
      alumnoId: student._id,
      cursoId: cursoObjectId,
      fecha: hoy
    });

    if (asistenciaExistente) {
      return res.redirect(`/student?curso=${cursoId}&mensaje=ya_dada`);
    }

    const ahora = new Date();
    const nuevaAsistencia = new Asistencia({
      fecha: hoy,
      hora: ahora.toTimeString().split(' ')[0],
      alumnoId: student._id,
      cursoId: cursoObjectId
    });

    await nuevaAsistencia.save();

    res.redirect(`/student?curso=${cursoId}&asistencia=ok`);
  } catch (err) {
    console.error('❌ Error al registrar asistencia:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
