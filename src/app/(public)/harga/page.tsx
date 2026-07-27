import type { Metadata } from "next";
import PriceTable from "@/components/PriceTable";
import PriceChart from "@/components/PriceChart";
import { getFormattedTodayPrices, formatRupiah } from "@/lib/gold-api";

export const metadata: Metadata = {
  title: "Harga Emas Hari Ini",
  description: "Cek harga emas terkini: Antam, UBS, dan perhiasan. Update otomatis setiap 06:00 WIB.",
};

export default function HargaPage() {
  const prices = getFormattedTodayPrices();
  const hasData = prices.length > 0 && prices[0].buyPrice > 0;

  const highlightCards = [
    { label: "Antam 100gr", price: prices.find((p) => p.goldTypeId === "antam-100"), trend: "+0.8%" },
    { label: "UBS 100gr", price: prices.find((p) => p.goldTypeId === "ubs-100"), trend: "+0.6%" },
    { label: "Perhiasan 24K", price: prices.find((p) => p.goldTypeId === "perhiasan-24k"), trend: "+1.2%" },
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
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 md:px-6 md:pb-20 md:pt-36">
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

      <div className="mx-auto max-w-7xl px-4 pb-3 md:px-6 md:pb-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlightCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-gold/5">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">{card.label}</p>
              {card.isSpread ? (
                <>
                  <p className="text-2xl font-bold text-text">{card.spread}%</p>
                  <p className="mt-1 text-xs text-green-600">Kompetitif</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gold-dark">
                    {card.price && card.price.buyPrice > 0 ? formatRupiah(card.price.buyPrice) : "-"}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="text-green-600">{card.trend}</span>
                    <span className="text-text-muted">/ gram</span>
                  </div>
                </>
              )}
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
