// api/index.js
import app from '../app.js';
import serverless from 'serverless-http';
import { conectarDB } from '../config/db.js';

let isDbConnected = false;

async function connectToDatabase() {
    if (!isDbConnected) {
        await conectarDB();
        isDbConnected = true;
    }
}

const handler = serverless(async (req, res) => {
    await connectToDatabase();
    return app(req, res);
});

export default handler;
