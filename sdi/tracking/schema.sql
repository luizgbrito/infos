-- Rode no Supabase: SQL Editor > New query > Run
create extension if not exists pgcrypto;

create table if not exists visits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id text not null,
  page_url text, referrer text, user_agent text,
  utm_source text, utm_medium text, utm_campaign text,
  utm_content text, utm_term text, utm_id text,
  fbclid text
);

create table if not exists events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id text not null,
  name text not null,            -- quiz_step | checkout_click | downsell_shown ...
  step int,
  utm_source text, utm_campaign text, utm_content text,
  meta jsonb
);

create table if not exists live_sessions (
  session_id text primary key,
  last_seen timestamptz not null default now(),
  step int,
  utm_campaign text
);

create index on visits (created_at);
create index on events (created_at, name);

-- RLS: o navegador (anon) so pode INSERIR. Nao consegue ler nada.
alter table visits enable row level security;
alter table events enable row level security;
alter table live_sessions enable row level security;
grant insert on visits, events to anon;
grant usage, select on all sequences in schema public to anon;
create policy anon_insert_visits on visits for insert to anon with check (true);
create policy anon_insert_events on events for insert to anon with check (true);

-- Heartbeat "online agora" via RPC (nao expoe leitura da tabela)
create or replace function live_session_ping(p_session_id text, p_step int, p_campaign text)
returns void language sql security definer set search_path = public as $$
  insert into live_sessions(session_id,last_seen,step,utm_campaign)
  values (p_session_id, now(), p_step, p_campaign)
  on conflict (session_id) do update
    set last_seen = now(), step = excluded.step, utm_campaign = excluded.utm_campaign;
$$;
grant execute on function live_session_ping(text,int,text) to anon;

-- Views de relatorio (so voce le, pelo painel / service role)
create or replace view report_by_campaign as
select coalesce(utm_campaign,'(sem campanha)') campaign,
       coalesce(utm_content,'(sem anuncio)') ad,
       count(distinct session_id) visitors
from visits group by 1,2 order by visitors desc;

create or replace view report_funnel as
select step, count(distinct session_id) sessions
from events where name='quiz_step' group by step order by step;

create or replace view report_checkout_by_campaign as
select coalesce(utm_campaign,'(sem campanha)') campaign,
       coalesce(utm_content,'(sem anuncio)') ad,
       count(distinct session_id) checkout_clicks
from events where name='checkout_click' group by 1,2 order by 3 desc;

create or replace view report_online_now as
select count(*) online, coalesce(avg(step),0)::int avg_step
from live_sessions where last_seen > now() - interval '2 minutes';

revoke all on report_by_campaign, report_funnel, report_checkout_by_campaign, report_online_now from anon, authenticated;
revoke all on live_sessions from anon, authenticated;
