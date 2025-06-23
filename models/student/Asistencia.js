import mongoose from 'mongoose';

const asistenciaSchema = new mongoose.Schema({
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    alumnoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' },
    cursoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' },
});

export const Asistencia = mongoose.model('Asistencia', asistenciaSchema);
