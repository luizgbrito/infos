create table public.bw3d_cakto_purchases (
  order_id uuid primary key,
  offer_id text not null,
  amount numeric not null check (amount >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  paid_at timestamptz not null,
  utm jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.bw3d_cakto_purchases enable row level security;
revoke all on table public.bw3d_cakto_purchases from public, anon, authenticated, service_role;
grant insert on table public.bw3d_cakto_purchases to service_role;
grant select (order_id) on table public.bw3d_cakto_purchases to service_role;
