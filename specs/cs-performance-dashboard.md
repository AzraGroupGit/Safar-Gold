# Spec: Dashboard Performa CS

## Objective

Memberikan setiap pengguna ber-role `cs` dashboard privat untuk melihat order yang dibuatnya sendiri. Tahap ini mengukur performa order; nominal penghasilan ditunda sampai aturan kompensasi disepakati.

## Tech Stack and Commands

- Next.js App Router, React, TypeScript, Supabase, Chart.js.
- Test: `npm test`
- Type check: `npx tsc --noEmit`
- Lint: `npm run lint`
- Build: `npm run build`

## Project Structure

- `src/lib/cs-performance.ts`: agregasi murni dan tipe data.
- `src/app/api/admin/cs-performance/route.ts`: endpoint privat berbasis session.
- `src/app/(admin)/admin/performa/`: halaman dan client dashboard.
- `tests/cs-performance.test.ts`: unit test agregasi.

## Code Style

Gunakan tipe eksplisit, perhitungan WIB, komponen visual dari design system Analitik, dan identitas `user.id` dari server—bukan parameter CS dari browser.

## Testing Strategy

Unit test mencakup isolasi order per CS, order selesai versus batal, agregasi jual/buyback, tren periode, dan berat total item tanpa pengalian quantity ganda. Typecheck, lint, dan production build menjadi final gate.

## Boundaries

- Always: filter `created_by` menggunakan session user; hanya role CS yang dapat mengakses endpoint dan halaman.
- Ask first: formula penghasilan, target, bonus, dan migrasi compensation ledger.
- Never: menampilkan data CS lain, menganggap omzet/GP sebagai penghasilan, atau menerima `userId` dari query browser.

## Success Criteria

- Menu `Performa Saya` hanya terlihat untuk CS.
- CS hanya menerima order miliknya dari API.
- Dashboard memiliki filter periode, KPI selesai/jual/buyback/batal, tren, komposisi, dan riwayat.
- Admin dan pengguna tanpa role CS ditolak oleh endpoint.
- Tidak ada migrasi database pada tahap ini.

## Open Questions

- Formula dan tarif penghasilan per CS untuk tahap kedua.

## Admin Team View

- Admin melihat tab `Performa CS` di halaman Analitik; tidak ada menu sidebar baru.
- Ringkasan tim menampilkan CS aktif, order selesai/batal, rata-rata order, dan order tanpa `created_by`.
- Tabel membandingkan seluruh akun CS dan dapat membuka detail satu CS.
- Endpoint ringkasan dan detail wajib admin-only; target detail harus tervalidasi sebagai role CS.
