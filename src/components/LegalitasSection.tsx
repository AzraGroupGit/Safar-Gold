export default function LegalitasSection() {
  const points = [
    {
      icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
      label: "Sumber Legal",
      desc: "Hanya menerima emas yang dapat dibuktikan asal-usulnya secara sah.",
    },
    {
      icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
      label: "Transaksi Aman",
      desc: "Setiap transaksi tercatat dan mengikuti regulasi yang berlaku di Indonesia.",
    },
    {
      icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
      label: "Tolak Emas Ilegal",
      desc: "Kami berhak menolak transaksi yang tidak dapat diverifikasi legalitasnya.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-footer py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-diamond opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Kiri — statement utama */}
          <div className="flex flex-col justify-center lg:col-span-2">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10">
              <svg className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Komitmen Legalitas
            </p>
            <h2 className="font-serif text-2xl font-bold text-white md:text-4xl">
              Kami Hanya Menerima{" "}
              <span className="gold-gradient-text">Emas Legal</span>
            </h2>
            <p className="mt-5 leading-relaxed text-footer-text">
              Safar Gold berkomitmen penuh untuk menjaga integritas setiap transaksi. Kami tidak menerima, memproses, atau memperjualbelikan emas yang berasal dari sumber ilegal, hasil kejahatan, atau tidak dapat diverifikasi asal-usulnya.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm font-medium text-gold">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Pelanggaran akan dilaporkan kepada pihak berwajib
            </div>
          </div>

          {/* Kanan — 3 poin */}
          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1 lg:gap-4">
            {points.map((p) => (
              <div key={p.label} className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur transition-all hover:border-gold/20 hover:bg-white/[0.06]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-white">{p.label}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-footer-text">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
