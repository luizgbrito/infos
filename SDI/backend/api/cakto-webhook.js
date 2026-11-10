/* Webhook de compra de Cakto -> valida -> guarda comprador en Supabase -> envía login por Resend.
 * Deploy: Vercel/Netlify function o Supabase Edge (adaptando req/res). Node 18+ (fetch global).
 * Env: CAKTO_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY,
 *      MAIL_FROM (ej "El Secreto de la Insulina <no-reply@tudominio>"), APP_URL
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  // 1) Verificar el secreto compartido (configuralo también en el panel de Cakto)
  const secret = req.headers['x-cakto-secret'] || req.query?.secret;
  if (!process.env.CAKTO_WEBHOOK_SECRET || secret !== process.env.CAKTO_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

  // 2) Solo liberar en compra aprobada/pagada (ajustá los nombres según el payload real de Cakto)
  const status = (body.status || body.event || body.data?.status || '').toString().toLowerCase();
  const paid = ['paid', 'approved', 'aprovado', 'aprovada', 'purchase_approved', 'order.paid', 'compra_aprovada'].some(s => status.includes(s));
  if (!paid) return res.status(200).json({ ok: true, ignored: status });

  // 3) Extraer email / producto / order (ajustá las rutas a tu payload de Cakto)
  const d = body.data || body;
  const email = (d.customer?.email || d.buyer?.email || d.email || '').toLowerCase().trim();
  const product = d.product?.name || d.product_name || d.offer?.name || 'El Secreto de la Insulina';
  const orderId = d.id || d.order_id || d.transaction || '';
  if (!email) return res.status(400).json({ error: 'no email' });

  // 4) Generar código de acceso
  const accessCode = genCode();

  // 5) Upsert en Supabase (REST)
  const up = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sdi_buyers`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify({ email, access_code: accessCode, product, order_id: orderId, status: 'active' })
  });
  if (!up.ok) return res.status(502).json({ error: 'db', detail: await up.text() });

  // 6) Enviar login por Resend
  const appUrl = process.env.APP_URL || 'https://saludbien.site/SDI/app/';
  const mail = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'El Secreto de la Insulina <no-reply@saludbien.site>',
      to: [email],
      subject: 'Tu acceso a El Secreto de la Insulina',
      html: loginEmail(appUrl, email, accessCode)
    })
  });
  if (!mail.ok) return res.status(502).json({ error: 'mail', detail: await mail.text() });

  return res.status(200).json({ ok: true });
}

function genCode() {
  const a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = ''; for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

function loginEmail(appUrl, email, code) {
  return `
  <div style="font-family:Raleway,Arial,sans-serif;background:#143d2c;color:#eae3d2;padding:28px;border-radius:16px;max-width:460px;margin:auto">
    <h2 style="color:#e0ad44;margin:0 0 8px">EL SECRETO DE LA INSULINA</h2>
    <p>¡Tu compra está confirmada! Ya puedes entrar a tu app con el plan de 21 días.</p>
    <p style="margin:16px 0 4px"><b>Email:</b> ${email}</p>
    <p style="margin:0 0 16px"><b>Contraseña:</b> ${code}</p>
    <a href="${appUrl}" style="display:inline-block;background:linear-gradient(180deg,#f6d98a,#e0ad44);color:#143d2c;font-weight:800;padding:14px 22px;border-radius:999px;text-decoration:none">Entrar a la app</a>
    <p style="color:#a9b6a7;font-size:12px;margin-top:18px">Si tienes problemas, responde a este correo.</p>
  </div>`;
}
