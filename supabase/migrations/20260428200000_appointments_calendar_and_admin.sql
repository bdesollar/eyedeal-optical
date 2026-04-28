-- Calendar scheduling, admin update/manual insert, and anonymous slot-usage for booking UI
-- (Run after previous migrations; use America/Chicago for the studio)

alter table public.appointments
  add column if not exists scheduled_start timestamptz,
  add column if not exists duration_minutes int not null default 30
    check (duration_minutes > 0 and duration_minutes <= 480),
  add column if not exists source text not null default 'public_form'
    check (source in ('public_form', 'admin_manual')),
  add column if not exists admin_notes text;

-- Helpful for ordering
create index if not exists idx_appointments_scheduled_start
  on public.appointments (scheduled_start) where scheduled_start is not null;

-- Appointments: admins can update (confirm, reschedule, cancel) and create manual entries
drop policy if exists "appointments_admin_update" on public.appointments;
create policy "appointments_admin_update" on public.appointments
  for update to authenticated
  using (
    exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid())
  );

-- Extra insert for admins: still covered by "appointments_public_insert" (true), but be explicit
drop policy if exists "appointments_admin_insert" on public.appointments;
create policy "appointments_admin_insert" on public.appointments
  for insert to authenticated
  with check (
    exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid())
  );

grant update on public.appointments to authenticated;

-- Anonymous: how many active bookings are already at each start minute in a local date range (no PII)
-- SECURITY DEFINER: anon cannot read appointments; we only expose aggregate slot counts (no PII)
create or replace function public.appointment_slot_counts(p_from date, p_to date)
returns table (start_minute timestamptz, booking_count int)
language sql
stable
security definer
set search_path = public
as $$
  select date_trunc('minute', a.scheduled_start) as start_minute,
         (count(*))::int as booking_count
  from public.appointments a
  where a.scheduled_start is not null
    and a.status in ('pending', 'confirmed')
    and (a.scheduled_start at time zone 'America/Chicago')::date between p_from and p_to
  group by 1
$$;

grant execute on function public.appointment_slot_counts(date, date) to anon, authenticated;
