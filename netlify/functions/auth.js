// netlify/functions/auth.js
const bcrypt = require('bcryptjs');
const { connectToDatabase } = require('./utils/db');
const { signToken, verifyAuth } = require('./utils/auth');
const { handleCors, json, error } = require('./utils/response');

exports.handler = async (event) => {
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  const path = event.path;
  const method = event.httpMethod;

  try {
    const { db } = await connectToDatabase();
    const colUsuarios = db.collection('usuarios');

    // POST /api/auth/register
    if (path.endsWith('/register') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { nombre, correo, password, rol = 'user' } = body;

      if (!nombre || !correo || !password) {
        return error('Nombre, correo y contraseña son obligatorios', 400);
      }

      // Validar si el usuario ya existe
      const existingUser = await colUsuarios.findOne({ correo: correo.toLowerCase().trim() });
      if (existingUser) {
        return error('Ya existe un usuario registrado con este correo electrónico', 400);
      }

      // Encriptar contraseña con bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const nuevoUsuario = {
        nombre: nombre.trim(),
        correo: correo.toLowerCase().trim(),
        password: hashedPassword,
        rol: rol || 'user',
        fecha_creacion: new Date()
      };

      const result = await colUsuarios.insertOne(nuevoUsuario);

      // Generar JWT
      const token = signToken({
        id: result.insertedId.toString(),
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      });

      return json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: result.insertedId.toString(),
          nombre: nuevoUsuario.nombre,
          correo: nuevoUsuario.correo,
          rol: nuevoUsuario.rol
        }
      }, 201);
    }

    // POST /api/auth/login
    if (path.endsWith('/login') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { correo, password } = body;

      if (!correo || !password) {
        return error('Correo y contraseña son obligatorios', 400);
      }

      const user = await colUsuarios.findOne({ correo: correo.toLowerCase().trim() });
      if (!user) {
        return error('Credenciales inválidas: Correo o contraseña incorrectos', 401);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return error('Credenciales inválidas: Correo o contraseña incorrectos', 401);
      }

      // Generar JWT con identidad y expiración
      const token = signToken({
        id: user._id.toString(),
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol || 'user'
      });

      return json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user._id.toString(),
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol || 'user'
        }
      });
    }

    // GET /api/auth/me (Verificar sesión actual)
    if (path.endsWith('/me') && method === 'GET') {
      const auth = verifyAuth(event);
      if (!auth.authenticated) {
        return error(auth.error, auth.statusCode);
      }
      return json({ user: auth.user });
    }

    // PUT /api/auth/profile (Actualizar nombre o contraseña)
    if (path.endsWith('/profile') && method === 'PUT') {
      const auth = verifyAuth(event);
      if (!auth.authenticated) {
        return error(auth.error, auth.statusCode);
      }

      const body = JSON.parse(event.body || '{}');
      const { nombre, passwordActual, passwordNuevo } = body;

      const { ObjectId } = require('mongodb');
      let userIdFilter;
      try {
        userIdFilter = { _id: new ObjectId(auth.user.id) };
      } catch (e) {
        userIdFilter = { correo: auth.user.correo };
      }

      const user = await colUsuarios.findOne(userIdFilter);
      if (!user) {
        return error('Usuario no encontrado', 404);
      }

      const updateFields = {};

      if (nombre && nombre.trim()) {
        updateFields.nombre = nombre.trim();
      }

      if (passwordNuevo) {
        if (!passwordActual) {
          return error('Debe ingresar su contraseña actual para poder cambiarla', 400);
        }
        if (passwordNuevo.length < 6) {
          return error('La nueva contraseña debe tener al menos 6 caracteres', 400);
        }

        const isMatch = await bcrypt.compare(passwordActual, user.password);
        if (!isMatch) {
          return error('La contraseña actual es incorrecta', 400);
        }

        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(passwordNuevo, salt);
      }

      if (Object.keys(updateFields).length === 0) {
        return error('No se proporcionaron datos para actualizar', 400);
      }

      updateFields.fecha_modificacion = new Date();

      await colUsuarios.updateOne(userIdFilter, { $set: updateFields });

      const updatedUser = await colUsuarios.findOne(userIdFilter);

      const newToken = signToken({
        id: updatedUser._id.toString(),
        nombre: updatedUser.nombre,
        correo: updatedUser.correo,
        rol: updatedUser.rol || 'user'
      });

      return json({
        message: 'Perfil actualizado exitosamente',
        token: newToken,
        user: {
          id: updatedUser._id.toString(),
          nombre: updatedUser.nombre,
          correo: updatedUser.correo,
          rol: updatedUser.rol || 'user'
        }
      });
    }

    return error('Ruta de autenticación no encontrada', 404);
  } catch (err) {
    console.error('Error en netlify/functions/auth:', err);
    return error('Error interno del servidor en autenticación: ' + err.message, 500);
  }
};
