export default function Testimoni() {
  const testimonials = [
    { name: "Budi Santoso", role: "Investor Emas", text: "Sudah 3 tahun transaksi di Safar Gold. Harga selalu update, spread kompetitif, pelayanan ramah. Sangat recommended.", rating: 5 },
    { name: "Siti Aminah", role: "Ibu Rumah Tangga", text: "Pertama kali jual perhiasan di sini, prosesnya cepat dan transparan. Harga buyback jelas, tidak seperti toko lain.", rating: 5 },
    { name: "Ahmad Rizki", role: "Pengusaha", text: "Kalkulator online-nya sangat membantu untuk simulasi sebelum datang ke toko. Profesional dan update real-time.", rating: 5 },
    { name: "Dewi Lestari", role: "Karyawan Swasta", text: "Rutin beli emas Antam untuk tabungan. Safar Gold selalu kasih harga terbaik dan barang terjamin asli. Terima kasih!", rating: 4 },
  ];

  return (
    <section className="relative overflow-hidden bg-surface px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <span className="pointer-events-none absolute -left-8 -top-8 select-none font-serif text-[14rem] font-bold leading-none text-gold/[0.04]">
        03
      </span>
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Testimoni</p>
          <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">Dipercaya Pelanggan</h2>
          <p className="mx-auto mt-5 max-w-xl text-text-muted">Ratusan pelanggan telah mempercayakan transaksi emas mereka kepada kami.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < t.rating ? "text-amber-400" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="rounded-full bg-gold/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                  {t.rating}/5
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 border-t border-border/40 pt-4">
                <p className="text-sm font-semibold text-text">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
