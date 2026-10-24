// scripts/dev-server.js
require('dotenv').config();
const http = require('http');

const authHandler = require('../netlify/functions/auth').handler;
const autosHandler = require('../netlify/functions/autos').handler;
const fabricantesHandler = require('../netlify/functions/fabricantes').handler;
const categoriasHandler = require('../netlify/functions/categorias').handler;

const PORT = 8787;

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    const event = {
      httpMethod: req.method,
      path: pathname,
      headers: req.headers,
      body: body || null,
      queryStringParameters: Object.fromEntries(url.searchParams.entries())
    };

    let response;
    try {
      if (pathname.startsWith('/api/auth')) {
        response = await authHandler(event);
      } else if (pathname.startsWith('/api/autos')) {
        response = await autosHandler(event);
      } else if (pathname.startsWith('/api/fabricantes')) {
        response = await fabricantesHandler(event);
      } else if (pathname.startsWith('/api/categorias')) {
        response = await categoriasHandler(event);
      } else {
        response = {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Ruta no encontrada en la API' })
        };
      }
    } catch (err) {
      console.error('Error procesando solicitud:', err);
      response = {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Error del servidor: ' + err.message })
      };
    }

    const headers = response.headers || { 'Content-Type': 'application/json' };
    res.writeHead(response.statusCode, headers);
    res.end(response.body);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor local de Netlify Functions corriendo en http://localhost:${PORT}`);
});
