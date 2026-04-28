-- Eyedeal Optical — initial schema
-- Run this in your Supabase SQL editor

-- Products
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  price        numeric(10,2) not null,
  image_url    text,
  category     text not null check (category in ('frames','sunglasses','contacts','accessories')),
  brand        text,
  in_stock     boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Appointments
create table if not exists appointments (
  id               uuid primary key default gen_random_uuid(),
  patient_name     text not null,
  email            text not null,
  phone            text,
  appointment_type text not null check (appointment_type in ('eye_exam','contact_fitting','frame_consultation')),
  preferred_date   date not null,
  preferred_time   text not null,
  notes            text,
  status           text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at       timestamptz not null default now()
);

-- Contact form submissions
create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- Row-level security (enable, then add policies as needed)
alter table products           enable row level security;
alter table appointments       enable row level security;
alter table contact_submissions enable row level security;

-- Public read access for products
create policy "products_public_read" on products
  for select using (true);

-- Anyone can insert appointments / contact submissions (anon key)
create policy "appointments_public_insert" on appointments
  for insert with check (true);

create policy "contact_public_insert" on contact_submissions
  for insert with check (true);

-- === Run migrations/20260427120000_admin_visits_rls.sql on your project, or paste below ===

create table if not exists admin_allowlist (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table admin_allowlist enable row level security;
create policy "admin_self_read" on admin_allowlist
  for select to authenticated using (auth.uid() = user_id);

create table if not exists page_visits (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  referrer text,
  user_agent text,
  visitor_key text,
  created_at timestamptz not null default now()
);
alter table page_visits enable row level security;
create policy "page_visits_anon_insert" on page_visits
  for insert to anon, authenticated with check (true);
create policy "page_visits_admin_select" on page_visits
  for select to authenticated using (
    exists (select 1 from admin_allowlist a where a.user_id = auth.uid())
  );

alter table contact_submissions add column if not exists source text not null default 'contact';
create policy "contact_submissions_admin_select" on contact_submissions
  for select to authenticated using (
    exists (select 1 from admin_allowlist a where a.user_id = auth.uid())
  );
create policy "appointments_admin_select" on appointments
  for select to authenticated using (
    exists (select 1 from admin_allowlist a where a.user_id = auth.uid())
  );
grant select on admin_allowlist to authenticated;
grant select, insert on page_visits to anon, authenticated;
