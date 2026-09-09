# Migrasi v17 — Proteksi Data Operasional dan Pelanggan

Migrasi v17 menghapus akses baca anonim dari `orders`, `order_items`, `customers`, dan
`stock_movements`. Akses publik ke `gold_types` dan `price_history` tetap tersedia,
sedangkan `app_settings` dibatasi menggunakan allowlist eksplisit.

## Prasyarat

1. Pastikan backup Supabase terbaru tersedia dan prosedur restore pernah diverifikasi.
2. Jalankan perubahan terlebih dahulu pada staging atau salinan database.
3. Pastikan aplikasi yang akan dipasang sudah membaca data operasional melalui route
   server yang melakukan pemeriksaan sesi/role dan menggunakan service role setelah
   authorization berhasil.
4. Jangan menyalin publishable key, secret key, password akun uji, access token, atau
   cookie sesi ke log maupun repository.

## Eksekusi

Jalankan hanya blok mulai komentar berikut sampai akhir blok v17 pada SQL Editor
Supabase:

```sql
-- v17: Protect operational and customer data from anonymous access
```

Blok tersebut idempotent: policy lama dihapus dengan `drop policy if exists`, RLS
diaktifkan kembali, lalu policy allowlist `app_settings` dibuat ulang.

## Verifikasi database

Jalankan query berikut melalui SQL Editor sebagai administrator:

```sql
select schemaname, tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename in (
    'orders', 'order_items', 'customers', 'stock_movements',
    'app_settings', 'gold_types', 'price_history'
  )
order by tablename, policyname;

select relname, relrowsecurity
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('orders', 'order_items', 'customers', 'stock_movements', 'app_settings')
order by relname;
```

Hasil yang diharapkan:

- Tidak ada policy public-read pada empat tabel sensitif.
- RLS aktif pada empat tabel sensitif dan `app_settings`.
- `app_settings` hanya memiliki policy `public read safe app_settings` untuk akses publik.
- Policy public-read `gold_types` dan `price_history` tetap tersedia.

## Smoke test otomatis

Verifikasi akses anonim langsung ke Supabase:

```powershell
npm run smoke:v17:anon
```

Untuk memverifikasi route aplikasi, jalankan production server pada terminal pertama:

```powershell
npm run build
npm run start
```

Isi akun **khusus pengujian** pada `.env` lokal, jangan pada `.env.example`:

```dotenv
APP_BASE_URL=http://localhost:3000
SMOKE_ADMIN_EMAIL=
SMOKE_ADMIN_PASSWORD=
SMOKE_CS_EMAIL=
SMOKE_CS_PASSWORD=
```

Kemudian jalankan:

```powershell
npm run smoke:v17:roles
```

Harness harus membuktikan bahwa request tanpa sesi mendapat `401`, Admin dapat membaca
order/stok/EOD, CS hanya menerima order miliknya tanpa GP, CS tetap dapat membaca stok,
dan CS mendapat `403` untuk EOD serta analitik bisnis.

## Rollback dan forward-fix

**Pilihan utama adalah forward-fix.** Jangan mengembalikan policy `using (true)` pada
tabel sensitif karena tindakan tersebut membuka kembali PII dan transaksi kepada anon
key.

Jika aplikasi bermasalah setelah migrasi:

1. Pertahankan policy v17 agar data tetap tertutup.
2. Rollback artifact aplikasi ke versi terakhir yang seluruh pembacaan operasionalnya
   melewati route server terproteksi, atau perbaiki route yang gagal lalu deploy ulang.
3. Jika database harus dikembalikan, lakukan point-in-time restore/restore backup ke
   project terisolasi terlebih dahulu. Validasi data dan policy sebelum menjadikannya
   production.
4. Replikasi policy lama hanya sebagai tindakan darurat yang disetujui penanggung jawab
   keamanan dan bisnis, dengan maintenance window serta batas waktu yang jelas. Jangan
   menggunakan public-read policy sebagai rollback normal.

Sesudah rollback atau forward-fix, ulangi query policy dan kedua smoke test di atas.

## Bukti verifikasi

Catat tanggal, environment, commit/tag aplikasi, pelaksana, hasil setiap pemeriksaan,
serta tautan backup/restore runbook. Jangan mencatat credential atau isi data pelanggan.
