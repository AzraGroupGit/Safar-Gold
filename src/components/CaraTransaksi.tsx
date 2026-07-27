export default function CaraTransaksi() {
  const steps = [
    { step: "01", title: "Pilih Jenis Emas", desc: "Antam, UBS, atau perhiasan — pilih sesuai kebutuhan investasi Anda." },
    { step: "02", title: "Cek Harga & Kalkulasi", desc: "Gunakan kalkulator cerdas kami untuk simulasi total transaksi secara instan." },
    { step: "03", title: "Transaksi Aman", desc: "Datang langsung ke toko kami atau hubungi via WhatsApp untuk transaksi terpercaya." },
  ];

  return (
    <section className="relative overflow-hidden bg-footer py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-diamond" />
      <span className="pointer-events-none absolute -right-8 -top-8 select-none font-serif text-[14rem] font-bold leading-none text-white/[0.03]">
        02
      </span>
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">Mulai Transaksi</p>
          <h2 className="font-serif text-2xl font-bold text-white md:text-4xl lg:text-5xl">Tiga Langkah Mudah</h2>
          <p className="mx-auto mt-5 max-w-xl text-footer-text">Proses jual beli emas yang simpel dan aman.</p>
        </div>
        <div className="relative grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className="group relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-10 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl hover:shadow-black/20">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-white group-hover:shadow-lg group-hover:shadow-gold/20">
                  <span className="font-serif text-2xl font-bold">{s.step}</span>
                </div>
                <h3 className="mb-3 font-serif text-xl font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-footer-text">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 z-10 hidden h-px w-12 md:block">
                  <div className="h-full w-full bg-gold/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
