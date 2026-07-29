import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang Kami — Toko Emas Terpercaya",
  description: "Kenal lebih dekat dengan Safar Gold — cerita, tim, legalitas, dan komitmen kami dalam jual beli emas terpercaya.",
};

/* ============================================================
   CATATAN PENGISIAN KONTEN (Opsi B - struktur kosong)
   Ganti nilai placeholder di bawah dengan data asli Anda.
   Cari kata "ISI:" untuk menemukan setiap titik pengisian.
   ============================================================ */

const timeline: { year: string; title: string; desc: string }[] = [
  {
    year: "2025",
    title: "Awal Perjalanan di Yogyakarta",
    desc: "Safar Gold berdiri di Yogyakarta dengan misi menghadirkan transaksi emas yang mudah, aman, transparan, dan sesuai prinsip syariah.",
  },
  {
    year: "2025",
    title: "Layanan Jual Beli & Buyback",
    desc: "Mulai melayani jual beli logam mulia ANTAM, UBS, dan merek lainnya, serta buyback aneka perhiasan emas — termasuk tanpa surat, rusak, maupun patah.",
  },
  {
    year: "Kini",
    title: "Tumbuh Menjadi Partner Terpercaya",
    desc: "Berawal dari Yogyakarta, Safar Gold terus berkembang menjadi sahabat masyarakat dalam membeli, menjual, dan memahami emas dengan lebih baik.",
  },
];

// ISI: anggota tim inti (nama + jabatan + kutipan singkat + foto)
const team: { name: string; role: string; quote: string; photo?: string }[] = [
  { name: "", role: "", quote: "", photo: undefined },
  { name: "", role: "", quote: "", photo: undefined },
  { name: "", role: "", quote: "", photo: undefined },
];

// ISI: dokumen legalitas & sertifikat (judul + keterangan + gambar)
const certificates: { title: string; caption: string; image?: string }[] = [
  { title: "", caption: "", image: undefined },
  { title: "", caption: "", image: undefined },
  { title: "", caption: "", image: undefined },
];

// Nilai inti — teks default sudah diisi, ganti bila perlu
const values = [
  {
    title: "Integritas",
    desc: "Jujur dan konsisten dalam setiap transaksi. Apa yang kami janjikan, itu yang kami tepati.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    title: "Transparansi",
    desc: "Harga jual dan buyback terbuka. Tidak ada biaya tersembunyi — semua jelas di depan.",
    icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Kepercayaan",
    desc: "Membangun relasi jangka panjang dengan pelayanan yang tulus dan bertanggung jawab.",
    icon: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

export default function TentangPage() {
  return (
    <main className="bg-white">
      {/* ===== 1. HERO ===== */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        {/* ISI: ganti path gambar hero (foto tim/toko). Fallback: gradient gelap */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-footer"
          style={{ backgroundImage: "url('/tentang-hero.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="bg-diamond absolute inset-0 opacity-30" />

        <div className="relative mx-auto w-full max-w-4xl px-6 py-24 text-center md:py-36">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Tentang Kami
          </p>
          <h1 className="font-serif text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl">
            Kenal Lebih Dekat{" "}
            <span className="gold-gradient-text">Safar Gold</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Sahabat perjalanan investasi Anda — hadir untuk transaksi emas yang
            lebih mudah, aman, transparan, dan sesuai prinsip syariah.
          </p>
        </div>
      </section>

      {/* ===== 2. CERITA & SEJARAH ===== */}
      <section className="relative overflow-hidden bg-surface px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Narasi */}
          <div className="lg:col-span-2">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Cerita Kami
            </p>
            <h2 className="font-serif text-2xl font-bold text-text md:text-4xl">
              Perjalanan Kami
            </h2>
            <div className="mt-6 space-y-4 text-text-muted">
              <p className="leading-relaxed">
                Safar Gold adalah perusahaan jual beli emas yang berdiri pada tahun 2025 di Yogyakarta, hadir untuk memberikan pengalaman transaksi emas yang lebih mudah, aman, transparan, dan sesuai prinsip syariah.
              </p>
              <p className="leading-relaxed">
                Bagi kami, emas bukan sekadar komoditas untuk diperjualbelikan. Emas adalah bagian dari perjalanan dalam menjaga nilai, mempersiapkan masa depan, hingga memenuhi kebutuhan di berbagai fase kehidupan.
              </p>
              <p className="leading-relaxed">
                Berawal dari Yogyakarta, Safar Gold ingin tumbuh menjadi partner terpercaya bagi masyarakat dalam membeli, menjual, dan memahami emas dengan lebih baik.
              </p>
              <p className="font-serif text-base font-semibold italic text-gold-dark">
                Safar Gold — Sahabat Perjalanan Investasi Anda.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="relative space-y-8 border-l-2 border-gold/20 pl-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 ring-4 ring-surface">
                    <span className="h-2.5 w-2.5 rounded-full gold-gradient-bg" />
                  </span>
                  <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
                    <span className="font-serif text-lg font-bold text-gold-dark">
                      {item.year || "____"}
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-text">
                      {item.title || "[Judul milestone]"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {item.desc || "[Deskripsi singkat pencapaian pada tahun ini.]"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. LAYANAN KAMI ===== */}
      <section className="relative overflow-hidden bg-white px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Layanan Kami
            </p>
            <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">
              Apa yang Kami Tawarkan
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-text-muted">
              Solusi lengkap untuk kebutuhan jual beli emas Anda, dengan proses yang jelas dan terpercaya.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM11.25 19.5v2.25a.75.75 0 001.5 0V19.5a.75.75 0 00-1.5 0zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z",
                title: "Jual Beli Logam Mulia",
                desc: "Melayani jual beli logam mulia ANTAM, UBS, dan berbagai merek lainnya dengan harga kompetitif mengikuti pergerakan pasar.",
              },
              {
                icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
                title: "Buyback Perhiasan",
                desc: "Menerima buyback aneka perhiasan emas — termasuk perhiasan tanpa surat, rusak, patah, maupun kondisi lainnya.",
              },
              {
                icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
                title: "Pengecekan XRF Akurat",
                desc: "Setiap pengecekan dilakukan transparan dengan teknologi XRF untuk mengetahui kadar emas secara akurat — bertransaksi lebih tenang dan yakin.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-border/60 bg-surface p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/5 text-gold transition-all group-hover:bg-gold group-hover:text-white group-hover:shadow-lg group-hover:shadow-gold/20">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <h3 className="mb-3 font-serif text-lg font-semibold text-text">{s.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. TIM ===== */}
      <section className="relative overflow-hidden bg-surface px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Tim Kami
            </p>
            <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">
              Orang di Balik Safar Gold
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-text-muted">
              {/* ISI: kalimat pengantar tim */}
              Tim profesional yang berdedikasi memberikan layanan terbaik untuk Anda.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <div
                key={i}
                className="group flex flex-col items-center rounded-2xl border border-border/60 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
              >
                <div className="h-28 w-28 overflow-hidden rounded-full bg-surface ring-4 ring-gold/10">
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt={member.name || "Anggota tim"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gold/40">
                      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="mt-5 font-serif text-lg font-semibold text-text">
                  {member.name || "[Nama Anggota]"}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-gold-dark">
                  {member.role || "[Jabatan]"}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-text-muted">
                  {member.quote ? `\u201C${member.quote}\u201D` : "[Kutipan atau deskripsi singkat.]"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. SERTIFIKAT & LEGALITAS ===== */}
      <section className="relative overflow-hidden bg-white px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Legalitas
            </p>
            <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">
              Terdaftar &amp; Berizin Resmi
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-text-muted">
              {/* ISI: kalimat pengantar legalitas */}
              Setiap transaksi didukung oleh legalitas resmi dan kemitraan tepercaya.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-surface-alt">
                  {cert.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cert.image}
                      alt={cert.title || "Sertifikat"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gold/40">
                      <svg className="h-14 w-14" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-medium uppercase tracking-wider">[Foto Dokumen]</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-base font-semibold text-text">
                    {cert.title || "[Judul Sertifikat/Izin]"}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {cert.caption || "[Keterangan singkat dokumen legalitas.]"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. KOMITMEN & NILAI ===== */}
      <section className="relative overflow-hidden bg-surface px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Komitmen Kami
            </p>
            <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">
              Nilai yang Kami Pegang
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-border/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/5 text-gold transition-all group-hover:bg-gold group-hover:text-white group-hover:shadow-lg group-hover:shadow-gold/20">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                  </svg>
                </div>
                <h3 className="mb-3 font-serif text-lg font-semibold text-text">{v.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. CTA ===== */}
      <section className="relative overflow-hidden bg-footer px-4 py-16 md:px-6 md:py-24">
        <div className="bg-diamond absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl font-bold text-white md:text-4xl">
            Siap Transaksi dengan Kami?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-footer-text">
            Cek harga emas terkini atau hitung simulasi transaksi Anda sekarang.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/harga"
              className="gold-gradient-bg rounded-xl px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-gold/25 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold/30"
            >
              Cek Harga Hari Ini →
            </Link>
            <Link
              href="/kalkulator"
              className="rounded-xl border-2 border-white/20 px-8 py-4 text-sm font-semibold text-white/90 transition-all hover:border-gold/40 hover:text-gold"
            >
              Kalkulator Emas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
