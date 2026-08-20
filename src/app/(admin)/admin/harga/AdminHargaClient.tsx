"use client";

import { useState, useEffect } from "react";
import type { GoldTypeRow, FormattedPrice } from "@/lib/gold-api";
import { sortGoldTypes } from "@/lib/gold-api";
import { createClient } from "@/lib/supabase/client";

function formatRupiahClient(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

const MODE_TABS: { key: string; label: string }[] = [
  { key: "lm", label: "Logam Mulia" },
  { key: "bb-lm", label: "Buyback LM" },
  { key: "bb-perhiasan", label: "Perhiasan" },
  { key: "bb-logam", label: "Logam Lain" },
];

function ModeModal({
  open,
  onClose,
  goldTypes,
  autoMode,
  setAutoMode,
  manualPrices,
  setManualPrices,
  onSave,
  saving,
  saved,
}: {
  open: boolean;
  onClose: () => void;
  goldTypes: GoldTypeRow[];
  autoMode: Record<string, boolean>;
  setAutoMode: (v: Record<string, boolean>) => void;
  manualPrices: Record<string, { buy: number; sell: number }>;
  setManualPrices: (v: Record<string, { buy: number; sell: number }>) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const [tab, setTab] = useState("lm");

  if (!open) return null;

  const filtered = sortGoldTypes(goldTypes).filter((g) => g.category === tab);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-[10vh] pb-10">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-border/60 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-text">Atur Mode & Harga</h2>
            <p className="mt-0.5 text-xs text-text-muted">Auto: dihitung dari margin. Manual: tentukan harga sendiri.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-border/30 bg-surface/50 px-6">
          {MODE_TABS.map((t) => {
            const count = goldTypes.filter((g) => g.category === t.key).length;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === t.key ? "text-gold-dark" : "text-text-muted hover:text-text"
                }`}
              >
                {t.label}
                <span className="ml-1.5 text-xs font-normal text-text-light">({count})</span>
                {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 gold-gradient-bg" />}
              </button>
            );
          })}
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {filtered.map((gt) => (
              <div key={gt.id} className="rounded-xl border border-border/40 bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text">{gt.name}</p>
                    {autoMode[gt.id] ? (
                      <p className="mt-0.5 text-xs text-text-muted">Harga dihitung otomatis dari acuan dashboard</p>
                    ) : gt.category === "lm" ? (
                      <div className="mt-2">
                        <label className="mb-1 block text-xs text-text-muted">Harga Jual Total (per keping)</label>
                        <input
                          type="number"
                          value={manualPrices[gt.id]?.buy ?? 0}
                          onChange={(e) => setManualPrices({ ...manualPrices, [gt.id]: { ...manualPrices[gt.id], buy: parseInt(e.target.value) || 0 } })}
                          className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                        />
                        {gt.weight ? (
                          <p className="mt-1 text-[11px] text-text-muted">
                            Harga yang dimasukkan adalah total per keping (sudah termasuk perkalian dengan berat). Sistem menampilkannya langsung, tanpa perlu dikalikan lagi.
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-2">
                        <label className="mb-1 block text-xs text-text-muted">Harga Buyback per Gram</label>
                        <input
                          type="number"
                          value={manualPrices[gt.id]?.sell ?? 0}
                          onChange={(e) => setManualPrices({ ...manualPrices, [gt.id]: { ...manualPrices[gt.id], sell: parseInt(e.target.value) || 0 } })}
                          className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`text-xs font-medium ${autoMode[gt.id] ? "text-green-600" : "text-amber-600"}`}>
                      {autoMode[gt.id] ? "Auto" : "Manual"}
                    </span>
                    <button
                      onClick={() => setAutoMode({ ...autoMode, [gt.id]: !autoMode[gt.id] })}
                      className={`relative h-6 w-11 rounded-full transition-colors ${autoMode[gt.id] ? "gold-gradient-bg" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${autoMode[gt.id] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-text-muted">Tidak ada jenis emas di kategori ini.</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/40 px-6 py-4">
          {saved && <span className="text-sm font-medium text-green-600">Tersimpan! Refresh...</span>}
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="rounded-lg border border-border/60 bg-white px-5 py-2.5 text-sm font-semibold text-text-muted transition-all hover:text-text">
              Batal
            </button>
            <button onClick={onSave} disabled={saving} className="gold-gradient-bg rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminHargaClient({ goldTypes, prices }: { goldTypes: GoldTypeRow[]; prices: FormattedPrice[] }) {
  const [showModal, setShowModal] = useState(false);
  const [autoMode, setAutoMode] = useState<Record<string, boolean>>(Object.fromEntries(goldTypes.map((g) => [g.id, !!g.is_auto])));
  const [manualPrices, setManualPrices] = useState<Record<string, { buy: number; sell: number }>>(
    Object.fromEntries(goldTypes.map((g) => [
      g.id,
      g.category === "lm"
        ? { buy: g.manual_buy ?? 0, sell: 0 }
        : { buy: 0, sell: g.manual_sell ?? 0 },
    ]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [role, setRole] = useState<string>("admin");
  const hasData = prices.length > 0 && prices.some(p => p.buyPrice > 0 || p.sellPrice > 0);

  useEffect(() => {
    async function fetchRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setRole(user.user_metadata?.role ?? "admin");
    }
    fetchRole();
  }, []);

  function isBuyable(category: string) { return category === "lm"; }
  function getPrice(gt: GoldTypeRow, price: FormattedPrice | undefined) {
    if (!hasData || !price) return null;
    if (isBuyable(gt.category)) {
      if (price.isTotalPrice) {
        return price.buyPrice > 0 ? price.buyPrice : null;
      }
      const perGram = price.buyPrice;
      if (perGram <= 0) return null;
      return gt.weight ? Math.round(perGram * gt.weight) : perGram;
    }
    return price.sellPrice > 0 ? price.sellPrice : null;
  }
  function getPriceLabel(gt: GoldTypeRow, price: FormattedPrice | undefined) {
    if (!isBuyable(gt.category)) return "Harga Buyback";
    if (price?.isTotalPrice) return "Harga Jual (total/keping)";
    return "Harga Jual";
  }
  function formatPrice(amount: number | null) {
    if (amount === null) return "-";
    return formatRupiahClient(amount);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/update-gold-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goldTypes.map((g) => {
        const isLm = g.category === "lm";
        return {
          id: g.id,
          isAuto: autoMode[g.id],
          manualBuy: isLm ? manualPrices[g.id]?.buy ?? 0 : null,
          manualSell: isLm ? null : (manualPrices[g.id]?.sell ?? 0),
        };
      })),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    window.location.reload();
  }

  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Manajemen Harga</h1>
          <p className="mt-1 text-sm text-text-muted">Atur mode & harga per jenis emas</p>
        </div>
        {role !== "cs" && (
          <button onClick={() => setShowModal(true)} className="rounded-xl border border-border/60 bg-white px-5 py-2.5 text-sm font-semibold text-text shadow-sm transition-all hover:border-gold/30 hover:text-gold-dark hover:shadow-md">
            Atur Mode Harga
          </button>
        )}
      </div>

      <ModeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        goldTypes={goldTypes}
        autoMode={autoMode}
        setAutoMode={setAutoMode}
        manualPrices={manualPrices}
        setManualPrices={setManualPrices}
        onSave={handleSave}
        saving={saving}
        saved={saved}
      />

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-4 py-4 md:px-6">Jenis Emas</th>
                <th className="px-4 py-4 md:px-6">Kategori</th>
                <th className="hidden px-4 py-4 sm:table-cell md:px-6">Mode</th>
                <th className="px-4 py-4 md:px-6">Harga</th>
                <th className="px-4 py-4 md:px-6">Spread</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sortGoldTypes(goldTypes).map((gt) => {
                const price = prices.find((p) => p.goldTypeId === gt.id);
                const displayPrice = getPrice(gt, price);
                const label = getPriceLabel(gt, price);
                return (
                  <tr key={gt.id} className="transition-colors hover:bg-surface/50">
                    <td className="px-4 py-4 md:px-6"><p className="text-sm font-semibold text-text">{gt.name}</p></td>
                    <td className="px-4 py-4 md:px-6"><span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium uppercase text-text-muted">{gt.category}</span></td>
                    <td className="hidden px-4 py-4 sm:table-cell md:px-6">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${gt.is_auto ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        {gt.is_auto ? "Auto" : "Manual"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gold-dark md:px-6">
                      <div>{formatPrice(displayPrice)}</div>
                      <div className="text-xs font-normal text-text-muted">{label}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-muted md:px-6">
                      {displayPrice !== null
                        ? `${formatRupiahClient(price?.spread ?? 0)} (${price?.spreadPercent ?? "0.0"}%)`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
