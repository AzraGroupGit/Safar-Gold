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
  ('persen_buyback_perhiasan',   '81'),
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
  gold_type_id   text not null references public.gold_types(id),
  brand          text not null default 'Antam',
  qty            integer not null default 0,
  min_qty        integer not null default 1,
  updated_at     timestamptz not null default now(),
  primary key (gold_type_id, brand)
);

create table if not exists public.stock_movements (
  id             uuid primary key default gen_random_uuid(),
  gold_type_id   text not null references public.gold_types(id),
  brand          text not null default 'Antam',
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
insert into public.stock (gold_type_id, brand, qty, min_qty)
select id, 'Antam', 0, 1 from public.gold_types where category = 'lm'
on conflict (gold_type_id, brand) do nothing;

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

-- #####################################################################
-- v8: Persen Buyback Perhiasan (K6–K22) — margin yang bisa di-adjust
-- #####################################################################
-- Formula baru K6–K22: CEILING((karat/24) × acuan_buyback_lm × persen%, 1000)
insert into public.app_settings (key, value)
values ('persen_buyback_perhiasan', '81')
on conflict (key) do nothing;

-- #####################################################################
-- v9: EOD (End of Day) Report — snapshot penutupan kas harian
-- #####################################################################

create table if not exists public.eod_reports (
  id                    bigint generated always as identity primary key,
  date                  text not null unique,
  total_orders          integer not null default 0,
  total_jual_orders     integer not null default 0,
  total_buyback_orders  integer not null default 0,
  total_jual            integer not null default 0,
  total_buyback         integer not null default 0,
  total_jual_items      integer not null default 0,
  total_buyback_items   integer not null default 0,
  net                   integer not null default 0,
  breakdown             jsonb not null default '{}',
  stock_snapshot        jsonb not null default '[]',
  generated_by          uuid,
  generated_at          timestamptz not null default now()
);

alter table public.eod_reports enable row level security;

-- #####################################################################
-- v10: Region IDs — simpan id wilayah (provinsi/kab/kec/kel) untuk restore dropdown saat edit
-- #####################################################################

alter table public.orders    add column if not exists province_id text;
alter table public.orders    add column if not exists regency_id  text;
alter table public.orders    add column if not exists district_id text;
alter table public.orders    add column if not exists village_id  text;

alter table public.customers add column if not exists province_id text;
alter table public.customers add column if not exists regency_id  text;
alter table public.customers add column if not exists district_id text;
alter table public.customers add column if not exists village_id  text;

-- #####################################################################
-- v11: Metode Pembayaran — cash / transfer di orders
-- #####################################################################

alter table public.orders add column if not exists payment_method text;

-- #####################################################################
-- v12: Merek (brand) di order_items — untuk penjualan non-Antam & perak
-- #####################################################################

alter table public.order_items add column if not exists brand text;

-- #####################################################################
-- v13: Profil user (TTD + nama) & GP (gross profit) di orders
-- #####################################################################

create table if not exists public.user_profiles (
  user_id    uuid primary key,
  name       text,
  signature  text,
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

alter table public.orders add column if not exists gp integer;

-- #####################################################################
-- v14: Brand on Stock & Stock Movements
-- #####################################################################

alter table public.stock add column if not exists brand text;
alter table public.stock_movements add column if not exists brand text;

-- Backfill: existing LM stock defaults to 'Antam'
update public.stock set brand = 'Antam' where brand is null and gold_type_id like 'antam-%';

-- Unique index to prevent duplicate (gold_type_id, brand) combinations
create unique index if not exists uq_stock_type_brand on public.stock(gold_type_id, brand);

-- Index for brand filtering
create index if not exists idx_stock_brand on public.stock(brand);
create index if not exists idx_stock_movements_brand on public.stock_movements(brand);

-- #####################################################################
-- v15: Atomic order lifecycle, brand-aware stock, and EOD invalidation
-- #####################################################################

update public.stock set brand = 'Antam' where brand is null or btrim(brand) = '';
alter table public.stock alter column brand set default 'Antam';
alter table public.stock alter column brand set not null;
alter table public.stock drop constraint if exists stock_pkey;
drop index if exists public.uq_stock_type_brand;
alter table public.stock add primary key (gold_type_id, brand);

alter table public.stock_movements add column if not exists reversed_at timestamptz;
alter table public.stock_movements add column if not exists reversal_of uuid references public.stock_movements(id);
update public.stock_movements set brand = 'Antam' where brand is null or btrim(brand) = '';
alter table public.stock_movements alter column brand set default 'Antam';
alter table public.stock_movements alter column brand set not null;
alter table public.eod_reports add column if not exists is_stale boolean not null default false;
alter table public.eod_reports add column if not exists stale_at timestamptz;

create or replace function public.apply_stock_delta(
  p_gold_type_id text,
  p_brand text,
  p_delta integer,
  p_order_id uuid,
  p_notes text,
  p_reversal_of uuid default null
) returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_brand text := coalesce(nullif(btrim(p_brand), ''), 'Antam');
  v_current integer;
  v_movement_id uuid;
begin
  if p_delta = 0 then raise exception 'Stock delta cannot be zero'; end if;

  insert into public.stock (gold_type_id, brand, qty)
  values (p_gold_type_id, v_brand, 0)
  on conflict (gold_type_id, brand) do nothing;

  select qty into v_current from public.stock
  where gold_type_id = p_gold_type_id and brand = v_brand
  for update;

  if v_current + p_delta < 0 then
    raise exception 'Insufficient stock for % / %', p_gold_type_id, v_brand;
  end if;

  update public.stock set qty = v_current + p_delta, updated_at = now()
  where gold_type_id = p_gold_type_id and brand = v_brand;

  insert into public.stock_movements
    (gold_type_id, brand, order_id, type, qty, notes, reversal_of)
  values
    (p_gold_type_id, v_brand, p_order_id,
     case when p_delta > 0 then 'in' else 'out' end,
     abs(p_delta), p_notes, p_reversal_of)
  returning id into v_movement_id;
  return v_movement_id;
end;
$$;

create or replace function public.mark_order_eod_stale(p_created_at timestamptz)
returns void language sql security definer set search_path = public
as $$
  update public.eod_reports
  set is_stale = true, stale_at = now()
  where date = ((p_created_at at time zone 'Asia/Jakarta')::date)::text;
$$;

create or replace function public.create_order_atomic(p_payload jsonb, p_actor uuid)
returns jsonb language plpgsql security definer set search_path = public
as $$
declare
  v_order_id uuid;
  v_customer_id uuid;
  v_order_number text;
  v_invoice_number text;
  v_today text := (now() at time zone 'Asia/Jakarta')::date::text;
  v_item jsonb;
  v_brand text;
  v_total bigint := 0;
begin
  if p_actor is null then raise exception 'Authenticated actor required'; end if;
  if p_payload->>'type' not in ('sell', 'buyback') then raise exception 'Invalid order type'; end if;
  if jsonb_array_length(coalesce(p_payload->'items', '[]'::jsonb)) = 0 then raise exception 'Order items required'; end if;

  for v_item in select value from jsonb_array_elements(p_payload->'items') loop
    v_total := v_total + (v_item->>'priceTotal')::bigint;
  end loop;

  insert into public.customers (name, phone, nik, source, address, kelurahan, kecamatan, kabupaten, provinsi, instagram, province_id, regency_id, district_id, village_id, updated_at)
  values (p_payload->>'customerName', p_payload->>'customerPhone', p_payload->>'nik', p_payload->>'source', p_payload->>'address', p_payload->>'kelurahan', p_payload->>'kecamatan', p_payload->>'kabupaten', p_payload->>'provinsi', p_payload->>'instagram', p_payload->>'provinceId', p_payload->>'regencyId', p_payload->>'districtId', p_payload->>'villageId', now())
  on conflict (phone) do update set name=excluded.name, nik=excluded.nik, source=excluded.source, address=excluded.address, kelurahan=excluded.kelurahan, kecamatan=excluded.kecamatan, kabupaten=excluded.kabupaten, provinsi=excluded.provinsi, instagram=excluded.instagram, province_id=excluded.province_id, regency_id=excluded.regency_id, district_id=excluded.district_id, village_id=excluded.village_id, updated_at=now()
  returning id into v_customer_id;

  perform pg_advisory_xact_lock(hashtext('safar-order-' || v_today));
  select 'SG-' || replace(v_today, '-', '') || '-' || lpad((count(*) + 1)::text, 3, '0') into v_order_number
  from public.orders where order_number like 'SG-' || replace(v_today, '-', '') || '-%';
  select (case when p_payload->>'type'='sell' then 'J' else 'BB' end) || '-' || replace(v_today, '-', '') || '-' || lpad((count(*) + 1)::text, 3, '0') into v_invoice_number
  from public.orders where invoice_number like (case when p_payload->>'type'='sell' then 'J' else 'BB' end) || '-' || replace(v_today, '-', '') || '-%';

  insert into public.orders (order_number, invoice_number, invoice_type, type, customer_id, customer_name, customer_phone, subtotal, total, notes, source, nik, address, kelurahan, kecamatan, kabupaten, provinsi, instagram, province_id, regency_id, district_id, village_id, payment_method, gp, created_by)
  values (v_order_number, v_invoice_number, case when p_payload->>'type'='sell' then 'jual' else 'buyback' end, p_payload->>'type', v_customer_id, p_payload->>'customerName', p_payload->>'customerPhone', v_total, v_total, p_payload->>'notes', p_payload->>'source', p_payload->>'nik', p_payload->>'address', p_payload->>'kelurahan', p_payload->>'kecamatan', p_payload->>'kabupaten', p_payload->>'provinsi', p_payload->>'instagram', p_payload->>'provinceId', p_payload->>'regencyId', p_payload->>'districtId', p_payload->>'villageId', coalesce(p_payload->>'paymentMethod','cash'), nullif(p_payload->>'gp','')::integer, p_actor)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_payload->'items') loop
    v_brand := coalesce(nullif(btrim(v_item->>'brand'), ''), 'Antam');
    insert into public.order_items (order_id, gold_type_id, item_name, weight, karat, qty, price_per_gram, price_total, brand)
    values (v_order_id, nullif(v_item->>'goldTypeId',''), v_item->>'itemName', (v_item->>'weight')::numeric, nullif(v_item->>'karat','')::integer, (v_item->>'qty')::integer, (v_item->>'pricePerGram')::integer, (v_item->>'priceTotal')::integer, nullif(v_brand,''));
    if nullif(v_item->>'goldTypeId','') is not null then
      perform public.apply_stock_delta(v_item->>'goldTypeId', v_brand, case when p_payload->>'type'='sell' then -(v_item->>'qty')::integer else (v_item->>'qty')::integer end, v_order_id, 'Order ' || v_order_number, null);
    end if;
  end loop;

  perform public.mark_order_eod_stale(now());
  return (select to_jsonb(o) || jsonb_build_object('order_items', coalesce((select jsonb_agg(oi) from public.order_items oi where oi.order_id=o.id),'[]'::jsonb)) from public.orders o where o.id=v_order_id);
end;
$$;

create or replace function public.reverse_active_order_movements(p_order_id uuid, p_reason text)
returns void language plpgsql security definer set search_path = public
as $$
declare v_movement public.stock_movements%rowtype;
begin
  for v_movement in
    select * from public.stock_movements
    where order_id = p_order_id and reversal_of is null and reversed_at is null
    order by created_at, id for update
  loop
    perform public.apply_stock_delta(
      v_movement.gold_type_id, v_movement.brand,
      case when v_movement.type = 'in' then -v_movement.qty else v_movement.qty end,
      p_order_id, p_reason, v_movement.id
    );
    update public.stock_movements set reversed_at = now() where id = v_movement.id;
  end loop;
end;
$$;

create or replace function public.update_order_atomic(p_order_id uuid, p_payload jsonb, p_actor uuid)
returns jsonb language plpgsql security definer set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_customer_id uuid;
  v_item jsonb;
  v_brand text;
  v_total bigint := 0;
begin
  if p_actor is null then raise exception 'Authenticated actor required'; end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.status = 'cancelled' then raise exception 'Cancelled order cannot be edited'; end if;

  perform public.reverse_active_order_movements(p_order_id, 'Reversal before order edit');
  for v_item in select value from jsonb_array_elements(p_payload->'items') loop
    v_total := v_total + (v_item->>'priceTotal')::bigint;
  end loop;

  insert into public.customers (name, phone, nik, source, address, kelurahan, kecamatan, kabupaten, provinsi, instagram, province_id, regency_id, district_id, village_id, updated_at)
  values (p_payload->>'customerName', p_payload->>'customerPhone', p_payload->>'nik', p_payload->>'source', p_payload->>'address', p_payload->>'kelurahan', p_payload->>'kecamatan', p_payload->>'kabupaten', p_payload->>'provinsi', p_payload->>'instagram', p_payload->>'provinceId', p_payload->>'regencyId', p_payload->>'districtId', p_payload->>'villageId', now())
  on conflict (phone) do update set name=excluded.name, nik=excluded.nik, source=excluded.source, address=excluded.address, kelurahan=excluded.kelurahan, kecamatan=excluded.kecamatan, kabupaten=excluded.kabupaten, provinsi=excluded.provinsi, instagram=excluded.instagram, province_id=excluded.province_id, regency_id=excluded.regency_id, district_id=excluded.district_id, village_id=excluded.village_id, updated_at=now()
  returning id into v_customer_id;

  update public.orders set type=p_payload->>'type', customer_id=v_customer_id,
    customer_name=p_payload->>'customerName', customer_phone=p_payload->>'customerPhone',
    subtotal=v_total, total=v_total, notes=p_payload->>'notes', source=p_payload->>'source',
    nik=p_payload->>'nik', address=p_payload->>'address', kelurahan=p_payload->>'kelurahan',
    kecamatan=p_payload->>'kecamatan', kabupaten=p_payload->>'kabupaten', provinsi=p_payload->>'provinsi',
    instagram=p_payload->>'instagram', province_id=p_payload->>'provinceId', regency_id=p_payload->>'regencyId',
    district_id=p_payload->>'districtId', village_id=p_payload->>'villageId',
    payment_method=coalesce(p_payload->>'paymentMethod','cash'), gp=nullif(p_payload->>'gp','')::integer
  where id=p_order_id;

  delete from public.order_items where order_id=p_order_id;
  for v_item in select value from jsonb_array_elements(p_payload->'items') loop
    v_brand := coalesce(nullif(btrim(v_item->>'brand'), ''), 'Antam');
    insert into public.order_items (order_id, gold_type_id, item_name, weight, karat, qty, price_per_gram, price_total, brand)
    values (p_order_id, nullif(v_item->>'goldTypeId',''), v_item->>'itemName', (v_item->>'weight')::numeric, nullif(v_item->>'karat','')::integer, (v_item->>'qty')::integer, (v_item->>'pricePerGram')::integer, (v_item->>'priceTotal')::integer, nullif(v_brand,''));
    if nullif(v_item->>'goldTypeId','') is not null then
      perform public.apply_stock_delta(v_item->>'goldTypeId', v_brand, case when p_payload->>'type'='sell' then -(v_item->>'qty')::integer else (v_item->>'qty')::integer end, p_order_id, 'Order ' || v_order.order_number || ' edited', null);
    end if;
  end loop;
  perform public.mark_order_eod_stale(v_order.created_at);
  return (select to_jsonb(o) || jsonb_build_object('order_items', coalesce((select jsonb_agg(oi) from public.order_items oi where oi.order_id=o.id),'[]'::jsonb)) from public.orders o where o.id=p_order_id);
end;
$$;

create or replace function public.cancel_order_atomic(p_order_id uuid, p_actor uuid)
returns jsonb language plpgsql security definer set search_path = public
as $$
declare v_order public.orders%rowtype;
begin
  if p_actor is null then raise exception 'Authenticated actor required'; end if;
  select * into v_order from public.orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.status = 'cancelled' then return jsonb_build_object('id', p_order_id, 'status', 'cancelled'); end if;
  perform public.reverse_active_order_movements(p_order_id, 'Order ' || v_order.order_number || ' cancelled');
  update public.orders set status='cancelled' where id=p_order_id;
  perform public.mark_order_eod_stale(v_order.created_at);
  return jsonb_build_object('id', p_order_id, 'status', 'cancelled');
end;
$$;

revoke all on function public.apply_stock_delta(text, text, integer, uuid, text, uuid) from public, anon, authenticated;
revoke all on function public.mark_order_eod_stale(timestamptz) from public, anon, authenticated;
revoke all on function public.reverse_active_order_movements(uuid, text) from public, anon, authenticated;
revoke all on function public.create_order_atomic(jsonb, uuid) from public, anon, authenticated;
revoke all on function public.update_order_atomic(uuid, jsonb, uuid) from public, anon, authenticated;
revoke all on function public.cancel_order_atomic(uuid, uuid) from public, anon, authenticated;
grant execute on function public.create_order_atomic(jsonb, uuid) to service_role;
grant execute on function public.update_order_atomic(uuid, jsonb, uuid) to service_role;
grant execute on function public.cancel_order_atomic(uuid, uuid) to service_role;

-- #####################################################################
-- v16: Auditable manual stock adjustment and correction
-- #####################################################################

alter table public.stock_movements add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.stock_movements add column if not exists correction_of uuid references public.stock_movements(id);
create index if not exists idx_stock_movements_created_by on public.stock_movements(created_by);
create index if not exists idx_stock_movements_correction_of on public.stock_movements(correction_of);

create or replace function public.adjust_stock_atomic(
  p_gold_type_id text,
  p_brand text,
  p_type text,
  p_qty integer,
  p_notes text,
  p_actor uuid
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_movement_id uuid;
  v_brand text := coalesce(nullif(btrim(p_brand), ''), 'Antam');
  v_delta integer;
  v_qty integer;
begin
  if p_actor is null then raise exception 'Authenticated actor required'; end if;
  if p_type not in ('in', 'out') then raise exception 'Invalid stock movement type'; end if;
  if p_qty is null or p_qty <= 0 then raise exception 'Quantity must be greater than zero'; end if;
  v_delta := case when p_type = 'in' then p_qty else -p_qty end;

  v_movement_id := public.apply_stock_delta(
    p_gold_type_id, v_brand, v_delta, null,
    coalesce(nullif(btrim(p_notes), ''), 'Manual — ' || case when p_type = 'in' then 'Masuk' else 'Keluar' end),
    null
  );
  update public.stock_movements set created_by = p_actor where id = v_movement_id;
  select qty into v_qty from public.stock where gold_type_id = p_gold_type_id and brand = v_brand;
  return jsonb_build_object('movement_id', v_movement_id, 'new_qty', v_qty);
end;
$$;

create or replace function public.correct_manual_stock_movement_atomic(
  p_movement_id uuid,
  p_corrected_qty integer,
  p_reason text,
  p_actor uuid
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_original public.stock_movements%rowtype;
  v_brand text;
  v_current integer;
  v_final integer;
  v_original_sign integer;
  v_reversal_id uuid;
  v_replacement_id uuid;
begin
  if p_actor is null then raise exception 'Authenticated actor required'; end if;
  if p_corrected_qty is null or p_corrected_qty <= 0 then raise exception 'Corrected quantity must be greater than zero'; end if;
  if nullif(btrim(p_reason), '') is null then raise exception 'Correction reason is required'; end if;

  select * into v_original from public.stock_movements where id = p_movement_id for update;
  if not found then raise exception 'Stock movement not found'; end if;
  if v_original.order_id is not null then raise exception 'Order movement must be corrected from the order'; end if;
  if v_original.reversal_of is not null or v_original.reversed_at is not null then
    raise exception 'Stock movement is not active';
  end if;
  if v_original.qty = p_corrected_qty then raise exception 'Corrected quantity must differ from original quantity'; end if;

  v_brand := coalesce(nullif(btrim(v_original.brand), ''), 'Antam');
  insert into public.stock (gold_type_id, brand, qty)
  values (v_original.gold_type_id, v_brand, 0)
  on conflict (gold_type_id, brand) do nothing;
  select qty into v_current from public.stock
  where gold_type_id = v_original.gold_type_id and brand = v_brand for update;

  v_original_sign := case when v_original.type = 'in' then 1 else -1 end;
  v_final := v_current + (p_corrected_qty - v_original.qty) * v_original_sign;
  if v_final < 0 then raise exception 'Insufficient stock for correction'; end if;

  update public.stock set qty = v_final, updated_at = now()
  where gold_type_id = v_original.gold_type_id and brand = v_brand;

  insert into public.stock_movements
    (gold_type_id, brand, type, qty, notes, reversal_of, created_by)
  values
    (v_original.gold_type_id, v_brand,
     case when v_original.type = 'in' then 'out' else 'in' end,
     v_original.qty, 'Pembalik koreksi: ' || btrim(p_reason), v_original.id, p_actor)
  returning id into v_reversal_id;

  insert into public.stock_movements
    (gold_type_id, brand, type, qty, notes, correction_of, created_by)
  values
    (v_original.gold_type_id, v_brand, v_original.type, p_corrected_qty,
     'Pengganti koreksi: ' || btrim(p_reason), v_original.id, p_actor)
  returning id into v_replacement_id;

  update public.stock_movements set reversed_at = now() where id = v_original.id;
  return jsonb_build_object(
    'original_id', v_original.id,
    'reversal_id', v_reversal_id,
    'replacement_id', v_replacement_id,
    'new_qty', v_final
  );
end;
$$;

revoke all on function public.adjust_stock_atomic(text, text, text, integer, text, uuid) from public, anon, authenticated;
revoke all on function public.correct_manual_stock_movement_atomic(uuid, integer, text, uuid) from public, anon, authenticated;
grant execute on function public.adjust_stock_atomic(text, text, text, integer, text, uuid) to service_role;
grant execute on function public.correct_manual_stock_movement_atomic(uuid, integer, text, uuid) to service_role;

-- #####################################################################
-- v17: Protect operational and customer data from anonymous access
-- #####################################################################

-- Operational reads must go through authenticated, role-checked server
-- handlers. The service role used by those handlers bypasses RLS.
drop policy if exists "public read orders" on public.orders;
drop policy if exists "public read order_items" on public.order_items;
drop policy if exists "public read customers" on public.customers;
drop policy if exists "public read stock_movements" on public.stock_movements;
drop policy if exists "public read app_settings" on public.app_settings;
drop policy if exists "public read safe app_settings" on public.app_settings;

-- Keep RLS enabled even when this section is applied to an older database.
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.customers enable row level security;
alter table public.stock_movements enable row level security;
alter table public.app_settings enable row level security;

-- Only values rendered by the public website or used for public price
-- calculations may be read with the publishable key. In particular, api_key
-- and any future setting stay private unless explicitly added here.
create policy "public read safe app_settings"
on public.app_settings for select
using (key = any (array[
  'usd_idr_rate', 'last_price_update',
  'harga_dasar_jual', 'acuan_buyback_lm', 'premi_pecahan', 'spread_buyback_lm',
  'offset_perhiasan_k24s', 'offset_perhiasan_k24', 'dasar_perhiasan_offset',
  'adjustment_jual', 'adjustment_beli', 'adjustment_perhiasan', 'persen_buyback_perhiasan',
  'last_cron_xau_usd', 'last_cron_xag_usd', 'last_cron_xpd_usd',
  'antam_price', 'antam_price_prev', 'global_gold_price', 'global_gold_price_prev',
  'phone', 'email', 'address', 'weekday_open', 'weekday_close', 'saturday_open', 'saturday_close',
  'hero_badge', 'hero_headline_start', 'hero_headline_gradient', 'hero_headline_end',
  'hero_subheadline', 'hero_cta', 'google_reviews_widget_id'
]::text[]));
