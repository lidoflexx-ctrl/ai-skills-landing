
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const API_KEY = process.env.FORM_CHECK_KEY || "";
  const headers = event.headers || {};
  if (API_KEY) {
    const provided = headers['x-api-key'] || (event.queryStringParameters && event.queryStringParameters.api_key);
    if (!provided || provided !== API_KEY) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'Unauthorized — invalid API key' }) };
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed, use POST' }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) { /* ignore */ }
  const url = body.url;
  if (!url) return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Missing "url" in request body' }) };

  try {
    const resp = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return { statusCode: 200, body: JSON.stringify({ ok: true, status: resp.status, statusText: resp.statusText }) };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ ok: false, error: String(err) }) };
  }
};
