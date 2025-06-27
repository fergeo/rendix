// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno (solo si no están ya cargadas)
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    throw new Error('La variable de entorno MONGODB_URI no está definida');
}

// Cache global para evitar múltiples conexiones (útil en serverless)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const conectarDB = async () => {
    if (cached.conn) {
        console.log('🔁 Usando conexión MongoDB cacheada');
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('⏳ Estableciendo nueva conexión a MongoDB Atlas...');
        cached.promise = mongoose
            .connect(MONGO_URI, {
                dbName: 'rendixDB',
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((mongoose) => {
                console.log('✅ Conectado a MongoDB Atlas');
                return mongoose.connection;
            })
            .catch((err) => {
                console.error('❌ Error al conectar con MongoDB Atlas:', err.message);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};
