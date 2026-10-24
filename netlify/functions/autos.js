// netlify/functions/autos.js
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./utils/db');
const { verifyAuth } = require('./utils/auth');
const { handleCors, json, error } = require('./utils/response');

function extractId(event) {
  // Extrae el ID ya sea de /api/autos/:id o de /.netlify/functions/autos/:id
  const cleanPath = event.path
    .replace(/\/\.netlify\/functions\/autos\/?/, '')
    .replace(/\/api\/autos\/?/, '');
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
    const colAutos = db.collection('autos');

    // ==========================================
    // GET /api/autos - Listar todos los autos (Público)
    // ==========================================
    if (method === 'GET' && !idStr) {
      const pipeline = [
        {
          $lookup: {
            from: 'fabricantes',
            localField: 'fabricante_id',
            foreignField: 'id',
            as: 'fabricante'
          }
        },
        {
          $lookup: {
            from: 'categorias',
            localField: 'categoria_id',
            foreignField: 'id',
            as: 'categoria'
          }
        },
        {
          $addFields: {
            fab: { $arrayElemAt: ['$fabricante', 0] },
            cat: { $arrayElemAt: ['$categoria', 0] }
          }
        },
        {
          $project: {
            _id: 1,
            id: 1,
            modelo: 1,
            marca: 1,
            anio: 1,
            potencia: 1,
            imagen: 1,
            fabricante_id: 1,
            categoria_id: 1,
            fabricante_nombre: { $ifNull: ['$fab.nombre', 'Desconocido'] },
            pais: { $ifNull: ['$fab.pais', ''] },
            sitio_web: { $ifNull: ['$fab.sitio_web', ''] },
            tipo_motor: { $ifNull: ['$cat.tipo_motor', ''] },
            traccion: { $ifNull: ['$cat.traccion', ''] },
            aceleracion_0_100: { $ifNull: ['$cat.aceleracion_0_100', 0] },
            velocidad_maxima: { $ifNull: ['$cat.velocidad_maxima', 0] }
          }
        },
        { $sort: { id: 1 } }
      ];

      const autos = await colAutos.aggregate(pipeline).toArray();
      return json(autos);
    }

    // ==========================================
    // GET /api/autos/:id - Obtener un auto (Público)
    // ==========================================
    if (method === 'GET' && idStr) {
      const filter = buildIdFilter(idStr);
      const pipeline = [
        { $match: filter },
        {
          $lookup: {
            from: 'fabricantes',
            localField: 'fabricante_id',
            foreignField: 'id',
            as: 'fabricante'
          }
        },
        {
          $lookup: {
            from: 'categorias',
            localField: 'categoria_id',
            foreignField: 'id',
            as: 'categoria'
          }
        },
        {
          $addFields: {
            fab: { $arrayElemAt: ['$fabricante', 0] },
            cat: { $arrayElemAt: ['$categoria', 0] }
          }
        },
        {
          $project: {
            _id: 1,
            id: 1,
            modelo: 1,
            marca: 1,
            anio: 1,
            potencia: 1,
            imagen: 1,
            fabricante_id: 1,
            categoria_id: 1,
            fabricante_nombre: { $ifNull: ['$fab.nombre', 'Desconocido'] },
            pais: { $ifNull: ['$fab.pais', ''] },
            sitio_web: { $ifNull: ['$fab.sitio_web', ''] },
            tipo_motor: { $ifNull: ['$cat.tipo_motor', ''] },
            traccion: { $ifNull: ['$cat.traccion', ''] },
            aceleracion_0_100: { $ifNull: ['$cat.aceleracion_0_100', 0] },
            velocidad_maxima: { $ifNull: ['$cat.velocidad_maxima', 0] }
          }
        }
      ];

      const results = await colAutos.aggregate(pipeline).toArray();
      if (!results || results.length === 0) {
        return error('Auto no encontrado', 404);
      }
      return json(results[0]);
    }

    // ==========================================
    // VALIDACIÓN JWT PARA OPERACIONES DE ESCRITURA
    // (POST, PUT, DELETE requieren usuario autenticado)
    // ==========================================
    const auth = verifyAuth(event);
    if (!auth.authenticated) {
      return error(auth.error, auth.statusCode);
    }

    // ==========================================
    // POST /api/autos - Crear auto (Protegido)
    // ==========================================
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { modelo, marca, anio, potencia, imagen, fabricante_id, categoria_id } = body;

      if (!modelo || !marca) {
        return error('El modelo y la marca son requeridos', 400);
      }

      // Calcular el próximo ID entero secuencial
      const lastAuto = await colAutos.find().sort({ id: -1 }).limit(1).toArray();
      const nextId = (lastAuto.length > 0 && typeof lastAuto[0].id === 'number') ? lastAuto[0].id + 1 : 1;

      const nuevoAuto = {
        id: nextId,
        modelo: modelo.trim(),
        marca: marca.trim(),
        anio: parseInt(anio, 10) || new Date().getFullYear(),
        potencia: parseInt(potencia, 10) || 0,
        imagen: imagen ? imagen.trim() : '',
        fabricante_id: parseInt(fabricante_id, 10) || null,
        categoria_id: parseInt(categoria_id, 10) || null,
        creado_por: auth.user.correo,
        fecha_creacion: new Date()
      };

      const result = await colAutos.insertOne(nuevoAuto);

      return json({
        message: 'Auto creado exitosamente',
        id: nextId,
        _id: result.insertedId
      }, 201);
    }

    // ==========================================
    // PUT /api/autos/:id - Actualizar auto (Protegido)
    // ==========================================
    if (method === 'PUT' && idStr) {
      const body = JSON.parse(event.body || '{}');
      const { modelo, marca, anio, potencia, imagen, fabricante_id, categoria_id } = body;

      const filter = buildIdFilter(idStr);

      const updateData = {
        $set: {
          modelo: modelo ? modelo.trim() : undefined,
          marca: marca ? marca.trim() : undefined,
          anio: anio !== undefined ? parseInt(anio, 10) : undefined,
          potencia: potencia !== undefined ? parseInt(potencia, 10) : undefined,
          imagen: imagen !== undefined ? imagen.trim() : undefined,
          fabricante_id: fabricante_id !== undefined ? parseInt(fabricante_id, 10) : undefined,
          categoria_id: categoria_id !== undefined ? parseInt(categoria_id, 10) : undefined,
          modificado_por: auth.user.correo,
          fecha_modificacion: new Date()
        }
      };

      // Eliminar campos undefined
      Object.keys(updateData.$set).forEach(
        key => updateData.$set[key] === undefined && delete updateData.$set[key]
      );

      const result = await colAutos.updateOne(filter, updateData);

      if (result.matchedCount === 0) {
        return error('Auto no encontrado para actualizar', 404);
      }

      return json({ message: 'Auto actualizado exitosamente' });
    }

    // ==========================================
    // DELETE /api/autos/:id - Eliminar auto (Protegido)
    // ==========================================
    if (method === 'DELETE' && idStr) {
      const filter = buildIdFilter(idStr);
      const result = await colAutos.deleteOne(filter);

      if (result.deletedCount === 0) {
        return error('Auto no encontrado para eliminar', 404);
      }

      return json({ message: 'Auto eliminado exitosamente' });
    }

    return error('Método no permitido', 405);
  } catch (err) {
    console.error('Error en netlify/functions/autos:', err);
    return error('Error interno del servidor en autos: ' + err.message, 500);
  }
};
