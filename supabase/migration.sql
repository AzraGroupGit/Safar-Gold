-- ============================================================
-- Safar Gold — Skema Database Supabase (PostgreSQL)
-- ============================================================

-- ---------- Tabel: gold_types ----------
create table if not exists public.gold_types (
  id          text primary key,
  name        text not null,
  karat       integer not null,
  category    text not null,
  margin_buy  real not null default 3.0,
  margin_sell real not null default 2.0,
  is_auto     boolean not null default true,
  manual_buy  integer,
  manual_sell integer
);

-- ---------- Tabel: price_history ----------
create table if not exists public.price_history (
  id           bigint generated always as identity primary key,
  date         text not null,
  gold_type_id text not null references public.gold_types(id),
  base_price   integer not null,
  buy_price    integer not null,
  sell_price   integer not null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_price_date on public.price_history(date);
create index if not exists idx_price_type_date on public.price_history(gold_type_id, date);

-- Cegah duplikat harga untuk kombinasi tanggal + jenis emas (dipakai upsert)
create unique index if not exists uq_price_date_type
  on public.price_history(date, gold_type_id);

-- ---------- Tabel: app_settings ----------
create table if not exists public.app_settings (
  key   text primary key,
  value text not null
);

-- ============================================================
-- Row Level Security (RLS)
-- Data harga & pengaturan boleh DIBACA publik (untuk website),
-- tapi hanya boleh DITULIS oleh service role (server/admin).
-- ============================================================

alter table public.gold_types    enable row level security;
alter table public.price_history enable row level security;
alter table public.app_settings  enable row level security;

-- Baca publik
create policy "public read gold_types"
  on public.gold_types for select using (true);
create policy "public read price_history"
  on public.price_history for select using (true);
create policy "public read app_settings"
  on public.app_settings for select using (true);

-- Catatan: operasi tulis (insert/update) dilakukan lewat service_role key
-- di server, yang otomatis melewati RLS. Tidak perlu policy write untuk anon.

-- ============================================================
-- Seed Data Awal
-- ============================================================

insert into public.gold_types (id, name, karat, category, margin_buy, margin_sell) values
  ('antam-100',     'Antam 100gr',   24, 'antam',     3.0, 2.0),
  ('antam-50',      'Antam 50gr',    24, 'antam',     3.0, 2.0),
  ('antam-25',      'Antam 25gr',    24, 'antam',     3.5, 2.5),
  ('ubs-100',       'UBS 100gr',     24, 'ubs',       3.0, 2.0),
  ('ubs-50',        'UBS 50gr',      24, 'ubs',       3.5, 2.5),
  ('perhiasan-24k', 'Perhiasan 24K', 24, 'perhiasan', 5.0, 3.0),
  ('perhiasan-22k', 'Perhiasan 22K', 22, 'perhiasan', 5.0, 3.0),
  ('perhiasan-18k', 'Perhiasan 18K', 18, 'perhiasan', 5.0, 3.0)
on conflict (id) do nothing;

insert into public.app_settings (key, value) values
  ('api_key',           ''),
  ('usd_idr_rate',      '16300'),
  ('last_price_update', ''),
  ('phone',             '+62 812-3456-7890'),
  ('email',             'info@safargold.com'),
  ('address',           'Jl. Emas No. 1, Jakarta'),
  ('weekday_open',      '09:00'),
  ('weekday_close',     '17:00'),
  ('saturday_open',     '09:00'),
  ('saturday_close',    '14:00')
on conflict (key) do nothing;
