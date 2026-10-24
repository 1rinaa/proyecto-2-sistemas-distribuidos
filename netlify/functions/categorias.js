// netlify/functions/categorias.js
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./utils/db');
const { verifyAuth } = require('./utils/auth');
const { handleCors, json, error } = require('./utils/response');

function extractId(event) {
  const cleanPath = event.path
    .replace(/\/\.netlify\/functions\/categorias\/?/, '')
    .replace(/\/api\/categorias\/?/, '');
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
    const colCategorias = db.collection('categorias');

    // GET /api/categorias (Público)
    if (method === 'GET' && !idStr) {
      const categorias = await colCategorias.find().sort({ id: 1 }).toArray();
      return json(categorias);
    }

    // GET /api/categorias/:id (Público)
    if (method === 'GET' && idStr) {
      const filter = buildIdFilter(idStr);
      const categoria = await colCategorias.findOne(filter);
      if (!categoria) {
        return error('Categoría no encontrada', 404);
      }
      return json(categoria);
    }

    // Validar JWT para modificaciones
    const auth = verifyAuth(event);
    if (!auth.authenticated) {
      return error(auth.error, auth.statusCode);
    }

    // POST /api/categorias (Protegido)
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { tipo_motor, traccion, aceleracion_0_100, velocidad_maxima } = body;

      if (!tipo_motor) {
        return error('El tipo de motor es requerido', 400);
      }

      const lastCat = await colCategorias.find().sort({ id: -1 }).limit(1).toArray();
      const nextId = (lastCat.length > 0 && typeof lastCat[0].id === 'number') ? lastCat[0].id + 1 : 1;

      const nuevaCategoria = {
        id: nextId,
        tipo_motor: tipo_motor.trim(),
        traccion: traccion ? traccion.trim() : '',
        aceleracion_0_100: parseFloat(aceleracion_0_100) || 0,
        velocidad_maxima: parseInt(velocidad_maxima, 10) || 0,
        creado_por: auth.user.correo,
        fecha_creacion: new Date()
      };

      const result = await colCategorias.insertOne(nuevaCategoria);

      return json({
        message: 'Categoría creada exitosamente',
        id: nextId,
        _id: result.insertedId
      }, 201);
    }

    // PUT /api/categorias/:id (Protegido)
    if (method === 'PUT' && idStr) {
      const body = JSON.parse(event.body || '{}');
      const { tipo_motor, traccion, aceleracion_0_100, velocidad_maxima } = body;

      const filter = buildIdFilter(idStr);

      const updateData = {
        $set: {
          tipo_motor: tipo_motor ? tipo_motor.trim() : undefined,
          traccion: traccion !== undefined ? traccion.trim() : undefined,
          aceleracion_0_100: aceleracion_0_100 !== undefined ? parseFloat(aceleracion_0_100) : undefined,
          velocidad_maxima: velocidad_maxima !== undefined ? parseInt(velocidad_maxima, 10) : undefined,
          modificado_por: auth.user.correo,
          fecha_modificacion: new Date()
        }
      };

      Object.keys(updateData.$set).forEach(
        key => updateData.$set[key] === undefined && delete updateData.$set[key]
      );

      const result = await colCategorias.updateOne(filter, updateData);

      if (result.matchedCount === 0) {
        return error('Categoría no encontrada para actualizar', 404);
      }

      return json({ message: 'Categoría actualizada exitosamente' });
    }

    // DELETE /api/categorias/:id (Protegido)
    if (method === 'DELETE' && idStr) {
      const filter = buildIdFilter(idStr);
      const result = await colCategorias.deleteOne(filter);

      if (result.deletedCount === 0) {
        return error('Categoría no encontrada para eliminar', 404);
      }

      return json({ message: 'Categoría eliminada exitosamente' });
    }

    return error('Método no permitido', 405);
  } catch (err) {
    console.error('Error en netlify/functions/categorias:', err);
    return error('Error interno del servidor en categorías: ' + err.message, 500);
  }
};
