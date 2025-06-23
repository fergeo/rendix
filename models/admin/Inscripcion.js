// models/admin/Inscripcion.js
import mongoose from 'mongoose';

const inscripcionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
}, {
  timestamps: true, // Opcional, para tener createdAt y updatedAt
});

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);

export default Inscripcion;
