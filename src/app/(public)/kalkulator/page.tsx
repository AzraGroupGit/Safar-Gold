import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import LegalNotice from "@/components/LegalNotice";
import { getAllGoldTypes, getFormattedTodayPrices, getPublicSettings, formatRupiah } from "@/lib/gold-api";

export const metadata: Metadata = {
  title: "Kalkulator Emas — Hitung Jual Beli Instan",
  description: "Hitung simulasi transaksi jual beli emas secara instan. Masukkan jenis emas dan berat untuk estimasi total harga terkini.",
};

export const dynamic = "force-dynamic";

export default async function KalkulatorPage() {
  const goldTypes = await getAllGoldTypes();
  const prices = await getFormattedTodayPrices();
  const settings = await getPublicSettings();
  const hasData = prices.length > 0 && prices.some(p => p.buyPrice > 0 || p.sellPrice > 0);

  const highlights = [
    { id: "antam-1", label: "Antam 1gr (Jual)", key: "buyPrice" as const },
    { id: "ph-k24s", label: "Buyback 24K", key: "sellPrice" as const },
    { id: "bb-certi-1-2", label: "Buyback Certi 1-2gr", key: "sellPrice" as const },
    { id: "ll-perak", label: "Perak / Gram", key: "sellPrice" as const },
  ].map((h) => {
    const match = prices.find((p) => p.goldTypeId === h.id);
    return { ...h, price: match?.[h.key] ?? 0, found: !!match && match[h.key] > 0 };
  });

  return (
    <main className="bg-white">
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-6 md:pb-32 md:pt-36">
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

      <div className="mx-auto -mt-16 max-w-7xl px-4 pb-16 md:-mt-20 md:px-6 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Calculator goldTypes={goldTypes} prices={prices} phone={settings.phone} />
          </div>

          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-lg shadow-gold/10">
              <div className="relative overflow-hidden gold-gradient-bg px-6 py-5">
                <div className="bg-diamond absolute inset-0 opacity-20" />
                <div className="relative">
                  <h3 className="font-serif text-lg font-bold text-white">Referensi Harga Hari Ini</h3>
                  <p className="mt-0.5 text-xs text-white/70">Acuan perhitungan kalkulator</p>
                </div>
              </div>
              <div className="divide-y divide-border/30 p-6">
                {hasData ? (
                  <>
                    {highlights.map((h) => (
                      <div key={h.id} className="flex items-center justify-between py-3 first:pt-0">
                        <p className="text-sm font-medium text-text">{h.label}</p>
                        <p className="text-sm font-bold text-gold-dark">
                          {h.found ? formatRupiah(h.price) : "-"}
                        </p>
                      </div>
                    ))}
                    <div className="pt-4">
                      <Link
                        href="/harga"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gold/40 px-4 py-2.5 text-sm font-semibold text-gold-dark transition-all hover:border-gold hover:bg-gold/5"
                      >
                        Lihat Harga Lengkap
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="py-8 text-center text-sm text-text-muted">Belum ada data harga hari ini.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <LegalNotice />
        </div>
      </div>
    </main>
  );
}
