import type { Metadata } from "next";
import TabbedPricelist from "@/components/TabbedPricelist";
import PriceChart from "@/components/PriceChart";
import LegalNotice from "@/components/LegalNotice";
import { getFormattedTodayPrices, getMarketInfo, getPriceHistory, formatRupiah } from "@/lib/gold-api";

export const metadata: Metadata = {
  title: "Harga Emas Hari Ini — Logam Mulia, Buyback & Perhiasan",
  description: "Cek harga emas terkini: Logam Mulia Antam, Buyback LM, Perhiasan, dan Logam Lain. Update otomatis setiap 06:00 WIB.",
};

export const dynamic = "force-dynamic";

export default async function HargaPage() {
  const [prices, market, history] = await Promise.all([
    getFormattedTodayPrices(),
    getMarketInfo(),
    getPriceHistory(90),
  ]);
  const hasData = prices.length > 0 && prices[0].buyPrice > 0;

  const hargaAntam = prices.find((p) => p.goldTypeId === "antam-1");
  const buyback24k = prices.find((p) => p.goldTypeId === "ph-k24s");

  const todayValues = {
    lm: prices.find((p) => p.goldTypeId === "antam-1")?.buyPrice ?? 0,
    buyback: prices.find((p) => p.goldTypeId === "ph-k24s")?.sellPrice ?? 0,
  };

  return (
    <main className="bg-white">
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-6 md:pb-32 md:pt-36">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Update Harian</p>
              <h1 className="font-serif text-2xl font-bold text-text md:text-4xl">Harga Emas Hari Ini</h1>
              <p className="mt-3 text-text-muted">Harga di-update otomatis setiap pukul 06:00 WIB.</p>
            </div>
            {hasData && (
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold/10 px-4 py-2 text-sm font-medium text-gold-dark">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" /> Live
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-16 max-w-7xl px-4 pb-3 md:-mt-20 md:px-6 md:pb-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 — Antam 1gr */}
          <div className="relative overflow-hidden rounded-2xl gold-gradient-bg p-5 shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30">
            <div className="bg-diamond absolute inset-0 opacity-20" />
            <div className="relative">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">Antam 1gr</p>
              <p className="text-2xl font-bold text-white">
                {hargaAntam && hargaAntam.buyPrice > 0 ? formatRupiah(hargaAntam.buyPrice) : "-"}
              </p>
              <p className="mt-1 text-xs text-white/80">/ gram</p>
            </div>
          </div>

          {/* Card 2 — Buyback 24K */}
          <div className="relative overflow-hidden rounded-2xl gold-gradient-bg p-5 shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30">
            <div className="bg-diamond absolute inset-0 opacity-20" />
            <div className="relative">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">Buyback 24K*</p>
              <p className="text-2xl font-bold text-white">
                {buyback24k && buyback24k.sellPrice > 0 ? formatRupiah(buyback24k.sellPrice) : "-"}
              </p>
              <p className="mt-1 text-xs text-white/80">/ gram</p>
            </div>
          </div>

          {/* Card 3 — Emas Dunia */}
          <div className="relative overflow-hidden rounded-2xl gold-gradient-bg p-5 shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30">
            <div className="bg-diamond absolute inset-0 opacity-20" />
            <div className="relative">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">Emas Dunia</p>
              <p className="text-2xl font-bold text-white">
                {market.xauUsdPerOz > 0 ? `$${market.xauUsdPerOz.toLocaleString("en-US")}` : "-"}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                <span>/ oz</span>
                <span className="text-white/40">·</span>
                <span>Rp {market.usdIdrRate.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* Card 4 — Update */}
          <div className="relative overflow-hidden rounded-2xl gold-gradient-bg p-5 shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30">
            <div className="bg-diamond absolute inset-0 opacity-20" />
            <div className="relative">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">Update Terakhir</p>
              <p className="text-2xl font-bold text-white">
                {market.lastUpdate
                  ? new Date(market.lastUpdate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                  : "-"}
              </p>
              <p className="mt-1 text-xs text-white/80">Setiap 06:00 WIB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-6 md:px-6 md:pb-8">
        <PriceChart history={history} todayValues={todayValues} />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
        <TabbedPricelist prices={prices} />
        <div className="mt-6">
          <LegalNotice />
        </div>
      </div>
    </main>
  );
}
