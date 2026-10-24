// scripts/seed-mongodb.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ ERROR: MONGODB_URI no está definido en el archivo .env');
  process.exit(1);
}

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').trim();
  const lines = content.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(';').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(';').map(v => v.trim());
    const obj = {};
    headers.forEach((header, idx) => {
      let val = values[idx] !== undefined ? values[idx] : '';
      // Convertir campos numéricos
      if (['id', 'anio', 'potencia', 'fabricante_id', 'categoria_id', 'anio_fundacion', 'velocidad_maxima'].includes(header)) {
        val = parseInt(val, 10);
      } else if (header === 'aceleracion_0_100') {
        val = parseFloat(val);
      }
      obj[header] = val;
    });
    rows.push(obj);
  }
  return rows;
}

async function seed() {
  const client = new MongoClient(uri);

  try {
    console.log('⏳ Conectando a MongoDB Atlas...');
    await client.connect();
    console.log('✅ Conexión establecida con éxito.');

    const db = client.db(); // Usa la base de datos especificada en la URI (ej. catalogo_autos)
    console.log(`📁 Usando base de datos: "${db.databaseName}"`);

    // 1. Fabricantes
    const fabricantesPath = path.join(__dirname, '..', 'data', 'fabricantes.csv');
    const fabricantes = parseCSV(fabricantesPath);
    console.log(`\n🏎️ Procesando ${fabricantes.length} fabricantes...`);
    const colFabricantes = db.collection('fabricantes');
    await colFabricantes.deleteMany({});
    if (fabricantes.length > 0) {
      await colFabricantes.insertMany(fabricantes);
      console.log(`✅ ${fabricantes.length} fabricantes insertados.`);
    }

    // 2. Categorías
    const categoriasPath = path.join(__dirname, '..', 'data', 'categorias.csv');
    const categorias = parseCSV(categoriasPath);
    console.log(`\n🏎️ Procesando ${categorias.length} categorías...`);
    const colCategorias = db.collection('categorias');
    await colCategorias.deleteMany({});
    if (categorias.length > 0) {
      await colCategorias.insertMany(categorias);
      console.log(`✅ ${categorias.length} categorías insertadas.`);
    }

    // 3. Autos
    const autosPath = path.join(__dirname, '..', 'data', 'autos.csv');
    const autos = parseCSV(autosPath);
    console.log(`\n🏎️ Procesando ${autos.length} autos...`);
    const colAutos = db.collection('autos');
    await colAutos.deleteMany({});
    if (autos.length > 0) {
      await colAutos.insertMany(autos);
      console.log(`✅ ${autos.length} autos insertados.`);
    }

    // 4. Usuario inicial de prueba
    console.log('\n👤 Verificando usuario administrador...');
    const colUsuarios = db.collection('usuarios');
    await colUsuarios.deleteMany({}); // Limpiar para evitar duplicados
    const passwordHash = await bcrypt.hash('admin123', 10);
    const usuarioAdmin = {
      nombre: 'Irina Rivera',
      correo: 'admin@catalogo.com',
      password: passwordHash,
      rol: 'admin',
      fecha_creacion: new Date()
    };
    await colUsuarios.insertOne(usuarioAdmin);
    console.log('✅ Usuario inicial creado:');
    console.log('   - Correo: admin@catalogo.com');
    console.log('   - Clave: admin123');

    console.log('\n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE EN MONGODB ATLAS!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Resumen de colecciones en "${db.databaseName}":`);
    console.log(`   - Fabricantes: ${fabricantes.length}`);
    console.log(`   - Categorías:  ${categorias.length}`);
    console.log(`   - Autos:        ${autos.length}`);
    console.log(`   - Usuarios:     1`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error durante la migración a MongoDB:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada.');
  }
}

seed();
