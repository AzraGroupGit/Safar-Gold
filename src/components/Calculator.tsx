"use client";

import { useState } from "react";
import type { GoldTypeRow, FormattedPrice } from "@/lib/gold-api";

function formatRupiahClient(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const quickWeights = [1, 5, 10, 25, 50, 100];

export default function Calculator({
  goldTypes,
  prices,
}: {
  goldTypes: GoldTypeRow[];
  prices: FormattedPrice[];
}) {
  const [goldTypeId, setGoldTypeId] = useState(goldTypes.length > 0 ? goldTypes[0].id : "");
  const [weight, setWeight] = useState("");
  const [txType, setTxType] = useState<"buy" | "sell">("buy");

  const selectedGold = goldTypes.find((g) => g.id === goldTypeId);
  const price = prices.find((p) => p.goldTypeId === goldTypeId);
  const weightNum = parseFloat(weight) || 0;
  const pricePerGram = txType === "buy" ? price?.buyPrice ?? 0 : price?.sellPrice ?? 0;
  const total = pricePerGram * weightNum;
  const hasData = price && price.buyPrice > 0;

  const waMessage = encodeURIComponent(
    `Halo Safar Gold, saya ingin ${txType === "buy" ? "membeli" : "menjual"} ${selectedGold?.name ?? "emas"} seberat ${weightNum} gram.\n\nEstimasi total: ${formatRupiahClient(total)}\n\nMohon info lebih lanjut.`
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-lg shadow-gold/10">
      <div className="relative overflow-hidden gold-gradient-bg px-5 py-4 md:px-8 md:py-5">
        <div className="bg-diamond absolute inset-0 opacity-20" />
        <div className="relative">
          <h3 className="font-serif text-base font-bold text-white md:text-lg">Kalkulator Emas</h3>
          <p className="mt-0.5 text-xs text-white/70">Simulasi transaksi Anda</p>
        </div>
      </div>

      <div className="p-5 md:p-8">
        <div className="space-y-6">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <label className="text-sm font-semibold text-text">Jenis Transaksi</label>
              <div className="group relative">
                <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-surface text-[10px] font-bold text-text-muted">?</span>
                <div className="absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border/60 bg-white px-3 py-2 text-xs text-text-muted opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-10">
                  {txType === "buy"
                    ? "Harga jual: harga kami jual emas ke Anda"
                    : "Harga buyback: harga kami beli emas dari Anda"}
                </div>
              </div>
            </div>
            <div className="flex gap-2 rounded-xl border border-border/60 bg-surface p-1.5">
              <button onClick={() => setTxType("buy")} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${txType === "buy" ? "gold-gradient-bg text-white shadow-md shadow-gold/20" : "text-text-muted hover:text-text"}`}>
                Beli Emas
              </button>
              <button onClick={() => setTxType("sell")} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${txType === "sell" ? "gold-gradient-bg text-white shadow-md shadow-gold/20" : "text-text-muted hover:text-text"}`}>
                Jual Emas
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2.5 block text-sm font-semibold text-text">Jenis Emas</label>
            <select value={goldTypeId} onChange={(e) => setGoldTypeId(e.target.value)} className="w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-text focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10">
              {goldTypes.map((g) => (
                <option key={g.id} value={g.id}>{g.name} ({g.karat}K)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2.5 block text-sm font-semibold text-text">Berat (gram)</label>
            <div className="relative">
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Masukkan berat emas" className="w-full rounded-xl border border-border/60 bg-white px-4 py-3 pr-16 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">gram</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickWeights.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(String(w))}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    weightNum === w
                      ? "border-gold bg-gold/5 text-gold-dark"
                      : "border-border/60 text-text-muted hover:border-gold/40 hover:text-gold-dark"
                  }`}
                >
                  {w}g
                </button>
              ))}
            </div>
          </div>

          {weightNum > 0 && (
            <div className="overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Harga {txType === "buy" ? "Jual" : "Buyback"} / Gram</span>
                  <span className="font-semibold text-text">{hasData ? formatRupiahClient(pricePerGram) : "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Berat</span>
                  <span className="font-semibold text-text">{weightNum} gram</span>
                </div>
                <div className="border-t border-gold/20 pt-3">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-semibold text-text">Total Estimasi</span>
                    <span className="font-serif text-2xl font-bold text-gold-dark">{hasData ? formatRupiahClient(total) : "-"}</span>
                  </div>
                </div>
              </div>

              {hasData && (
                <a
                  href={`https://wa.me/6281234567890?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#20bd5a] hover:shadow-lg"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                  </svg>
                  Konsultasi via WhatsApp
                </a>
              )}
            </div>
          )}

          <p className="text-xs leading-relaxed text-text-light">
            * Estimasi berdasarkan harga hari ini. Harga final dapat berubah saat transaksi sesuai kondisi pasar dan pengecekan kadar emas.
          </p>
        </div>
      </div>
    </div>
  );
}
