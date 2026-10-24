// netlify/functions/utils/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_jwt_catalogo_autos_distribuidos_2026_key';
const JWT_EXPIRES_IN = '24h'; // Expira en 24 horas

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyAuth(event) {
  const headers = event.headers || {};
  const authHeader = headers['authorization'] || headers['Authorization'];

  if (!authHeader) {
    return {
      authenticated: false,
      statusCode: 401,
      error: 'Acceso no autorizado: Se requiere encabezado Authorization'
    };
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return {
      authenticated: false,
      statusCode: 401,
      error: 'Acceso no autorizado: Formato de token inválido. Use "Bearer <token>"'
    };
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      authenticated: true,
      user: decoded
    };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return {
        authenticated: false,
        statusCode: 401,
        error: 'Sesión expirada: El token ha caducado. Inicie sesión nuevamente.'
      };
    }
    return {
      authenticated: false,
      statusCode: 401,
      error: 'Acceso no autorizado: Token inválido.'
    };
  }
}

module.exports = {
  signToken,
  verifyAuth
};
