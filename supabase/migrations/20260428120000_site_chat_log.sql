-- Quick-answers chat widget: one row per user message + auto-reply (visible to admins only)
create table if not exists public.site_chat_log (
  id uuid primary key default gen_random_uuid(),
  user_message text not null,
  assistant_reply text not null,
  category text not null default 'fallback',
  path text,
  visitor_key text,
  created_at timestamptz not null default now()
);

alter table public.site_chat_log enable row level security;

drop policy if exists "site_chat_log_anon_insert" on public.site_chat_log;
create policy "site_chat_log_anon_insert" on public.site_chat_log
  for insert to anon, authenticated
  with check (true);

drop policy if exists "site_chat_log_admin_select" on public.site_chat_log;
create policy "site_chat_log_admin_select" on public.site_chat_log
  for select to authenticated
  using (
    exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid())
  );

grant select, insert on public.site_chat_log to anon, authenticated;
