import mongoose from 'mongoose';

const inscripcionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
}, {
  timestamps: true,       // para createdAt y updatedAt
  collection: 'inscripciones'  // nombre explícito de la colección en MongoDB Atlas
});

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);

export default Inscripcion;
