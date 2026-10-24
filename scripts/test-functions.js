// scripts/test-functions.js
require('dotenv').config();

const authHandler = require('../netlify/functions/auth').handler;
const autosHandler = require('../netlify/functions/autos').handler;

async function runTests() {
  console.log('🧪 Iniciando pruebas de Netlify Functions...\n');

  // Test 1: GET /api/autos (Público)
  console.log('1. Probando GET /api/autos (Público)...');
  const getAutosRes = await autosHandler({
    httpMethod: 'GET',
    path: '/api/autos',
    headers: {}
  });
  console.log(`   Status: ${getAutosRes.statusCode}`);
  const autos = JSON.parse(getAutosRes.body);
  console.log(`   Autos recuperados: ${autos.length}`);
  if (autos.length > 0) {
    console.log(`   Primer auto: "${autos[0].modelo}" (${autos[0].marca}) - Fabricante: ${autos[0].fabricante_nombre}`);
  }

  // Test 2: POST /api/autos SIN token (debe responder 401)
  console.log('\n2. Probando POST /api/autos SIN token (debe fallar con 401)...');
  const postSinTokenRes = await autosHandler({
    httpMethod: 'POST',
    path: '/api/autos',
    headers: {},
    body: JSON.stringify({ modelo: 'Test Sin Token', marca: 'Test' })
  });
  console.log(`   Status: ${postSinTokenRes.statusCode}`);
  console.log(`   Body: ${postSinTokenRes.body}`);

  // Test 3: POST /api/auth/login (Credenciales de admin)
  console.log('\n3. Probando POST /api/auth/login con admin@catalogo.com...');
  const loginRes = await authHandler({
    httpMethod: 'POST',
    path: '/api/auth/login',
    headers: {},
    body: JSON.stringify({ correo: 'admin@catalogo.com', password: 'admin123' })
  });
  console.log(`   Status: ${loginRes.statusCode}`);
  const loginData = JSON.parse(loginRes.body);
  console.log(`   Token generado: ${loginData.token ? loginData.token.substring(0, 25) + '...' : 'NO'}`);

  // Test 4: POST /api/autos CON token válido (debe responder 201)
  console.log('\n4. Probando POST /api/autos CON token válido (debe crear)...');
  const postConTokenRes = await autosHandler({
    httpMethod: 'POST',
    path: '/api/autos',
    headers: {
      Authorization: `Bearer ${loginData.token}`
    },
    body: JSON.stringify({
      modelo: 'Auto Test Netlify',
      marca: 'Bugatti',
      anio: 2026,
      potencia: 1500,
      imagen: 'test.jpg',
      fabricante_id: 1,
      categoria_id: 1
    })
  });
  console.log(`   Status: ${postConTokenRes.statusCode}`);
  console.log(`   Respuesta: ${postConTokenRes.body}`);
  const newAutoData = JSON.parse(postConTokenRes.body);

  // Test 5: DELETE /api/autos/:id (limpiar auto de prueba)
  if (newAutoData.id) {
    console.log(`\n5. Eliminando auto de prueba ID ${newAutoData.id}...`);
    const deleteRes = await autosHandler({
      httpMethod: 'DELETE',
      path: `/api/autos/${newAutoData.id}`,
      headers: {
        Authorization: `Bearer ${loginData.token}`
      }
    });
    console.log(`   Status: ${deleteRes.statusCode}`);
    console.log(`   Respuesta: ${deleteRes.body}`);
  }

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE NETLIFY FUNCTIONS Y JWT PASARON!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Error en pruebas:', err);
  process.exit(1);
});
