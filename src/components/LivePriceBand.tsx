import Link from "next/link";
import { getMarketInfo, getSetting, formatRupiah } from "@/lib/gold-api";

const GOLD_OZ = 31.1034768;

function FluctuationBadge({ current, prev }: { current: number; prev: number }) {
  if (current <= 0 || prev <= 0) {
    return <span className="text-xs text-white/50 italic">belum ada data</span>;
  }

  const diff = current - prev;
  const pct = (diff / prev) * 100;

  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-white/70">
        — {(0).toLocaleString("id-ID")} (0,0%)
      </span>
    );
  }

  const isUp = diff > 0;
  const arrow = isUp ? "▲" : "▼";
  const bg = isUp ? "bg-emerald-500/20" : "bg-red-500/20";
  const textColor = isUp ? "text-emerald-300" : "text-red-300";
  const sign = isUp ? "+" : "";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium ${bg} ${textColor}`}>
      {arrow} {sign}{diff.toLocaleString("id-ID")} ({sign}{pct.toFixed(1).replace(".", ",")}%)
    </span>
  );
}

export default async function LivePriceBand() {
  const [market, globalRaw, globalPrevRaw, antamRaw, antamPrevRaw] = await Promise.all([
    getMarketInfo(),
    getSetting("global_gold_price"),
    getSetting("global_gold_price_prev"),
    getSetting("antam_price"),
    getSetting("antam_price_prev"),
  ]);

  const antamPrice = parseInt(antamRaw) || 0;
  const antamPrev = parseInt(antamPrevRaw) || 0;

  const computedGlobal =
    market.xauUsdPerOz > 0 && market.usdIdrRate > 0
      ? Math.round((market.xauUsdPerOz * market.usdIdrRate) / GOLD_OZ)
      : 0;

  const globalPrice = parseInt(globalRaw) > 0 ? parseInt(globalRaw) : computedGlobal;
  const globalPrev = parseInt(globalPrevRaw) > 0 ? parseInt(globalPrevRaw) : 0;

  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24">
      <div className="absolute -top-32 right-0 h-[500px] w-[500px] translate-x-1/4 rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute -bottom-32 left-0 h-[400px] w-[400px] -translate-x-1/4 rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark sm:text-left">
              Harga Hari Ini
            </p>
            <h2 className="text-center font-serif text-2xl font-bold text-text sm:text-left md:text-4xl">
              Pantau Harga Emas <span className="gold-gradient-text">Real-time</span>
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-4 py-2 text-sm font-medium text-gold-dark">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Live
          </span>
        </div>

        <Link href="/harga" className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl gold-gradient-bg p-6 shadow-lg shadow-gold/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/30">
            <div className="bg-diamond absolute inset-0 opacity-20" />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Emas Dunia
              </p>
              <p className="mt-1 text-3xl font-bold text-white md:text-4xl">
                {globalPrice > 0 ? formatRupiah(globalPrice) : "-"}
              </p>
              <p className="mt-1 text-xs text-white/80">/ gram</p>
              <div className="mt-3">
                <FluctuationBadge current={globalPrice} prev={globalPrev} />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl gold-gradient-bg p-6 shadow-lg shadow-gold/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/30">
            <div className="bg-diamond absolute inset-0 opacity-20" />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Logam Mulia Antam
              </p>
              <p className="mt-1 text-3xl font-bold text-white md:text-4xl">
                {antamPrice > 0 ? formatRupiah(antamPrice) : "-"}
              </p>
              <p className="mt-1 text-xs text-white/80">/ gram</p>
              <div className="mt-3">
                <FluctuationBadge current={antamPrice} prev={antamPrev} />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
