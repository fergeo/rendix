import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://fgeodev:rVwV87K21XWl7jqY@clusterrendix.iutyuyh.mongodb.net/rendixDB?retryWrites=true&w=majority';

export const conectarDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: 'rendixDB', 
        });
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
};
