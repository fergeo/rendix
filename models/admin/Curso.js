import mongoose from 'mongoose';

const cursoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  carrera: { type: String, required: true },
  dia: { type: String, required: true },
  horario: { type: String, required: true },
  capacidad: { type: Number, required: true },
  inscriptos: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Curso = mongoose.model('Curso', cursoSchema);

export default Curso; 
