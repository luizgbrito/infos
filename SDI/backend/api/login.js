/* Login del app: valida email + código contra Supabase. Devuelve ok si la compra está activa.
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY. Deploy junto al webhook.
 */
export default async function handler(req, res) {
  // CORS para que el app (otro dominio/estático) pueda llamar
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const email = (body.email || '').toLowerCase().trim();
  const code = (body.code || body.password || '').trim();
  if (!email || !code) return res.status(400).json({ ok: false, error: 'faltan datos' });

  const url = `${process.env.SUPABASE_URL}/rest/v1/sdi_buyers`
    + `?email=eq.${encodeURIComponent(email)}`
    + `&access_code=eq.${encodeURIComponent(code)}`
    + `&status=eq.active&select=email,product`;

  const r = await fetch(url, {
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
    }
  });
  if (!r.ok) return res.status(502).json({ ok: false, error: 'db' });
  const rows = await r.json();
  if (Array.isArray(rows) && rows.length) {
    return res.status(200).json({ ok: true, email, product: rows[0].product });
  }
  return res.status(401).json({ ok: false, error: 'sin acceso' });
}
