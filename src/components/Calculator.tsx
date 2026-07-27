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

  const price = prices.find((p) => p.goldTypeId === goldTypeId);
  const weightNum = parseFloat(weight) || 0;
  const pricePerGram = txType === "buy" ? price?.buyPrice ?? 0 : price?.sellPrice ?? 0;
  const total = pricePerGram * weightNum;
  const hasData = price && price.buyPrice > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      <div className="border-b border-border/40 bg-surface/50 px-5 py-4 md:px-8 md:py-5">
        <h3 className="font-serif text-base font-bold text-text md:text-lg">Kalkulator Emas</h3>
        <p className="mt-0.5 text-xs text-text-muted">Simulasi transaksi Anda</p>
      </div>

      <div className="p-5 md:p-8">
        <div className="space-y-6">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <label className="text-sm font-semibold text-text">Jenis Transaksi</label>
              <div className="group relative">
                <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-surface text-[10px] font-bold text-text-muted">?</span>
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border/60 bg-white px-3 py-2 text-xs text-text-muted opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {txType === "buy"
                    ? "Harga jual: harga kami jual emas ke Anda"
                    : "Harga buyback: harga kami beli emas dari Anda"}
                </div>
              </div>
            </div>
            <div className="flex gap-2 rounded-xl border border-border/60 bg-surface p-1.5">
              <button
                onClick={() => setTxType("buy")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  txType === "buy" ? "gold-gradient-bg text-white shadow-md shadow-gold/20" : "text-text-muted hover:text-text"
                }`}
              >
                Beli Emas
              </button>
              <button
                onClick={() => setTxType("sell")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  txType === "sell" ? "gold-gradient-bg text-white shadow-md shadow-gold/20" : "text-text-muted hover:text-text"
                }`}
              >
                Jual Emas
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <label className="text-sm font-semibold text-text">Jenis Emas</label>
            </div>
            <select
              value={goldTypeId}
              onChange={(e) => setGoldTypeId(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-text focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10"
            >
              {goldTypes.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.karat}K)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <label className="text-sm font-semibold text-text">Berat (gram)</label>
            </div>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Masukkan berat emas"
                className="w-full rounded-xl border border-border/60 bg-white px-4 py-3 pr-16 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">gram</span>
            </div>
          </div>

          {weightNum > 0 && (
            <div className="overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-gold/3 to-gold/5 p-6">
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
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-text">Total Estimasi</span>
                    <span className="text-xl font-bold text-gold-dark">{hasData ? formatRupiahClient(total) : "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
