// api/index.js
import app from '../app.js';
import serverless from 'serverless-http';
import { conectarDB } from '../config/db.js';

let isDbConnected = false;

async function connectToDatabase() {
    if (!isDbConnected) {
        try {
            console.log('⏳ Conectando a MongoDB Atlas...');
            await conectarDB();
            isDbConnected = true;
            console.log('✅ Conexión a MongoDB Atlas establecida');
        } catch (error) {
            console.error('❌ Error al conectar a MongoDB:', error.message);
            throw error;
        }
    } else {
        console.log('🔁 Conexión MongoDB ya establecida (usando cache)');
    }
}

// Adaptar Express a Vercel como función serverless
const handler = async (req, res) => {
    try {
        await connectToDatabase();
        const expressHandler = serverless(app);
        return expressHandler(req, res);
    } catch (error) {
        res.statusCode = 500;
        res.end('Error al inicializar la app o conectar a la base de datos');
    }
};

export default handler;
