-- =====================================================================
-- Safar Gold — Migration Master File
-- Jalankan di Supabase SQL Editor. Semua query idempotent — aman
-- dijalankan ulang kapan saja (CREATE IF NOT EXISTS, ON CONFLICT, etc).
-- =====================================================================

-- #####################################################################
-- v1: Core Schema — gold_types, price_history, app_settings, RLS, Seed
-- #####################################################################

-- gold_types: jenis emas yang dijual / dibeli
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

-- price_history: histori harga harian
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

-- app_settings: konfigurasi key-value
create table if not exists public.app_settings (
  key   text primary key,
  value text not null
);

-- RLS v1
alter table public.gold_types    enable row level security;
alter table public.price_history enable row level security;
alter table public.app_settings  enable row level security;

drop policy if exists "public read gold_types" on public.gold_types;
drop policy if exists "public read price_history" on public.price_history;
drop policy if exists "public read app_settings" on public.app_settings;

create policy "public read gold_types" on public.gold_types for select using (true);
create policy "public read price_history" on public.price_history for select using (true);
create policy "public read app_settings" on public.app_settings for select using (true);

-- ====== v1 Seed ======
delete from public.price_history;
delete from public.gold_types;

-- Logam Mulia Jual (9)
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

-- Buyback Logam Mulia (7)
insert into public.gold_types (id, name, karat, category, margin_buy, margin_sell) values
  ('bb-certi-1-2',    'ANTAM Certi 1-2gr',     24, 'bb-lm', 2.0, 3.0),
  ('bb-certi-3-5',    'ANTAM Certi 3-5gr',     24, 'bb-lm', 2.0, 3.0),
  ('bb-certi-10-25',  'ANTAM Certi 10-25gr',   24, 'bb-lm', 2.0, 3.0),
  ('bb-certi-50-100', 'ANTAM Certi 50-100gr',  24, 'bb-lm', 2.0, 3.0),
  ('bb-non-rm',       'ANTAM Non RM',           24, 'bb-lm', 3.0, 4.0),
  ('bb-retro',        'ANTAM Retro',            24, 'bb-lm', 3.0, 4.0),
  ('bb-merek-lain',   'Merek Lain',             24, 'bb-lm', 4.0, 5.0);

-- Buyback Perhiasan (20 — K24* s/d K6)
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

-- Logam Lain (2)
insert into public.gold_types (id, name, category, margin_buy, margin_sell) values
  ('ll-palladium', 'Palladium', 'bb-logam', 10.0, 10.0),
  ('ll-perak',     'Perak',     'bb-logam', 10.0, 10.0);

-- Settings
insert into public.app_settings (key, value) values
  ('api_key',                    ''),
  ('usd_idr_rate',               '16300'),
  ('last_price_update',          ''),
  ('harga_dasar_jual',           '0'),
  ('acuan_buyback_lm',           '0'),
  ('premi_pecahan',              '{"0.5":400000,"1":225000,"2":190000,"3":173333,"5":95000,"10":65000,"25":15000,"50":0,"100":0}'),
  ('spread_buyback_lm',          '{"bb-certi-1-2":0,"bb-certi-3-5":-50000,"bb-certi-10-25":-100000,"bb-certi-50-100":-150000,"bb-non-rm":-200000,"bb-retro":-250000,"bb-merek-lain":-300000}'),
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

-- #####################################################################
-- v2: gold_types — tambah kolom weight, karat jadi nullable
-- #####################################################################

do $$
begin
  if not exists (select 1 from information_schema.columns
    where table_name = 'gold_types' and column_name = 'weight') then
    alter table public.gold_types add column weight numeric;
  end if;
end $$;

alter table public.gold_types alter column karat drop not null;

-- #####################################################################
-- v3: Order & Stock Management
-- #####################################################################

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique,
  type           text not null check (type in ('sell', 'buyback')),
  customer_name  text not null,
  customer_phone text not null,
  subtotal       integer not null default 0,
  total          integer not null default 0,
  notes          text,
  status         text not null default 'completed' check (status in ('completed', 'cancelled')),
  created_by     uuid not null,
  created_at     timestamptz not null default now()
);

create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  gold_type_id   text references public.gold_types(id),
  item_name      text not null,
  weight         numeric not null default 0,
  karat          integer,
  qty            integer not null default 1,
  price_per_gram integer not null default 0,
  price_total    integer not null default 0
);

create table if not exists public.stock (
  gold_type_id   text primary key references public.gold_types(id),
  qty            integer not null default 0,
  min_qty        integer not null default 1,
  updated_at     timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id             uuid primary key default gen_random_uuid(),
  gold_type_id   text not null references public.gold_types(id),
  order_id       uuid references public.orders(id) on delete set null,
  type           text not null check (type in ('in', 'out')),
  qty            integer not null,
  notes          text,
  created_at     timestamptz not null default now()
);

-- RLS v3
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.stock             enable row level security;
alter table public.stock_movements   enable row level security;

drop policy if exists "public read orders"            on public.orders;
drop policy if exists "public read order_items"       on public.order_items;
drop policy if exists "public read stock"             on public.stock;
drop policy if exists "public read stock_movements"   on public.stock_movements;

create policy "public read orders"            on public.orders            for select using (true);
create policy "public read order_items"       on public.order_items       for select using (true);
create policy "public read stock"             on public.stock             for select using (true);
create policy "public read stock_movements"   on public.stock_movements   for select using (true);

-- Seed initial stock
insert into public.stock (gold_type_id, qty, min_qty)
select id, 0, 1 from public.gold_types where category = 'lm'
on conflict (gold_type_id) do nothing;

-- #####################################################################
-- v4: Invoice — nomor & tipe invoice di orders
-- #####################################################################

alter table public.orders add column if not exists invoice_number text;
alter table public.orders add column if not exists invoice_type   text;
alter table public.orders add constraint chk_invoice_type check (invoice_type in ('jual', 'buyback'));

-- #####################################################################
-- v5: Data Customer — source, NIK, alamat bertingkat, Instagram
-- #####################################################################

alter table public.orders add column if not exists source      text;
alter table public.orders add column if not exists nik         text;
alter table public.orders add column if not exists address     text;
alter table public.orders add column if not exists kelurahan   text;
alter table public.orders add column if not exists kecamatan   text;
alter table public.orders add column if not exists kabupaten   text;
alter table public.orders add column if not exists provinsi    text;
alter table public.orders add column if not exists instagram   text;

-- #####################################################################
-- v6: Customers — master pelanggan untuk deteksi repeat order
-- #####################################################################

create table if not exists public.customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null unique,
  nik        text,
  source     text,
  address    text,
  kelurahan  text,
  kecamatan  text,
  kabupaten  text,
  provinsi   text,
  instagram  text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists customer_id uuid references public.customers(id) on delete set null;

alter table public.customers enable row level security;
drop policy if exists "public read customers" on public.customers;
create policy "public read customers" on public.customers for select using (true);

-- Backfill: dedup order lama by phone (normalisasi 62 -> 0), buat customer + link
insert into public.customers (name, phone, nik, source, address, kelurahan, kecamatan, kabupaten, provinsi, instagram)
select
  (array_agg(customer_name order by created_at desc))[1] as name,
  norm_phone as phone,
  (array_agg(nik order by created_at desc))[1] as nik,
  (array_agg(source order by created_at desc))[1] as source,
  (array_agg(address order by created_at desc))[1] as address,
  (array_agg(kelurahan order by created_at desc))[1] as kelurahan,
  (array_agg(kecamatan order by created_at desc))[1] as kecamatan,
  (array_agg(kabupaten order by created_at desc))[1] as kabupaten,
  (array_agg(provinsi order by created_at desc))[1] as provinsi,
  (array_agg(instagram order by created_at desc))[1] as instagram
from (
  select o.*,
    case
      when regexp_replace(o.customer_phone, '[^0-9]', '', 'g') ~ '^62'
        then '0' || substring(regexp_replace(o.customer_phone, '[^0-9]', '', 'g') from 3)
      else regexp_replace(o.customer_phone, '[^0-9]', '', 'g')
    end as norm_phone
  from public.orders o
  where o.customer_phone is not null and o.customer_phone <> ''
) t
group by norm_phone
on conflict (phone) do nothing;

update public.orders o
set customer_id = c.id
from public.customers c
where c.phone = (
  case
    when regexp_replace(o.customer_phone, '[^0-9]', '', 'g') ~ '^62'
      then '0' || substring(regexp_replace(o.customer_phone, '[^0-9]', '', 'g') from 3)
    else regexp_replace(o.customer_phone, '[^0-9]', '', 'g')
  end
);

-- #####################################################################
-- v7: Formula Buyback Baru — selisih RM seragam -50k
-- #####################################################################
-- 1. Spread buyback LM: tiap tier turun 50.000 berurutan
update public.app_settings
set value = '{"bb-certi-1-2":0,"bb-certi-3-5":-50000,"bb-certi-10-25":-100000,"bb-certi-50-100":-150000,"bb-non-rm":-200000,"bb-retro":-250000,"bb-merek-lain":-300000}'
where key = 'spread_buyback_lm';

-- 2. Offset perhiasan K24*/K24 tidak lagi dipakai (formula baru pakai Merek Lain − 100.000 / − 175.000).
--    Kolom setting offset_perhiasan_k24s & offset_perhiasan_k24 dibiarkan, hanya tidak dibaca.
