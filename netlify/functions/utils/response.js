// netlify/functions/utils/response.js

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

function handleCors(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }
  return null;
}

function json(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    },
    body: JSON.stringify(data)
  };
}

function error(message, statusCode = 500) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    },
    body: JSON.stringify({ error: message })
  };
}

module.exports = {
  corsHeaders,
  handleCors,
  json,
  error
};
