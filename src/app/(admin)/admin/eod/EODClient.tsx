"use client";

import { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/gold-api";

type Breakdown = {
  jualLM: { total: number; items: number };
  buybackLM: { total: number; items: number };
  buybackPerhiasan: { total: number; items: number };
  buybackLogam: { total: number; items: number };
};
type StockSnapshot = { gold_type_id: string; name: string; qty: number; min_qty: number };
type EOD = {
  id: number;
  date: string;
  total_orders: number;
  total_jual_orders: number;
  total_buyback_orders: number;
  total_jual: number;
  total_buyback: number;
  total_jual_items: number;
  total_buyback_items: number;
  net: number;
  breakdown: Breakdown;
  stock_snapshot: StockSnapshot[];
  generated_by: string | null;
  generated_at: string;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EODClient() {
  const [eods, setEods] = useState<EOD[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [selected, setSelected] = useState<EOD | null>(null);

  function load() {
    fetch("/api/admin/laporan/eod")
      .then((r) => r.json())
      .then((d) => {
        setEods(d.eods ?? []);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setInfo("");
    const res = await fetch("/api/admin/laporan/eod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data.exists) {
      setInfo("EOD untuk tanggal ini sudah ditutup sebelumnya.");
      setSelected(data.eod);
    } else if (data.success) {
      setInfo("EOD berhasil ditutup.");
      setSelected(data.eod);
    } else {
      setError(data.error ?? "Gagal menutup EOD");
    }
    setGenerating(false);
    load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  const b = selected?.breakdown;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-text">End of Day</h1>
          <p className="mt-1 text-sm text-text-muted">Penutupan kas & rekap transaksi harian</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {generating ? "Menutup..." : "Tutup Hari Ini"}
        </button>
      </div>

      {info && <div className="mb-4 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-gold-dark">{info}</div>}
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {/* Detail EOD terpilih */}
      {selected && (
        <div className="mb-8 rounded-xl border border-gold/20 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text">Closing — {formatDate(selected.date)}</p>
              <p className="text-xs text-text-muted">
                Ditutup: {new Date(selected.generated_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <button onClick={() => setSelected(null)} className="rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text">
              Tutup Detail
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border/40 bg-surface p-4">
              <p className="text-xs text-text-muted">Omset Jual</p>
              <p className="text-xl font-bold tabular-nums text-emerald-600">{formatRupiah(selected.total_jual)}</p>
              <p className="text-xs text-text-muted">{selected.total_jual_orders} order · {selected.total_jual_items} item</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-surface p-4">
              <p className="text-xs text-text-muted">Buyback Cost</p>
              <p className="text-xl font-bold tabular-nums text-amber-600">{formatRupiah(selected.total_buyback)}</p>
              <p className="text-xs text-text-muted">{selected.total_buyback_orders} order · {selected.total_buyback_items} item</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-surface p-4">
              <p className="text-xs text-text-muted">Net Kas</p>
              <p className={`text-xl font-bold tabular-nums ${selected.net >= 0 ? "text-emerald-600" : "text-red-500"}`}>{formatRupiah(selected.net)}</p>
              <p className="text-xs text-text-muted">{selected.total_orders} total transaksi</p>
            </div>
          </div>

          {b && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Breakdown Kategori</p>
              <div className="overflow-x-auto rounded-lg border border-border/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30 bg-surface/50 text-left text-xs text-text-muted">
                      <th className="px-4 py-2.5">Kategori</th>
                      <th className="px-4 py-2.5 text-center">Item</th>
                      <th className="px-4 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    <tr><td className="px-4 py-2.5 font-medium text-text">Jual — Logam Mulia</td><td className="px-4 py-2.5 text-center">{b.jualLM.items}</td><td className="px-4 py-2.5 text-right font-semibold text-emerald-600">{formatRupiah(b.jualLM.total)}</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-text">Buyback — LM</td><td className="px-4 py-2.5 text-center">{b.buybackLM.items}</td><td className="px-4 py-2.5 text-right font-semibold text-amber-600">{formatRupiah(b.buybackLM.total)}</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-text">Buyback — Perhiasan</td><td className="px-4 py-2.5 text-center">{b.buybackPerhiasan.items}</td><td className="px-4 py-2.5 text-right font-semibold text-amber-600">{formatRupiah(b.buybackPerhiasan.total)}</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-text">Buyback — Logam Lain</td><td className="px-4 py-2.5 text-center">{b.buybackLogam.items}</td><td className="px-4 py-2.5 text-right font-semibold text-amber-600">{formatRupiah(b.buybackLogam.total)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selected.stock_snapshot && selected.stock_snapshot.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Stok Closing</p>
              <div className="overflow-x-auto rounded-lg border border-border/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30 bg-surface/50 text-left text-xs text-text-muted">
                      <th className="px-4 py-2.5">Produk</th>
                      <th className="px-4 py-2.5 text-center">Stok</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {selected.stock_snapshot.map((s) => (
                      <tr key={s.gold_type_id}>
                        <td className="px-4 py-2.5 font-medium text-text">{s.name}</td>
                        <td className="px-4 py-2.5 text-center font-bold tabular-nums">{s.qty}</td>
                        <td className="px-4 py-2.5 text-center">
                          {s.qty === 0 ? <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">Habis</span>
                          : s.qty <= s.min_qty ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Menipis</span>
                          : <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Tersedia</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Riwayat EOD */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold text-text">Riwayat Penutupan</h3>
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-white">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Omset Jual</th>
                <th className="px-4 py-3 text-right">Buyback</th>
                <th className="px-4 py-3 text-right">Net Kas</th>
                <th className="px-4 py-3 text-center">Transaksi</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {eods.map((e) => (
                <tr key={e.id} className="hover:bg-surface/30">
                  <td className="px-4 py-3 text-sm font-medium text-text">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-emerald-600">{formatRupiah(e.total_jual)}</td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-amber-600">{formatRupiah(e.total_buyback)}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums">{formatRupiah(e.net)}</td>
                  <td className="px-4 py-3 text-center text-sm text-text-muted">{e.total_orders}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelected(e)} className="rounded-lg border border-gold/40 px-3 py-1 text-xs font-medium text-gold-dark transition-colors hover:bg-gold/5">
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
              {eods.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-text-muted">Belum ada penutupan EOD.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
