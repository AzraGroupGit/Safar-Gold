export default function Keunggulan() {
  return (
    <section className="relative overflow-hidden bg-surface px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <span className="pointer-events-none absolute -right-8 -top-8 select-none font-serif text-[14rem] font-bold leading-none text-gold/[0.04]">
        01
      </span>
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Mengapa Kami
          </p>
          <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">
            Kenapa Safar Gold?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-text-muted">
            Kami hadir dengan standar tertinggi untuk memastikan setiap transaksi emas Anda aman, transparan, dan menguntungkan.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Harga Real-time",
              desc: "Update harga emas otomatis dari pasar internasional setiap pukul 06:00 WIB, selalu akurat tanpa perlu cek manual.",
              badge: "Auto",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: "Terpercaya",
              desc: "Legalitas resmi dan terdaftar. Ratusan pelanggan telah mempercayakan transaksi emas mereka kepada kami.",
              badge: "Resmi",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              title: "Transparan",
              desc: "Harga jual dan buyback ditampilkan secara terbuka. Tidak ada biaya tersembunyi — semua jelas di depan.",
              badge: "Jelas",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
              title: "Spread Kompetitif",
              desc: "Selisih harga jual-beli paling tipis di pasaran. Kami pastikan Anda mendapat nilai terbaik untuk emas Anda.",
              badge: "Terbaik",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/5 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-white group-hover:shadow-lg group-hover:shadow-gold/20">
                  {f.icon}
                </div>
                <span className="rounded-full bg-gold/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                  {f.badge}
                </span>
              </div>
              <h3 className="mb-3 font-serif text-lg font-semibold text-text">{f.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
