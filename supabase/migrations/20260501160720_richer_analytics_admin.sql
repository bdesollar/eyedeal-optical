-- Richer admin analytics: visitor context, contact/chat correlation, and interaction events.

alter table public.page_visits
  add column if not exists session_id text,
  add column if not exists screen_width int,
  add column if not exists screen_height int,
  add column if not exists language text,
  add column if not exists timezone text,
  add column if not exists ip_address text,
  add column if not exists ip_city text,
  add column if not exists ip_region text,
  add column if not exists ip_country text,
  add column if not exists ip_org text;

alter table public.contact_submissions
  add column if not exists visitor_key text,
  add column if not exists session_id text,
  add column if not exists page_path text,
  add column if not exists user_agent text,
  add column if not exists screen_width int,
  add column if not exists screen_height int,
  add column if not exists language text,
  add column if not exists timezone text,
  add column if not exists ip_address text,
  add column if not exists ip_city text,
  add column if not exists ip_region text,
  add column if not exists ip_country text,
  add column if not exists ip_org text;

alter table public.site_chat_log
  add column if not exists session_id text,
  add column if not exists user_agent text,
  add column if not exists screen_width int,
  add column if not exists screen_height int,
  add column if not exists language text,
  add column if not exists timezone text,
  add column if not exists ip_address text,
  add column if not exists ip_city text,
  add column if not exists ip_region text,
  add column if not exists ip_country text,
  add column if not exists ip_org text;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  path text not null default '/',
  target_label text,
  target_href text,
  section_id text,
  duration_ms int,
  metadata jsonb not null default '{}'::jsonb,
  visitor_key text,
  session_id text,
  user_agent text,
  screen_width int,
  screen_height int,
  language text,
  timezone text,
  ip_address text,
  ip_city text,
  ip_region text,
  ip_country text,
  ip_org text,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

drop policy if exists "analytics_events_anon_insert" on public.analytics_events;
create policy "analytics_events_anon_insert" on public.analytics_events
  for insert to anon, authenticated
  with check (true);

drop policy if exists "analytics_events_admin_select" on public.analytics_events;
create policy "analytics_events_admin_select" on public.analytics_events
  for select to authenticated
  using (
    exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid())
  );

grant select, insert on public.analytics_events to anon, authenticated;
