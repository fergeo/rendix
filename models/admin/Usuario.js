// models/admin/Usuario.js
import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  contrasena: { type: String, required: true },
  rol: { type: String, required: true }
}, {
  timestamps: true
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
