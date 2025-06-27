// config/db.js
import mongoose from 'mongoose';

export const conectarDB = async () => {
    const MONGO_URI = process.env.MONGODB_URI;

    if (!MONGO_URI) {
        throw new Error('La variable de entorno MONGODB_URI no está definida');
    }

    try {
        await mongoose.connect(MONGO_URI, {
            dbName: 'rendixDB',
        });

        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error.message);
        process.exit(1); // Detiene la app si falla la conexión
    }
};
