// models/student/Asistencia.js
import mongoose from 'mongoose';

const asistenciaSchema = new mongoose.Schema(
  {
    fecha: { type: String, required: true }, // formato esperado: 'YYYY-MM-DD'
    hora: { type: String, required: true },  // formato esperado: 'HH:mm:ss'
    alumnoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', required: true },
    cursoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true }
  },
  {
    collection: 'asistencias',     // evita que Mongoose pluralice como 'asistenciases'
    timestamps: true               // opcional: agrega createdAt y updatedAt
  }
);

const Asistencia = mongoose.model('Asistencia', asistenciaSchema);
export default Asistencia;
