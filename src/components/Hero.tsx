import Link from "next/link";
import { getHeroContent, getMarketInfo } from "@/lib/gold-api";

export default async function Hero() {
  const [hero, market] = await Promise.all([getHeroContent(), getMarketInfo()]);

  const lastUpdate = market.lastUpdate
    ? new Date(market.lastUpdate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
    : "-";

  const stats = [
    {
      label: "Update Terakhir",
      value: lastUpdate,
      hint: "06:00 WIB",
      live: true,
    },
    {
      label: "Buyback Diterima",
      value: "6K – 24K",
      hint: "Semua kadar perhiasan",
      live: false,
    },
    {
      label: "Emas Ready",
      value: "0.5 – 100 gr",
      hint: "Antam & Logam Mulia",
      live: false,
    },
  ];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden md:min-h-[90vh]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/safar-hero.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/45" />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-20 text-center md:py-36">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium text-gold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          {hero.badge}
        </div>

        <h1 className="mt-6 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-white md:mt-8 md:text-6xl lg:text-7xl">
          {hero.headlineStart}{" "}
          <span className="gold-gradient-text">{hero.headlineGradient}</span>
          {hero.headlineEnd ? <> {hero.headlineEnd}</> : null}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          {hero.subheadline}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/harga"
            className="gold-gradient-bg rounded-xl px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-gold/25 transition-all hover:shadow-2xl hover:shadow-gold/30 hover:scale-[1.02]"
          >
            {hero.ctaText} →
          </Link>
          <Link
            href="/kalkulator"
            className="rounded-xl border-2 border-white/20 px-8 py-4 text-sm font-semibold text-white/90 transition-all hover:border-gold/40 hover:text-gold"
          >
            Kalkulator Emas
          </Link>
        </div>

        <div className="mx-auto mt-12 max-w-2xl border-t border-gold/50 bg-black/20 backdrop-blur-sm md:mt-14">
          <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group flex items-center justify-between gap-3 px-5 py-3.5 text-left sm:block sm:px-6 sm:py-5 sm:text-center"
              >
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/75">
                  {s.live && (
                    <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_1px_rgba(200,145,22,0.7)]" />
                  )}
                  {s.label}
                </p>
                <div className="text-right sm:mt-3 sm:text-center">
                  <p className="font-serif text-lg font-semibold leading-none text-white transition-colors group-hover:text-gold-light sm:text-2xl md:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] text-white/50">{s.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
