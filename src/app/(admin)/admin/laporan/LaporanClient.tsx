"use client";

import { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/gold-api";

type DailySummary = { totalOrders: number; totalJual: number; totalBuyback: number; totalJualItems: number; totalBuybackItems: number; net: number };
type StockRow = { gold_type_id: string; qty: number; min_qty: number; gold_types: { name: string; weight: number | null } | null };

export default function LaporanClient() {
  const [range, setRange] = useState("today");
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [stock, setStock] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [d, s] = await Promise.all([
        fetch(`/api/admin/laporan/daily?range=${range}`).then(r => r.json()),
        fetch("/api/admin/stock").then(r => r.json()),
      ]);
      if (!cancelled) {
        setSummary(d.summary ?? null);
        setStock(s.stock ?? []);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [range]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-text">Laporan</h1>
          <p className="mt-1 text-sm text-text-muted">Ringkasan transaksi & stok</p>
        </div>
        <div className="flex gap-2 rounded-lg border border-border/60 bg-white p-1">
          {[{ key: "today", label: "Hari Ini" }, { key: "week", label: "Minggu" }, { key: "month", label: "Bulan" }].map(r => (
            <button key={r.key} onClick={() => setRange(r.key)} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${range === r.key ? "bg-gold/10 text-gold-dark" : "text-text-muted hover:text-text"}`}>{r.label}</button>
          ))}
        </div>
      </div>

      {/* Ringkasan Harian */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Total Transaksi</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-text">{summary?.totalOrders ?? 0}</p>
          <p className="text-xs text-text-muted">Jual: {summary?.totalJualItems ?? 0} item · Buyback: {summary?.totalBuybackItems ?? 0} item</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Omset Jual</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-600">{formatRupiah(summary?.totalJual ?? 0)}</p>
          <p className="text-xs text-text-muted">Customer beli dari Safar Gold</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Buyback Cost</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-amber-600">{formatRupiah(summary?.totalBuyback ?? 0)}</p>
          <p className="text-xs text-text-muted">Customer jual ke Safar Gold</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Net (GP)</p>
          <p className={`mt-2 text-2xl font-bold tabular-nums ${(summary?.net ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>{formatRupiah(summary?.net ?? 0)}</p>
          <p className="text-xs text-text-muted">Omset − Buyback Cost</p>
        </div>
      </div>

      {/* Stok Rekap */}
      <div className="mb-8">
        <h3 className="mb-4 font-serif text-lg font-semibold text-text">Stok Rekap</h3>
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-white">
          <table className="w-full min-w-[480px]">
            <thead><tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><th className="px-4 py-3">Produk</th><th className="px-4 py-3 text-center">Stok</th><th className="px-4 py-3 text-center">Status</th></tr></thead>
            <tbody className="divide-y divide-border/30">
              {stock.map(s => (
                <tr key={s.gold_type_id}>
                  <td className="px-4 py-3 text-sm font-medium text-text">{s.gold_types?.name ?? s.gold_type_id}</td>
                  <td className="px-4 py-3 text-center text-sm font-bold tabular-nums">{s.qty}</td>
                  <td className="px-4 py-3 text-center">{s.qty===0?<span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">Habis</span>:s.qty<=s.min_qty?<span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Menipis</span>:<span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Tersedia</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
