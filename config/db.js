// /config/db.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI;

export const conectarDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('La variable de entorno MONGODB_URI no está definida');
        }

        await mongoose.connect(MONGO_URI, {
            dbName: 'rendixDB',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error.message);
        process.exit(1); // Detiene la app si falla la conexión
    }
};
