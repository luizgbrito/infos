# Backend — acceso del app solo para compradores

Flujo: **compra en Cakto → webhook → valida y guarda en Supabase → envía login por Resend → el app valida contra la base.**

```
Cakto (compra aprobada)
   │  POST /api/cakto-webhook   (x-cakto-secret)
   ▼
Supabase  sdi_buyers(email, access_code, status=active)
   │
   ├─ Resend → email al comprador con email + contraseña + link del app
   ▼
App login  POST /api/login {email, code} → ok si status=active
```

## 1. Supabase
1. Creá un proyecto en Supabase.
2. En SQL Editor, corré `schema.sql` (crea la tabla `sdi_buyers`).
3. Copiá `Project URL` y la `service_role key` (Settings → API).

## 2. Resend
1. Creá cuenta en Resend y verificá tu dominio (ej. `saludbien.site`).
2. Generá una API key.

## 3. Deploy de las funciones (Vercel recomendado)
- Subí la carpeta `backend/` a un proyecto en Vercel (las funciones viven en `api/`).
- Variables de entorno:
  | Variable | Valor |
  |---|---|
  | `CAKTO_WEBHOOK_SECRET` | un secreto que inventás (lo pones también en Cakto) |
  | `SUPABASE_URL` | Project URL |
  | `SUPABASE_SERVICE_KEY` | service_role key |
  | `RESEND_API_KEY` | API key de Resend |
  | `MAIL_FROM` | `El Secreto de la Insulina <no-reply@saludbien.site>` |
  | `APP_URL` | `https://saludbien.site/SDI/app/` |
  | `CORS_ORIGIN` | `https://saludbien.site` |

## 4. Conectar el webhook en Cakto
- En Cakto → Integrações → Webhooks, apuntá el evento de **compra aprobada** a:
  `https://TU-BACKEND.vercel.app/api/cakto-webhook?secret=TU_CAKTO_WEBHOOK_SECRET`
- Ajustá en `cakto-webhook.js` los nombres de campos del payload real de Cakto (email, status, product) — dejé mapeos comunes, pero verificá con un envío de prueba.

## 5. Conectar el app
- En `assets/js/config.js` seteá:
  ```js
  authApi: "https://TU-BACKEND.vercel.app/api"
  ```
- Con eso, el login del app deja de usar el modo demo y valida contra la base (solo compradores).

## Reembolsos / chargebacks
- Para cortar acceso, cambiá `status` a `refunded`/`chargeback` (o agregá un webhook de reembolso que haga el UPDATE). El login solo acepta `status=active`.
