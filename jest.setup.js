// jest.setup.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rendix_test';

beforeAll(async () => {
        await mongoose.connect(MONGODB_URI, {
        // No pongas opciones deprecated, mongoose 8 ya no necesita useNewUrlParser, etc
        });
    console.log('✅ Conectado a MongoDB para testing');
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log('✅ Conexión MongoDB cerrada tras testing');
});
