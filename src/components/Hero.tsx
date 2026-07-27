import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden md:min-h-[90vh]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/safar-hero.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-20 text-center md:py-36">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium text-gold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          Harga Real-time — Update Setiap 06:00 WIB
        </div>

        <h1 className="mt-6 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-white md:mt-8 md:text-6xl lg:text-7xl">
          Emas Anda,{" "}
          <span className="gold-gradient-text">Investasi</span>
          <br />
          <span className="gold-gradient-text">Masa Depan</span> Anda
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          Pantau harga emas real-time, hitung transaksi dengan kalkulator cerdas,
          dan dapatkan harga terbaik — setiap hari, otomatis.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/harga"
            className="gold-gradient-bg rounded-xl px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-gold/25 transition-all hover:shadow-2xl hover:shadow-gold/30 hover:scale-[1.02]"
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

        <div className="mt-14 flex items-center justify-center gap-12">
          {[
            { label: "Update", value: "06:00" },
            { label: "Spread", value: "~2-5%" },
            { label: "Jenis", value: "8+" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-bold text-white md:text-3xl">{s.value}</p>
              <p className="text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
