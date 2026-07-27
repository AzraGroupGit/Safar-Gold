export default function KunjungiKami() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <span className="pointer-events-none absolute -left-8 -top-8 select-none font-serif text-[8rem] font-bold leading-none text-gold/[0.04] md:text-[14rem]">
        04
      </span>
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 text-center md:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Lokasi</p>
          <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">Kunjungi Toko Kami</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-text-muted md:mt-5 md:text-base">
            Datang langsung ke toko fisik kami untuk transaksi yang lebih personal dan terpercaya.
          </p>
        </div>
        <div className="overflow-hidden rounded-[20px] border border-border/60 bg-white shadow-sm md:rounded-[28px] lg:grid lg:grid-cols-5">
          <div className="h-64 w-full lg:col-span-3 lg:h-full lg:min-h-[400px]">
            <iframe src="https://maps.google.com/maps?q=Safar+Gold&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" className="border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Safar Gold Location" />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8 lg:col-span-2 lg:p-10">
            <div className="space-y-5 md:space-y-6">
              {[
                {
                  icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                  title: "Alamat",
                  content: "Safar Gold, Jl. Emas No. 1, Jakarta",
                  href: "https://google.com/maps/place/Safar+Gold",
                },
                {
                  icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
                  title: "Jam Operasional",
                  content: "Sen-Jum: 09:00-17:00\nSabtu: 09:00-14:00",
                },
                {
                  icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
                  title: "Kontak",
                  content: "+62 812-3456-7890\ninfo@safargold.com",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 md:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/5 text-gold md:h-11 md:w-11">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-text md:text-base">{item.title}</h4>
                    {item.content.split("\n").map((line, i) => (
                      <p key={i} className="text-sm text-text-muted">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              <a href="https://google.com/maps/place/Safar+Gold/data=!4m2!3m1!1s0x0:0xbc990ad3b2d7966a?sa=X&ved=1t:2428&ictx=111" target="_blank" rel="noopener noreferrer" className="gold-gradient-bg inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 md:px-6 md:py-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
