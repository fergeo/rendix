import Asistencia from '../../models/student/Asistencia.js';
import Alumno from '../../models/admin/Alumno.js';
import Curso from '../../models/admin/Curso.js';

export const listarAsistencias = async (req, res) => {
  try {
    const asistencias = await Asistencia.find().sort({ fecha: -1, hora: -1 }).lean();

    const asistenciasEnriquecidas = await Promise.all(
      asistencias.map(async (a) => {
        let alumno = null;
        let curso = null;

        try {
          alumno = await Alumno.findById(a.alumnoId).lean();
        } catch (e) {
          console.warn(`No se pudo cargar alumno con ID: ${a.alumnoId}`);
        }

        try {
          curso = await Curso.findById(a.cursoId).lean();
        } catch (e) {
          console.warn(`No se pudo cargar curso con ID: ${a.cursoId}`);
        }

        return {
          fecha: a.fecha,
          hora: a.hora,
          nombre: alumno?.nombre || 'Desconocido',
          apellido: alumno?.apellido || '',
          dni: alumno?.dni || '',
          cursoNombre: curso?.nombre || 'Curso eliminado'
        };
      })
    );

    res.render('admin/asistencias', { asistencias: asistenciasEnriquecidas });
  } catch (error) {
    console.error('Error al cargar lista de asistencias:', error.message);
    res.status(500).send('Error interno del servidor');
  }
};
