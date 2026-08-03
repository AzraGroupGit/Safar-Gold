"use client";

import { useState } from "react";
import type { GoldTypeRow, FormattedPrice } from "@/lib/gold-api";

function formatRupiahClient(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export default function AdminHargaClient({ goldTypes, prices }: { goldTypes: GoldTypeRow[]; prices: FormattedPrice[] }) {
  const [showForm, setShowForm] = useState(false);
  const [autoMode, setAutoMode] = useState<Record<string, boolean>>(Object.fromEntries(goldTypes.map((g) => [g.id, !!g.is_auto])));
  const [manualPrices, setManualPrices] = useState<Record<string, { buy: number; sell: number }>>(
    Object.fromEntries(goldTypes.map((g) => [g.id, { buy: g.manual_buy ?? 0, sell: g.manual_sell ?? 0 }]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasData = prices.length > 0 && prices.some(p => p.buyPrice > 0 || p.sellPrice > 0);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/update-gold-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goldTypes.map((g) => ({ id: g.id, isAuto: autoMode[g.id], manualBuy: manualPrices[g.id].buy, manualSell: manualPrices[g.id].sell }))),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    window.location.reload();
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Manajemen Harga</h1>
          <p className="mt-1 text-sm text-text-muted">Atur mode & harga per jenis emas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-xl border border-border/60 bg-white px-5 py-2.5 text-sm font-semibold text-text shadow-sm transition-all hover:border-gold/30 hover:text-gold-dark hover:shadow-md">
          {showForm ? "Tutup" : "Atur Mode Harga"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-gold/20 bg-white p-6 shadow-lg shadow-gold/5">
          <h3 className="mb-1 font-serif text-lg font-semibold text-text">Mode & Harga per Jenis Emas</h3>
          <p className="mb-6 text-sm text-text-muted">Auto: dihitung dari margin. Manual: tentukan harga sendiri.</p>
          <div className="space-y-4">
            {goldTypes.map((gt) => (
              <div key={gt.id} className="rounded-xl border border-border/40 bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-text">{gt.name}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${autoMode[gt.id] ? "text-green-600" : "text-amber-600"}`}>
                      {autoMode[gt.id] ? "Auto" : "Manual"}
                    </span>
                    <button onClick={() => setAutoMode({ ...autoMode, [gt.id]: !autoMode[gt.id] })} className={`relative h-6 w-11 rounded-full transition-colors ${autoMode[gt.id] ? "gold-gradient-bg" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${autoMode[gt.id] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                </div>
                {autoMode[gt.id] ? (
                  <p className="text-xs text-text-muted">Harga dihitung otomatis dari acuan dashboard</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">Harga Jual Manual</label>
                      <input type="number" value={manualPrices[gt.id]?.buy ?? 0} onChange={(e) => setManualPrices({ ...manualPrices, [gt.id]: { ...manualPrices[gt.id], buy: parseInt(e.target.value) || 0 } })} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm text-text focus:border-gold focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">Harga Buyback Manual</label>
                      <input type="number" value={manualPrices[gt.id]?.sell ?? 0} onChange={(e) => setManualPrices({ ...manualPrices, [gt.id]: { ...manualPrices[gt.id], sell: parseInt(e.target.value) || 0 } })} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm text-text focus:border-gold focus:outline-none" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="gold-gradient-bg rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-border/60 bg-white px-6 py-2.5 text-sm font-semibold text-text-muted transition-all hover:text-text">Batal</button>
            {saved && <span className="text-sm font-medium text-green-600">Tersimpan! Refresh...</span>}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-4 py-4 md:px-6">Jenis Emas</th>
                <th className="px-4 py-4 md:px-6">Kategori</th>
                <th className="hidden px-4 py-4 sm:table-cell md:px-6">Mode</th>
                <th className="px-4 py-4 md:px-6">Harga Jual</th>
                <th className="px-4 py-4 md:px-6">Buyback</th>
                <th className="hidden px-4 py-4 sm:table-cell md:px-6">Spread</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {goldTypes.map((gt) => {
                const price = prices.find((p) => p.goldTypeId === gt.id);
                const spread = Math.abs((price?.buyPrice ?? 0) - (price?.sellPrice ?? 0));
                const sp = (price?.buyPrice ?? 0) > 0 ? ((spread / (price!.buyPrice)) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={gt.id} className="transition-colors hover:bg-surface/50">
                    <td className="px-4 py-4 md:px-6"><p className="text-sm font-semibold text-text">{gt.name}</p></td>
                    <td className="px-4 py-4 md:px-6"><span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium uppercase text-text-muted">{gt.category}</span></td>
                    <td className="hidden px-4 py-4 sm:table-cell md:px-6">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${gt.is_auto ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        {gt.is_auto ? "Auto" : "Manual"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gold-dark md:px-6">{hasData ? formatRupiahClient(price?.buyPrice ?? 0) : "-"}</td>
                    <td className="px-4 py-4 text-sm font-medium text-text md:px-6">{hasData ? formatRupiahClient(price?.sellPrice ?? 0) : "-"}</td>
                    <td className="hidden px-4 py-4 text-sm text-text-muted sm:table-cell md:px-6">{hasData ? `${formatRupiahClient(spread)} (${sp}%)` : "-"}</td>
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
