-- Admin allowlist: after creating a user in Supabase Auth (Dashboard → Authentication → Users),
-- insert their user id:
--   insert into public.admin_allowlist (user_id) values ('<uuid-from-auth.users>');

create table if not exists public.admin_allowlist (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_allowlist enable row level security;

drop policy if exists "admin_self_read" on public.admin_allowlist;
create policy "admin_self_read" on public.admin_allowlist
  for select to authenticated
  using (auth.uid() = user_id);

-- Anonymous visit analytics (insert from site; read only by admins)
create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  referrer text,
  user_agent text,
  visitor_key text,
  created_at timestamptz not null default now()
);

alter table public.page_visits enable row level security;

drop policy if exists "page_visits_anon_insert" on public.page_visits;
create policy "page_visits_anon_insert" on public.page_visits
  for insert to anon, authenticated
  with check (true);

drop policy if exists "page_visits_admin_select" on public.page_visits;
create policy "page_visits_admin_select" on public.page_visits
  for select to authenticated
  using (
    exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid())
  );

-- Source label for generic contact rows (homepage inquiry vs standalone contact page)
alter table public.contact_submissions
  add column if not exists source text not null default 'contact';

drop policy if exists "contact_submissions_admin_select" on public.contact_submissions;
create policy "contact_submissions_admin_select" on public.contact_submissions
  for select to authenticated
  using (
    exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid())
  );

drop policy if exists "appointments_admin_select" on public.appointments;
create policy "appointments_admin_select" on public.appointments
  for select to authenticated
  using (
    exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid())
  );

-- Expose to PostgREST roles (safe with RLS enabled)
grant select on public.admin_allowlist to authenticated;
grant select, insert on public.page_visits to anon, authenticated;
