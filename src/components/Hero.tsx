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
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      ),
    },
    {
      label: "Buyback Diterima",
      value: "6K – 24K",
      hint: "Semua kadar perhiasan",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12a8 8 0 0 1-8 8 8 8 0 0 1-6.9-4" />
          <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 6.9 4" />
          <path d="M18.9 4.5V8h-3.5M5.1 19.5V16h3.5" />
        </svg>
      ),
    },
    {
      label: "Emas Ready",
      value: "0.5 – 100 gr",
      hint: "Antam & Logam Mulia",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 10h11l2.5 8H4z" />
          <path d="M9 6h6l1.5 4h-9z" />
        </svg>
      ),
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

        <div className="mt-12 grid gap-3 sm:grid-cols-3 sm:gap-4 md:mt-14">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-gold/25 bg-white/[0.06] px-4 py-3.5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/[0.1] sm:block sm:px-5 sm:py-4 sm:text-left"
            >
              <div className="flex items-center gap-2 text-gold/70 transition-colors group-hover:text-gold">
                <span className="[&>svg]:h-4 [&>svg]:w-4">{s.icon}</span>
                <p className="text-[10px] font-semibold uppercase tracking-wider md:text-xs">
                  {s.label}
                </p>
              </div>
              <div className="text-right sm:mt-2.5 sm:text-left">
                <p className="gold-gradient-text font-serif text-xl font-bold leading-none md:text-2xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] text-white/45">{s.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
