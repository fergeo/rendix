// models/admin/ListaEspera.js
import mongoose from 'mongoose';

const listaEsperaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: String, required: true },
    correoElectronico: { type: String, required: true },
    telefono: { type: String, required: true },
    cursoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
}, {
  timestamps: true, // para createdAt y updatedAt
});

const ListaEspera = mongoose.model('ListaEspera', listaEsperaSchema);

export default ListaEspera;
