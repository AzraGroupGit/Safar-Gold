import type { Metadata } from "next";
import PriceTable from "@/components/PriceTable";
import PriceChart from "@/components/PriceChart";
import { getFormattedTodayPrices, getMarketInfo, formatRupiah } from "@/lib/gold-api";

export const metadata: Metadata = {
  title: "Harga Emas Hari Ini",
  description: "Cek harga emas terkini: Antam, UBS, dan perhiasan. Update otomatis setiap 06:00 WIB.",
};

export default function HargaPage() {
  const prices = getFormattedTodayPrices();
  const market = getMarketInfo();
  const hasData = prices.length > 0 && prices[0].buyPrice > 0;

  const highlightCards = [
    { label: "Antam 100gr", price: prices.find((p) => p.goldTypeId === "antam-100"), trend: 0.8 },
    { label: "UBS 100gr", price: prices.find((p) => p.goldTypeId === "ubs-100"), trend: 0.6 },
    { label: "Perhiasan 24K", price: prices.find((p) => p.goldTypeId === "perhiasan-24k"), trend: 1.2 },
    {
      label: "Spread Rata-rata",
      spread: prices.length > 0
        ? (prices.reduce((sum, p) => sum + (p.buyPrice > 0 ? ((p.buyPrice - p.sellPrice) / p.buyPrice) * 100 : 0), 0) / prices.length).toFixed(1)
        : "0",
      isSpread: true,
    },
  ];

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

          {/* Info bar */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border/60 bg-white px-5 py-3 text-sm shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Emas Internasional:</span>
              <span className="font-semibold text-text">{market.xauUsdPerOz > 0 ? `$${market.xauUsdPerOz.toLocaleString("en-US")}/oz` : "-"}</span>
            </div>
            <div className="hidden h-4 w-px bg-border/60 sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Kurs USD/IDR:</span>
              <span className="font-semibold text-text">Rp {market.usdIdrRate.toLocaleString("id-ID")}</span>
            </div>
            <div className="hidden h-4 w-px bg-border/60 sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Update:</span>
              <span className="font-semibold text-text">
                {market.lastUpdate ? new Date(market.lastUpdate).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Belum ada"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-16 max-w-7xl px-4 pb-3 md:-mt-20 md:px-6 md:pb-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlightCards.map((card) => (
            <div key={card.label} className="relative overflow-hidden rounded-2xl gold-gradient-bg p-5 shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30">
              <div className="bg-diamond absolute inset-0 opacity-20" />
              <div className="relative">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">{card.label}</p>
                {card.isSpread ? (
                  <>
                    <p className="text-2xl font-bold text-white">{card.spread}%</p>
                    <p className="mt-1 text-xs text-white/80">Kompetitif</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-white">
                      {card.price && card.price.buyPrice > 0 ? formatRupiah(card.price.buyPrice) : "-"}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-white/20 px-1.5 py-0.5 font-semibold text-white">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                        {card.trend}%
                      </span>
                      <span className="text-white/70">/ gram</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-6 md:px-6 md:pb-8">
        <PriceChart />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
        <PriceTable />
      </div>
    </main>
  );
}
