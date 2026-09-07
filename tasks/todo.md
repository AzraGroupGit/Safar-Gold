# Tasks: Dashboard Performa CS

- [x] Agregasi statistik CS memiliki unit test yang lulus.
- [x] Endpoint hanya dapat diakses role CS dan tidak menerima ID pengguna dari browser.
- [x] Halaman dashboard menampilkan KPI, tren, komposisi, dan riwayat order.
- [x] Menu dan breadcrumb tampil konsisten khusus role CS.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

# Tasks: Koreksi Stok

- [x] Validasi input dan hak akses stok memiliki unit test.
- [x] Penyesuaian manual menggunakan transaksi database atomik dan tidak dapat menghasilkan stok negatif.
- [x] Koreksi mempertahankan movement asli serta membuat movement pembalik dan pengganti.
- [x] Endpoint stok dibatasi khusus admin dan actor dicatat dari session.
- [x] Riwayat stok menampilkan sumber, petugas, status, dan aksi koreksi.
- [ ] Migrasi v16 diterapkan ke database Supabase.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

# Tasks: Visual Grafik Analitik

- [x] Formatter tanggal, angka ringkas, dan perubahan persentase memiliki unit test.
- [x] Panel grafik memiliki treatment visual dan insight header yang konsisten.
- [x] Grafik Keuangan, Stok, Sumber Pelanggan, dan Performa CS menggunakan tema bersama.
- [x] Doughnut menampilkan total utama dan bar ranking memiliki hierarki visual.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

# Tasks: Upgrade Modal Stok

- [x] Shell modal bersama mengikuti bahasa visual modal Order.
- [x] Penyesuaian stok menggunakan layout horizontal form dan ringkasan.
- [x] Koreksi stok membandingkan movement asli dengan data yang benar.
- [x] Minimum stok menampilkan konteks dan preview status.
- [x] Escape, focus trap, backdrop, dan pengembalian fokus tersedia.
- [x] Test, typecheck, lint, build, CodeGraph, dan Graphify selesai.

# Tasks: Upgrade Modal Jenis Emas

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
