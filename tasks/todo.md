# Tasks Proyek

Dokumen ini mencatat perubahan yang telah selesai serta backlog hasil audit menyeluruh sebelum deployment.

# Pekerjaan Selesai

## Fondasi dan Lifecycle Data

- [x] Baseline error diperbaiki dan quality gate proyek dijalankan.
- [x] Lifecycle order, stok, pembatalan, dan EOD diselaraskan.
- [x] Pembatalan order membuat movement pembalik tanpa menghapus histori.
- [x] Perubahan order menandai laporan EOD terkait sebagai stale.
- [x] Hak akses pembuatan EOD dan pengelolaan order dibatasi berdasarkan role.

## Halaman Stok

- [x] Filter merek dan periode dipisahkan agar lebih jelas digunakan.
- [x] Data stok diurutkan secara konsisten dan tidak tampil acak.
- [x] Tata letak tabel dirapikan agar data utama dapat dilihat tanpa scroll yang tidak perlu.

## Halaman Order

- [x] Kendala forbidden pada pembuatan order oleh admin diperbaiki.
- [x] Modal tambah dan edit order menggunakan layout web horizontal yang ringkas.
- [x] Item yang ditambahkan tampil dekat form input beserta detailnya.
- [x] Card Pembayaran dan Catatan ditempatkan setelah card item tanpa scroll modal yang tidak perlu.
- [x] Modal lihat order diselaraskan dengan modal tambah dan edit.
- [x] Invoice setiap order dapat dilihat dan diunduh.

## Halaman Pelanggan

- [x] Modal detail pelanggan menampilkan riwayat dan tanggal pembelian untuk perbandingan data.

## Dashboard Analitik

- [x] Dashboard analitik keuangan menampilkan pendapatan, pengeluaran, omzet, GP, persentase, dan filter periode.
- [x] Analitik stok dan sumber pelanggan ditambahkan sebagai tab dalam halaman Analitik.
- [x] Ketiga tab analitik diselaraskan dengan bahasa visual proyek.
- [x] Urutan menu sidebar dirapikan berdasarkan kelompok fungsi.

## Dashboard Performa CS

- [x] Agregasi statistik CS memiliki unit test yang lulus.
- [x] Endpoint hanya dapat diakses role CS dan tidak menerima ID pengguna dari browser.
- [x] Halaman dashboard menampilkan KPI, tren, komposisi, dan riwayat order.
- [x] Menu dan breadcrumb tampil konsisten khusus role CS.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

## Koreksi Stok

- [x] Migrasi database v16 diterapkan ke Supabase.
- [x] Validasi input dan hak akses stok memiliki unit test.
- [x] Penyesuaian manual menggunakan transaksi database atomik dan tidak dapat menghasilkan stok negatif.
- [x] Koreksi mempertahankan movement asli serta membuat movement pembalik dan pengganti.
- [x] Endpoint stok dibatasi khusus admin dan actor dicatat dari session.
- [x] Riwayat stok menampilkan sumber, petugas, status, dan aksi koreksi.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

## Visual Grafik Analitik

- [x] Formatter tanggal, angka ringkas, dan perubahan persentase memiliki unit test.
- [x] Panel grafik memiliki treatment visual dan insight header yang konsisten.
- [x] Grafik Keuangan, Stok, Sumber Pelanggan, dan Performa CS menggunakan tema bersama.
- [x] Doughnut menampilkan total utama dan bar ranking memiliki hierarki visual.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

## Upgrade Modal Stok

- [x] Shell modal bersama mengikuti bahasa visual modal Order.
- [x] Penyesuaian stok menggunakan layout horizontal form dan ringkasan.
- [x] Koreksi stok membandingkan movement asli dengan data yang benar.
- [x] Minimum stok menampilkan konteks dan preview status.
- [x] Escape, focus trap, backdrop, dan pengembalian fokus tersedia.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

## Upgrade Modal Jenis Emas

- [x] Modal tambah/edit menggunakan shell admin dan layout form-preview.
- [x] Category card selector memiliki deskripsi dan radio semantics.
- [x] Preview produk, ID sistem, serta deteksi perubahan tersedia.
- [x] Konfirmasi hapus khusus menggunakan danger treatment dan inline error.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

## Tampilan Tim untuk Admin

- [x] Agregasi perbandingan seluruh akun CS memiliki unit test.
- [x] Endpoint performa tim dibatasi khusus role admin.
- [x] Tab Analitik menampilkan KPI tim, tren, ranking, dan order tanpa atribusi.
- [x] Admin dapat membuka rincian performa dan order terbaru masing-masing CS.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

# Backlog Audit Pre-Deployment

## P0 — Wajib Sebelum Deployment

### Hardening Autentikasi dan Otorisasi API

- [x] Buat helper server terpusat `requireUser()` dan `requireRole()` dengan respons 401/403 yang konsisten.
- [x] Terapkan pemeriksaan sesi dan role langsung pada setiap route `/api/admin/*`, bukan hanya melalui Proxy atau layout.
- [x] Audit dan lindungi endpoint harga, jenis emas, konten, pengaturan, pelanggan, profil pengguna, laporan harian, dan EOD.
- [x] Lindungi seluruh method pada route yang sama secara konsisten, termasuk method baca seperti `GET`.
- [x] Pastikan route yang memakai Supabase service role selalu melakukan authorization sebelum membaca atau mengubah data.
- [x] Jadikan akun tanpa role sebagai `unassigned` dan tolak akses secara default.
- [x] Gunakan hanya `app_metadata.role` sebagai sumber authorization; hapus fallback ke `user_metadata.role`.
- [x] Hapus seluruh fallback role `admin` pada proxy, layout, sidebar, dan komponen client.
- [x] Pastikan penyembunyian menu di UI hanya menjadi bantuan UX dan bukan mekanisme keamanan utama.
- [x] Lindungi cron pembaruan harga dan scrape Antam dengan sesi admin atau `Authorization: Bearer CRON_SECRET`.
- [x] Tolak akses anonim sebelum provider eksternal maupun penulisan `app_settings` dijalankan.
- [x] Sanitasi kegagalan scrape Antam dan tambahkan regression test untuk admin, secret valid, secret salah, serta akses anonim.

### Sinkronisasi Akses Admin dan CS

- [x] Gunakan capability map terpusat sebagai sumber izin proxy, sidebar, halaman, dan route API yang disesuaikan.
- [x] Batasi daftar, detail, edit, pembatalan, dan invoice order CS hanya pada order yang dibuat oleh akun tersebut.
- [x] Sembunyikan `gp` dari respons CS dan pertahankan nilai `gp` lama ketika CS mengedit order.
- [x] Batasi daftar dan riwayat pelanggan CS pada relasi order miliknya serta samarkan NIK, alamat, wilayah, dan Instagram.
- [x] Berikan akses stok baca-saja kepada CS tanpa omzet, movement audit, atau kontrol mutasi stok.
- [x] Batasi EOD, laporan global, dan seluruh analitik bisnis hanya untuk Admin pada menu, URL halaman, dan API.
- [x] Sesuaikan dashboard CS dengan pintasan Order dan Performa Saya tanpa tautan ke halaman yang terlarang.

### Migrasi v17 dan Row Level Security

- [x] Buat migrasi v17 untuk menghapus public-read policy dari `orders`, `order_items`, `customers`, dan `stock_movements`.
- [x] Terapkan migrasi v17 ke database Supabase.
- [x] Jalankan smoke test akses anonim, Admin, dan CS setelah migrasi v17. Seluruh matriks akses lulus pada 2026-09-08; akun CS diselaraskan ke `app_metadata.role = cs` dan credential hanya digunakan melalui environment proses.
- [x] Evaluasi public-read policy tabel `stock`; sementara dipertahankan agar alur baca yang ada tidak terputus sebelum dipindahkan ke API terproteksi.
- [x] Pertahankan akses publik untuk jenis emas dan histori harga yang digunakan halaman publik.
- [x] Batasi pembacaan anonim `app_settings` menggunakan allowlist eksplisit dan keluarkan `api_key` dari policy publik.
- [x] Pastikan data pelanggan seperti telepon, NIK, alamat, transaksi, dan tanda tangan tidak dapat diakses menggunakan anon key (smoke test Supabase lulus pada 2026-09-08).
- [x] Tambahkan regression test statis untuk memastikan policy data sensitif dihapus dan setiap handler admin memiliki authorization check.
- [x] Dokumentasikan langkah eksekusi, verifikasi, dan rollback migrasi v17.

### Dependency Security

- [x] Upgrade manifest dan lockfile Next.js secara terisolasi ke versi 16.3.4.
- [x] Baca release notes dan panduan produksi Next.js sebelum melakukan upgrade.
- [x] Hindari `npm audit fix --force` dan review perubahan dependency melalui instalasi versi eksplisit.
- [x] Pastikan `npm audit --omit=dev --audit-level=high` tidak lagi menghasilkan kerentanan high atau critical (0 vulnerability pada 2026-09-09).
- [x] Jalankan test, typecheck, lint, dan build production setelah upgrade (117 test lulus; lint 0 error; build sukses pada 2026-09-09).
- [x] Perbaiki mismatch binding native Turbopack 16.3.4 melalui reinstall dependency bersih; development kembali memakai `next dev` dan bundle development maupun production bebas dari invariant Instant Validation.
- [x] Jalankan smoke test browser setelah upgrade; diverifikasi langsung oleh pengguna dan seluruh alur berjalan baik pada 2026-09-09.

### Tests dan Quality Gate Repository

- [x] Hapus `/tests` dari `.gitignore` agar seluruh unit test dapat di-commit ke repository.
- [x] Pastikan `vitest.config.mts`, script test, dan konfigurasi terkait tersedia untuk di-commit.
- [x] Tambahkan test policy role dan audit authorization untuk seluruh handler API admin.
- [x] Tambahkan test respons error utama: 400, 401, 403, 404, dan 409.
- [x] Tambahkan integration test untuk lifecycle order, stok, EOD, pelanggan, serta publikasi harga.
- [x] Pastikan build production selesai tanpa lock proses lain dan dokumentasikan hasil quality gate terakhir (2026-09-15: 251 test, typecheck, lint, dan build lulus; audit production terakhir lulus pada 2026-09-09).

## P1 — Sangat Disarankan Setelah P0

### Validasi dan Kontrak API

Progres terverifikasi (2026-09-14):

- [x] Validasi boundary untuk preview/publikasi harga: angka wajib finite, rentang harga dan persentase dibatasi, serta adjustment tetap mendukung nilai bertanda.
- [x] Validasi allowlist, format, panjang, dan rentang nilai untuk endpoint penyimpanan pengaturan admin.
- [x] Terapkan respons `VALIDATION_ERROR` (400) dan `INTERNAL_ERROR` (500) yang aman pada endpoint harga dan pengaturan.
- [x] Tambahkan logging internal berkonteks tanpa mengirim detail error mentah ke browser pada endpoint harga dan pengaturan.
- [x] Tambahkan regression test untuk payload invalid, kegagalan database/provider, dan payload pengaturan dashboard yang valid.

Progres terverifikasi (2026-09-15):

- [x] Batasi dan validasi nama, nomor HP, NIK, alamat, wilayah, sumber, Instagram, dan catatan pada mutasi order serta endpoint pelanggan langsung.
- [x] Normalisasikan nomor Indonesia berawalan `62` secara konsisten pada alur order dan pelanggan.
- [x] Validasi nama profil serta signature PNG data URL, termasuk batas ukuran payload tanda tangan.
- [x] Sanitasi error database pada endpoint daftar, detail, lookup, dan penyimpanan pelanggan serta profil pengguna.
- [x] Tambahkan regression test pelanggan/profil dan perluas test lifecycle order untuk batas serta format data pelanggan.

Progres terverifikasi (2026-09-15, konten dan laporan):

- [x] Validasi serta normalisasi seluruh field Hero sebelum penyimpanan konten.
- [x] Batasi rentang laporan harian ke `today`, `week`, atau `month`.
- [x] Validasi payload dan tanggal kalender EOD sebelum query database dijalankan.
- [x] Tangani kegagalan query pendukung EOD serta sanitasi error konten dan laporan.
- [x] Tambahkan regression test untuk payload invalid, normalisasi konten, dan error database yang aman.

Progres terverifikasi (2026-09-15, jenis emas):

- [x] Validasi ID, nama, kategori, karat, berat, margin, mode otomatis, dan harga manual pada boundary API.
- [x] Batasi nilai angka jenis emas terhadap format, rentang, dan nilai maksimum yang aman.
- [x] Hentikan sinkronisasi harga jika update mode gagal serta propagasikan error write dari helper database.
- [x] Berikan respons konflik stabil saat jenis emas masih digunakan tanpa membocorkan detail database.
- [x] Tambahkan regression test route dan helper write database untuk domain jenis emas.

Progres terverifikasi (2026-09-15, mutasi stok):

- [x] Batasi jumlah penyesuaian, koreksi, dan minimum stok ke bilangan bulat aman hingga `1.000.000`.
- [x] Validasi format ID produk dan UUID movement serta batasi panjang merek, catatan, dan alasan koreksi.
- [x] Pisahkan error validasi, konflik stok yang dikenal, dan kegagalan internal pada route mutasi stok.
- [x] Sanitasi detail error database pada penyesuaian, koreksi, dan minimum stok.
- [x] Tambahkan regression test parser, batas input, konflik stok, dan kegagalan database.

Progres terverifikasi (2026-09-15, pembacaan stok):

- [x] Validasi rentang `all`, `today`, `week`, atau `month` secara konsisten sebelum query stok dijalankan.
- [x] Sanitasi detail error database pada daftar stok, ringkasan penjualan, dan riwayat movement.
- [x] Pertahankan data stok/movement saat pengayaan ringkasan penjualan atau identitas petugas gagal, dengan logging internal yang aman.
- [x] Tambahkan regression test untuk range invalid, error query, dan kegagalan pengayaan non-blocking.

Progres terverifikasi (2026-09-15, order):

- [x] Batasi jumlah item, qty, berat, harga per gram, total order, dan GP pada rentang operasional yang aman.
- [x] Validasi nama item, merek, ID produk, karat, metode pembayaran, dan UUID order pada boundary API.
- [x] Pisahkan error validasi, stok tidak mencukupi, order dibatalkan/tidak ditemukan, dan kegagalan internal.
- [x] Sanitasi error database pada daftar, pembuatan, detail, perubahan, dan pembatalan order.
- [x] Tangani kegagalan lookup profil pembuat invoice sebagai pengayaan non-blocking dengan logging aman.
- [x] Tambahkan regression test parser order, error query/RPC, ID invalid, serta konflik stok.

Progres terverifikasi (2026-09-15, pengguna Admin/CS):

- [x] Validasi dan normalisasi email serta batasi password, role, dan UUID pengguna pada boundary API.
- [x] Tolak field perubahan yang invalid tanpa meneruskannya ke Supabase Auth.
- [x] Petakan konflik email, password lemah, dan pengguna tidak ditemukan ke respons API yang stabil.
- [x] Sanitasi error Supabase Auth pada daftar, pembuatan, perubahan, dan penghapusan pengguna.
- [x] Tambahkan regression test untuk payload invalid, normalisasi input, konflik email, dan error provider yang aman.

Progres terverifikasi (2026-09-15, analitik dan cron harga):

- [x] Sanitasi error database pada analitik keuangan, stok, sumber pelanggan, dan performa tim CS.
- [x] Sanitasi error database pada dashboard performa pribadi CS.
- [x] Sanitasi respons error internal cron pembaruan harga tanpa mengubah payload sukses.
- [x] Catat kegagalan BI, MetalpriceAPI, dan CoinGecko hanya sebagai konteks serta tipe error tanpa detail sensitif.
- [x] Tambahkan regression test untuk error analitik, performa CS, cron harga, dan logging provider.

- [x] Buat parser/schema input per domain untuk harga, pelanggan, profil, konten, pengaturan, dan laporan.
- [x] Batasi panjang dan format nama, nomor telepon, NIK, alamat, catatan, Instagram, dan signature.
- [ ] Validasi seluruh nilai angka terhadap `NaN`, infinity, nilai negatif, nol yang tidak valid, dan batas maksimum.
- [ ] Terapkan format respons API serta kode error yang konsisten.
- [ ] Jangan mengirim pesan database, stack trace, atau `String(error)` mentah kepada browser.
- [ ] Tambahkan logging internal yang tetap menyimpan konteks error tanpa membocorkan data sensitif.

### Pagination dan Performa Query

- [ ] Terapkan pagination server-side pada order, pelanggan, stock movements, dan EOD.
- [ ] Pindahkan agregasi pelanggan dari memory aplikasi ke SQL view, query agregat, atau RPC.
- [ ] Batasi jumlah data dan rentang tanggal maksimum pada endpoint analitik dan laporan.
- [ ] Tambahkan indeks untuk `orders.customer_id`, `orders.created_at`, `orders.created_by`, serta kombinasi filter yang sering digunakan.
- [ ] Hindari penggunaan `select("*")` pada endpoint operasional ketika hanya beberapa kolom yang diperlukan.
- [ ] Ukur response time dan query plan untuk order, pelanggan, stok, EOD, dan analitik menggunakan data yang mendekati produksi.

### Konsistensi Transaksi Database

- [ ] Jadikan publikasi harga dan penyimpanan settings sebagai satu transaksi/RPC atomik.
- [ ] Ubah customer upsert menjadi `INSERT ... ON CONFLICT(phone) DO UPDATE` agar aman terhadap request bersamaan.
- [ ] Pastikan generate EOD idempotent dan aman saat dua request dikirim bersamaan.
- [ ] Periksa dan tangani error pada setiap query Supabase, termasuk query pendukung sebelum operasi utama.
- [ ] Tambahkan test concurrency dan rollback untuk alur harga, pelanggan, dan EOD.

### Refactor untuk Maintainability

- [ ] Pecah `src/lib/gold-api.ts` menjadi modul market provider, prices, settings, gold types, dan customers.
- [ ] Pecah `OrdersClient.tsx` menjadi controller/state, form order, item editor, detail view, invoice action, dan tabel.
- [ ] Pecah `PriceApprovalPanel.tsx` menjadi kalkulasi, input form, preview, dan orchestration.
- [ ] Satukan helper format tanggal, rentang periode, persentase, dan Rupiah yang saat ini berulang.
- [ ] Identifikasi dan hapus komponen atau helper lama yang sudah tidak memiliki consumer setelah mendapatkan persetujuan.
- [ ] Jaga refactor tetap terpisah dari perubahan perilaku agar mudah direview dan di-rollback.

## P2 — Kesiapan Operasional dan Peningkatan Lanjutan

### Next.js dan Security Headers

- [x] Migrasikan `src/middleware.ts` ke `src/proxy.ts` sesuai konvensi Next.js 16.
- [ ] Tambahkan Content Security Policy yang kompatibel dengan Supabase, font, gambar, dan integrasi eksternal proyek.
- [ ] Tambahkan HSTS, `X-Content-Type-Options`, `Referrer-Policy`, dan proteksi framing.
- [ ] Tambahkan rate limiting pada login, cron, update harga, publikasi harga, dan endpoint mutasi penting.
- [ ] Validasi environment variable saat startup dan hentikan aplikasi dengan pesan jelas jika konfigurasi wajib tidak tersedia.

### Error Handling dan Observability

- [ ] Tambahkan `global-error.tsx`, halaman not-found, serta error boundary pada area dashboard penting.
- [ ] Tambahkan health endpoint yang memeriksa aplikasi tanpa mengekspos data atau secret.
- [ ] Integrasikan error monitoring untuk error client, server, dan route handler.
- [ ] Terapkan structured logging dengan request ID, endpoint, status, durasi, dan actor ID yang aman.
- [ ] Pantau error rate, p50/p95 latency, request volume, dan kegagalan database setelah deployment.
- [ ] Tambahkan pengukuran Core Web Vitals untuk halaman publik dan dashboard.

### CI/CD dan Release Safety

- [ ] Tambahkan GitHub Actions untuk test, typecheck, lint, production build, dan dependency audit.
- [ ] Jadikan kegagalan quality gate sebagai blocker merge/deployment.
- [ ] Siapkan environment staging dan jalankan smoke test sebelum production.
- [ ] Dokumentasikan rollback aplikasi dan rollback/forward-fix database untuk setiap release.
- [ ] Tambahkan changelog release dan tag versi yang dapat dilacak ke artifact deployment.
- [ ] Verifikasi backup database serta prosedur restore sebelum perubahan database berikutnya.

### Browser, Accessibility, dan Performance

- [ ] Tambahkan E2E test untuk login, role admin/CS, order, stok, pelanggan, EOD, invoice, dan analitik.
- [ ] Verifikasi seluruh modal dan form menggunakan keyboard, focus trap, screen reader label, dan error association.
- [ ] Jalankan accessibility scan dan perbaiki seluruh temuan berprioritas tinggi.
- [ ] Jalankan Lighthouse/Core Web Vitals pada halaman publik dan dashboard utama.
- [x] Ganti elemen `<img>` pada Navbar dan Footer dengan `next/image` menggunakan dimensi intrinsik aset.
- [ ] Pertimbangkan self-hosted font agar build tidak bergantung pada ketersediaan Google Fonts.
- [ ] Analisis bundle dan lazy-load library berat seperti Chart.js, html2canvas, dan jsPDF jika tidak diperlukan pada initial load.

## Definition of Done Backlog

- [x] Seluruh task P0 selesai sebelum deployment production.
- [x] Tidak ada kerentanan dependency production high atau critical yang belum memiliki mitigasi terdokumentasi.
- [x] Tidak ada endpoint service-role tanpa pemeriksaan authorization di dalam handler (audit route 2026-09-15).
- [ ] Anon key tidak dapat membaca data transaksi, pelanggan, profil pengguna, atau histori stok internal.
- [ ] Unit, integration, dan E2E test kritis lulus di CI.
- [ ] Typecheck, lint, dan production build lulus dari clean checkout.
- [ ] Smoke test staging untuk order, stok, pembatalan, EOD, invoice, dan role access lulus.
- [ ] Monitoring, backup, dan rollback telah diverifikasi sebelum production rollout.
