
export default async function handler(req, res) {
  const API_KEY = process.env.FORM_CHECK_KEY || "";
  if (API_KEY) {
    const provided = req.headers['x-api-key'] || req.query['api_key'];
    if (!provided || provided !== API_KEY) {
      return res.status(401).json({ ok: false, error: 'Unauthorized — invalid API key' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed, use POST' });
  }

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ ok: false, error: 'Missing "url" in request body' });

  try {
    const resp = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return res.status(200).json({ ok: true, status: resp.status, statusText: resp.statusText });
  } catch (err) {
    return res.status(502).json({ ok: false, error: String(err) });
  }
}
