-- ============================================================
-- Safar Gold — Skema Database Supabase (PostgreSQL) v2
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- Tambah kolom weight jika belum ada, dan longgarkan karat jadi nullable
do $$
begin
  if not exists (select 1 from information_schema.columns
    where table_name = 'gold_types' and column_name = 'weight') then
    alter table public.gold_types add column weight numeric;
  end if;
end $$;

alter table public.gold_types alter column karat drop not null;

-- ---------- Tabel: gold_types ----------
create table if not exists public.gold_types (
  id          text primary key,
  name        text not null,
  karat       integer,
  weight      numeric,
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
create unique index if not exists uq_price_date_type on public.price_history(date, gold_type_id);

-- ---------- Tabel: app_settings ----------
create table if not exists public.app_settings (
  key   text primary key,
  value text not null
);

-- ---------- RLS ----------
alter table public.gold_types    enable row level security;
alter table public.price_history enable row level security;
alter table public.app_settings  enable row level security;

drop policy if exists "public read gold_types" on public.gold_types;
drop policy if exists "public read price_history" on public.price_history;
drop policy if exists "public read app_settings" on public.app_settings;

create policy "public read gold_types" on public.gold_types for select using (true);
create policy "public read price_history" on public.price_history for select using (true);
create policy "public read app_settings" on public.app_settings for select using (true);

-- ============================================================
-- Seed Data — Hapus lama, isi baru
-- ============================================================
delete from public.price_history;
delete from public.gold_types;

-- ---- 1. Logam Mulia (Jual) — 9 item ----
insert into public.gold_types (id, name, karat, weight, category, margin_buy, margin_sell) values
  ('antam-0.5',  'Antam 0.5gr',  24, 0.5,  'lm', 3.0, 2.0),
  ('antam-1',    'Antam 1gr',    24, 1,    'lm', 3.0, 2.0),
  ('antam-2',    'Antam 2gr',    24, 2,    'lm', 3.0, 2.0),
  ('antam-3',    'Antam 3gr',    24, 3,    'lm', 3.0, 2.0),
  ('antam-5',    'Antam 5gr',    24, 5,    'lm', 3.0, 2.0),
  ('antam-10',   'Antam 10gr',   24, 10,   'lm', 3.0, 2.0),
  ('antam-25',   'Antam 25gr',   24, 25,   'lm', 3.0, 2.5),
  ('antam-50',   'Antam 50gr',   24, 50,   'lm', 3.0, 2.5),
  ('antam-100',  'Antam 100gr',  24, 100,  'lm', 3.0, 2.5);

-- ---- 2. Buyback Logam Mulia — 7 item ----
insert into public.gold_types (id, name, karat, category, margin_buy, margin_sell) values
  ('bb-certi-1-2',    'ANTAM Certi 1-2gr',     24, 'bb-lm', 2.0, 3.0),
  ('bb-certi-3-5',    'ANTAM Certi 3-5gr',     24, 'bb-lm', 2.0, 3.0),
  ('bb-certi-10-25',  'ANTAM Certi 10-25gr',   24, 'bb-lm', 2.0, 3.0),
  ('bb-certi-50-100', 'ANTAM Certi 50-100gr',  24, 'bb-lm', 2.0, 3.0),
  ('bb-non-rm',       'ANTAM Non RM',           24, 'bb-lm', 3.0, 4.0),
  ('bb-retro',        'ANTAM Retro',            24, 'bb-lm', 3.0, 4.0),
  ('bb-merek-lain',   'Merek Lain',             24, 'bb-lm', 4.0, 5.0);

-- ---- 3. Buyback Perhiasan — 20 item (K24* s/d K6) ----
insert into public.gold_types (id, name, karat, category, margin_buy, margin_sell) values
  ('ph-k24s', 'Perhiasan K24*', 24, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k24',  'Perhiasan K24',  24, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k23',  'Perhiasan K23',  23, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k22',  'Perhiasan K22',  22, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k21',  'Perhiasan K21',  21, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k20',  'Perhiasan K20',  20, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k19',  'Perhiasan K19',  19, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k18',  'Perhiasan K18',  18, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k17',  'Perhiasan K17',  17, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k16',  'Perhiasan K16',  16, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k15',  'Perhiasan K15',  15, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k14',  'Perhiasan K14',  14, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k13',  'Perhiasan K13',  13, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k12',  'Perhiasan K12',  12, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k11',  'Perhiasan K11',  11, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k10',  'Perhiasan K10',  10, 'bb-perhiasan', 3.0, 5.0),
  ('ph-k9',   'Perhiasan K9',   9,  'bb-perhiasan', 3.0, 5.0),
  ('ph-k8',   'Perhiasan K8',   8,  'bb-perhiasan', 3.0, 5.0),
  ('ph-k7',   'Perhiasan K7',   7,  'bb-perhiasan', 3.0, 5.0),
  ('ph-k6',   'Perhiasan K6',   6,  'bb-perhiasan', 3.0, 5.0);

-- ---- 4. Logam Lain (Buyback) — 2 item ----
insert into public.gold_types (id, name, category, margin_buy, margin_sell) values
  ('ll-palladium', 'Palladium', 'bb-logam', 10.0, 10.0),
  ('ll-perak',     'Perak',     'bb-logam', 10.0, 10.0);

-- ---- Settings ----
insert into public.app_settings (key, value) values
  ('api_key',                    ''),
  ('usd_idr_rate',               '16300'),
  ('last_price_update',          ''),
  ('harga_dasar_jual',           '0'),
  ('acuan_buyback_lm',           '0'),
  ('premi_pecahan',              '{"0.5":400000,"1":225000,"2":190000,"3":173333,"5":95000,"10":65000,"25":15000,"50":0,"100":0}'),
  ('spread_buyback_lm',          '{"bb-certi-1-2":0,"bb-certi-3-5":-40000,"bb-certi-10-25":-80000,"bb-certi-50-100":-120000,"bb-non-rm":-150000,"bb-retro":-175000,"bb-merek-lain":-225000}'),
  ('offset_perhiasan_k24s',      '320000'),
  ('offset_perhiasan_k24',       '50000'),
  ('dasar_perhiasan_offset',     '505000'),
  ('adjustment_jual',            '0'),
  ('adjustment_beli',            '0'),
  ('adjustment_perhiasan',       '0'),
  ('phone',                      '+62 812-3456-7890'),
  ('email',                      'info@safargold.com'),
  ('address',                    'Jl. Emas No. 1, Jakarta'),
  ('weekday_open',               '09:00'),
  ('weekday_close',              '17:00'),
  ('saturday_open',              '09:00'),
  ('saturday_close',             '14:00')
on conflict (key) do nothing;
