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
