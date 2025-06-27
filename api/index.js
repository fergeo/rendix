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
        } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        throw error;
        }
    } else {
        console.log('🔁 Conexión MongoDB ya establecida (cacheada)');
    }
}

// Adaptar Express a Vercel usando serverless-http
const handler = serverless(async (req, res) => {
    await connectToDatabase(); // Conecta solo una vez (reutiliza)
    return app(req, res);
});

export default handler;
