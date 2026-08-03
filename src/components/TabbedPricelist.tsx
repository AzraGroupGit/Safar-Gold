"use client";

import { useState } from "react";
import type { FormattedPrice } from "@/lib/gold-api";
import { formatRupiah } from "@/lib/gold-api";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "lm", label: "Logam Mulia" },
  { key: "bb-lm", label: "Buyback LM" },
  { key: "bb-perhiasan", label: "Perhiasan" },
  { key: "bb-logam", label: "Logam Lain" },
];

export default function TabbedPricelist({
  prices,
}: {
  prices: FormattedPrice[];
}) {
  const [active, setActive] = useState("lm");
  const filtered = prices
    .filter((p) => p.category === active)
    .sort((a, b) => active === "bb-perhiasan" ? (b.karat ?? 0) - (a.karat ?? 0) : 0);
  const hasData = filtered.length > 0 && (filtered[0].buyPrice > 0 || filtered[0].sellPrice > 0);

  const isLM = active === "lm";
  const isBuyback = active.startsWith("bb-");

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      {/* Tab Bar */}
      <div className="flex overflow-x-auto border-b border-border/40 bg-surface/50">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`shrink-0 border-b-2 px-5 py-4 text-sm font-semibold transition-all ${
              active === cat.key
                ? "border-gold text-gold-dark"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {!hasData ? (
        <div className="p-12 text-center">
          <p className="text-sm text-text-muted">
            Data harga belum tersedia, silahkan tunggu beberapa saat.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-surface/30 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-5 py-4 md:px-8">Jenis</th>
                {isBuyback && <th className="px-5 py-4 md:px-8">Karat</th>}
                <th className="px-5 py-4 md:px-8">Harga / Gram</th>
                {isLM && <th className="px-5 py-4 md:px-8">Total</th>}
                {!isLM && <th className="px-5 py-4 md:px-8">Spread</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((price) => (
                <tr
                  key={price.id}
                  className="transition-colors hover:bg-surface/50"
                >
                  <td className="px-5 py-4 md:px-8">
                    <p className="text-sm font-semibold text-text">
                      {price.goldName}
                    </p>
                  </td>
                  {isBuyback && (
                    <td className="px-5 py-4 md:px-8">
                      {price.karat != null ? (
                        <span className="rounded-full bg-gold/5 px-2.5 py-1 text-xs font-medium text-gold-dark">
                          {price.karat}K
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">-</span>
                      )}
                    </td>
                  )}
                  <td className="px-5 py-4 md:px-8">
                    {isBuyback ? (
                      <span className="text-sm font-bold text-text">
                        {formatRupiah(price.sellPrice)}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-gold-dark">
                        {formatRupiah(price.buyPrice)}
                      </span>
                    )}
                  </td>
                  {isLM && price.weight && (
                    <td className="px-5 py-4 md:px-8">
                      <span className="text-sm font-bold text-gold-dark">
                        {formatRupiah(price.buyPrice * price.weight)}
                      </span>
                    </td>
                  )}
                  {!isLM && (
                    <td className="px-5 py-4 md:px-8">
                      <p className="text-sm text-text-muted">
                        {formatRupiah(price.spread)}
                      </p>
                      <p className="text-xs text-text-light">
                        {price.spreadPercent}%
                      </p>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
