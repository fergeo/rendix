// models/admin/Alumno.js
import mongoose from 'mongoose';

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: String, required: true },
  direccion: { type: String, required: true },
  correoElectronico: { type: String, required: true },
  telefono: { type: String, required: true },
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
});

const Alumno = mongoose.model('Alumno', alumnoSchema);

export default Alumno;
