// netlify/functions/fabricantes.js
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./utils/db');
const { verifyAuth } = require('./utils/auth');
const { handleCors, json, error } = require('./utils/response');

function extractId(event) {
  const cleanPath = event.path
    .replace(/\/\.netlify\/functions\/fabricantes\/?/, '')
    .replace(/\/api\/fabricantes\/?/, '');
  const segments = cleanPath.split('/').filter(Boolean);
  return segments.length > 0 ? segments[0] : null;
}

function buildIdFilter(idStr) {
  const numId = parseInt(idStr, 10);
  if (!isNaN(numId)) {
    return { $or: [{ id: numId }, { _id: ObjectId.isValid(idStr) ? new ObjectId(idStr) : null }] };
  }
  if (ObjectId.isValid(idStr)) {
    return { _id: new ObjectId(idStr) };
  }
  return { id: idStr };
}

exports.handler = async (event) => {
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  const method = event.httpMethod;
  const idStr = extractId(event);

  try {
    const { db } = await connectToDatabase();
    const colFabricantes = db.collection('fabricantes');

    // GET /api/fabricantes (Público)
    if (method === 'GET' && !idStr) {
      const fabricantes = await colFabricantes.find().sort({ nombre: 1 }).toArray();
      return json(fabricantes);
    }

    // GET /api/fabricantes/:id (Público)
    if (method === 'GET' && idStr) {
      const filter = buildIdFilter(idStr);
      const fabricante = await colFabricantes.findOne(filter);
      if (!fabricante) {
        return error('Fabricante no encontrado', 404);
      }
      return json(fabricante);
    }

    // Validar JWT para modificaciones
    const auth = verifyAuth(event);
    if (!auth.authenticated) {
      return error(auth.error, auth.statusCode);
    }

    // POST /api/fabricantes (Protegido)
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { nombre, pais, anio_fundacion, sitio_web, logo } = body;

      if (!nombre) {
        return error('El nombre del fabricante es requerido', 400);
      }

      const lastFab = await colFabricantes.find().sort({ id: -1 }).limit(1).toArray();
      const nextId = (lastFab.length > 0 && typeof lastFab[0].id === 'number') ? lastFab[0].id + 1 : 1;

      const nuevoFabricante = {
        id: nextId,
        nombre: nombre.trim(),
        pais: pais ? pais.trim() : '',
        anio_fundacion: parseInt(anio_fundacion, 10) || null,
        sitio_web: sitio_web ? sitio_web.trim() : '',
        logo: logo ? logo.trim() : '',
        creado_por: auth.user.correo,
        fecha_creacion: new Date()
      };

      const result = await colFabricantes.insertOne(nuevoFabricante);

      return json({
        message: 'Fabricante creado exitosamente',
        id: nextId,
        _id: result.insertedId
      }, 201);
    }

    // PUT /api/fabricantes/:id (Protegido)
    if (method === 'PUT' && idStr) {
      const body = JSON.parse(event.body || '{}');
      const { nombre, pais, anio_fundacion, sitio_web, logo } = body;

      const filter = buildIdFilter(idStr);

      const updateData = {
        $set: {
          nombre: nombre ? nombre.trim() : undefined,
          pais: pais !== undefined ? pais.trim() : undefined,
          anio_fundacion: anio_fundacion !== undefined ? parseInt(anio_fundacion, 10) : undefined,
          sitio_web: sitio_web !== undefined ? sitio_web.trim() : undefined,
          logo: logo !== undefined ? logo.trim() : undefined,
          modificado_por: auth.user.correo,
          fecha_modificacion: new Date()
        }
      };

      Object.keys(updateData.$set).forEach(
        key => updateData.$set[key] === undefined && delete updateData.$set[key]
      );

      const result = await colFabricantes.updateOne(filter, updateData);

      if (result.matchedCount === 0) {
        return error('Fabricante no encontrado para actualizar', 404);
      }

      return json({ message: 'Fabricante actualizado exitosamente' });
    }

    // DELETE /api/fabricantes/:id (Protegido)
    if (method === 'DELETE' && idStr) {
      const filter = buildIdFilter(idStr);
      const result = await colFabricantes.deleteOne(filter);

      if (result.deletedCount === 0) {
        return error('Fabricante no encontrado para eliminar', 404);
      }

      return json({ message: 'Fabricante eliminado exitosamente' });
    }

    return error('Método no permitido', 405);
  } catch (err) {
    console.error('Error en netlify/functions/fabricantes:', err);
    return error('Error interno del servidor en fabricantes: ' + err.message, 500);
  }
};
