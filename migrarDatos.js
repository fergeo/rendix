import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';

const MONGO_URI = 'mongodb+srv://fgeodev:rVwV87K21XWl7jqY@clusterrendix.iutyuyh.mongodb.net/';
const DATABASE_NAME = 'rendixDB';

// Mapeo de archivos y rutas corregidas
const archivos = [
  { archivo: 'courseModel.json', coleccion: 'cursos', ruta: 'models/admin' },
  { archivo: 'inscriptionModel.json', coleccion: 'inscripciones', ruta: 'models/admin' },
  { archivo: 'studentsModel.json', coleccion: 'alumnos', ruta: 'models/admin' },
  { archivo: 'userModel.json', coleccion: 'usuarios', ruta: 'models/admin' },
  { archivo: 'listaEsperaModel.json', coleccion: 'lista_espera', ruta: 'models/admin' },
  { archivo: 'asistenciaModel.json', coleccion: 'asistencias', ruta: 'models/student' },
];

async function migrar() {
  const client = new MongoClient(MONGO_URI); // ✅ sin opciones obsoletas

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    console.log(`🚀 Conectado a MongoDB Atlas: ${DATABASE_NAME}`);

    for (const { archivo, coleccion, ruta } of archivos) {
      const rutaCompleta = path.join(ruta, archivo);
      try {
        const contenido = await fs.readFile(rutaCompleta, 'utf8');
        const datos = JSON.parse(contenido);
        const documentos = Array.isArray(datos) ? datos : [datos];

        if (documentos.length > 0) {
          const result = await db.collection(coleccion).insertMany(documentos);
          console.log(`✅ ${archivo} → ${coleccion} (${result.insertedCount} documentos insertados)`);
        } else {
          console.log(`⚠️ ${archivo} está vacío`);
        }
      } catch (err) {
        console.error(`❌ Error al procesar ${archivo}: ${err.message}`);
      }
    }

    console.log('🎉 Migración completada con éxito.');
  } catch (error) {
    console.error('❌ Error general de conexión o proceso:', error.message);
  } finally {
    await client.close();
  }
}

migrar();
