// config/db.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    throw new Error('La variable de entorno MONGODB_URI no está definida');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const conectarDB = async () => {
    if (cached.conn) {
        // Reusar conexión existente
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
        dbName: 'rendixDB',
        // Opcionales que puedes agregar:
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    console.log('✅ Conectado a MongoDB Atlas');
    return cached.conn;
};
