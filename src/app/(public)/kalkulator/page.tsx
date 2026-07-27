import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import { getAllGoldTypes, getFormattedTodayPrices, formatRupiah } from "@/lib/gold-api";

export const metadata: Metadata = {
  title: "Kalkulator Emas",
  description: "Hitung simulasi transaksi jual beli emas. Masukkan jenis emas dan berat untuk estimasi total.",
};

export default function KalkulatorPage() {
  const goldTypes = getAllGoldTypes();
  const prices = getFormattedTodayPrices();
  const hasData = prices.length > 0 && prices[0].buyPrice > 0;

  return (
    <main className="bg-white">
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 md:px-6 md:pb-20 md:pt-36">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
                Kalkulator
              </p>
              <h1 className="font-serif text-2xl font-bold text-text md:text-4xl">
                Kalkulator Emas
              </h1>
              <p className="mt-3 text-text-muted">
                Hitung simulasi transaksi jual beli emas Anda secara instan.
              </p>
            </div>
            {hasData && (
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold/10 px-4 py-2 text-sm font-medium text-gold-dark">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                Harga Live
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Calculator goldTypes={goldTypes} prices={prices} />
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
              <div className="border-b border-border/40 bg-surface/50 px-8 py-5">
                <h3 className="font-serif text-lg font-bold text-text">Referensi Harga Hari Ini</h3>
                <p className="mt-0.5 text-xs text-text-muted">Acuan perhitungan kalkulator</p>
              </div>
              <div className="divide-y divide-border/30 p-6">
                {hasData ? (
                  prices.map((price) => (
                    <div key={price.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium text-text">{price.goldName}</p>
                        <p className="text-xs text-text-muted">{price.karat}K · {price.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gold-dark">{formatRupiah(price.buyPrice)}</p>
                        <p className="text-xs text-text-muted">Beli: {formatRupiah(price.sellPrice)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-text-muted">Belum ada data harga hari ini.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
