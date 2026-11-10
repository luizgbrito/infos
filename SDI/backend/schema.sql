-- Supabase / Postgres: tabla de compradores que liberan acceso al app.
create table if not exists sdi_buyers (
  email       text primary key,
  access_code text not null,
  product     text,
  order_id    text,
  status      text not null default 'active',   -- active | refunded | chargeback
  created_at  timestamptz not null default now()
);

-- Índice para login rápido
create index if not exists sdi_buyers_code_idx on sdi_buyers (email, access_code);

-- RLS: el acceso se hace solo con la service key desde el backend.
alter table sdi_buyers enable row level security;
-- (no policies = solo service_role puede leer/escribir)
