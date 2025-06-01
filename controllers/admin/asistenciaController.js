import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const asistenciaPath = resolve(__dirname, '../../models/student/asistenciaModel.json');
const studentPath = resolve(__dirname, '../../models/admin/studentsModel.json');
const coursePath = resolve(__dirname, '../../models/admin/courseModel.json');

export const listarAsistencias = async (req, res) => {
  try {
    // Leer todos los archivos en paralelo
    const [asistenciasData, estudiantesData, cursosData] = await Promise.all([
      readFile(asistenciaPath, 'utf8'),
      readFile(studentPath, 'utf8'),
      readFile(coursePath, 'utf8')
    ]);

    const asistencias = JSON.parse(asistenciasData);
    const estudiantes = JSON.parse(estudiantesData);
    const cursos = JSON.parse(cursosData);

    // Enriquecer asistencias con datos de estudiantes y cursos
    const asistenciasEnriquecidas = asistencias.map(a => {
      const estudiante = estudiantes.find(e => e.id === a.alumnoId);
      const curso = cursos.find(c => c.id === a.cursoId);

      return {
        fecha: a.fecha,
        hora: a.hora,
        nombre: estudiante ? estudiante.nombre : 'N/A',
        apellido: estudiante ? estudiante.apellido : 'N/A',
        dni: estudiante ? estudiante.dni : 'N/A',
        cursoNombre: curso ? curso.nombre : 'N/A'
      };
    });

    // Renderizar la vista con los datos preparados
    res.render('admin/asistencias', { asistencias: asistenciasEnriquecidas });
  } catch (error) {
    console.error('❌ Error al cargar lista de asistencias:', error);
    res.status(500).send('Error interno del servidor');
  }
};
