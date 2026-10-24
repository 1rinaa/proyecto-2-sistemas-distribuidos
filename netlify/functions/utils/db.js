// netlify/functions/utils/db.js
const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('La variable de entorno MONGODB_URI no está configurada.');
  }

  // Configuración optimizada para Serverless
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = {
  connectToDatabase
};
