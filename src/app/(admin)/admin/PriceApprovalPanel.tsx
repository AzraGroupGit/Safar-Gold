"use client";

import { useState } from "react";

interface Props {
  initialHargaDasarJual: string;
  initialAcuanBuyback: string;
  initialAdjJual: string;
  initialAdjBeli: string;
  initialAdjPerhiasan: string;
  baseGoldIdr: number;
  xauUsd: number;
  usdIdr: number;
  lastCronTime: string | null;
}

export default function PriceApprovalPanel({
  initialHargaDasarJual,
  initialAcuanBuyback,
  initialAdjJual,
  initialAdjBeli,
  initialAdjPerhiasan,
  baseGoldIdr,
  xauUsd,
  usdIdr,
  lastCronTime,
}: Props) {
  const [hargaDasar, setHargaDasar] = useState(initialHargaDasarJual);
  const [acuanBuyback, setAcuanBuyback] = useState(initialAcuanBuyback);
  const [adjJual, setAdjJual] = useState(initialAdjJual);
  const [adjBeli, setAdjBeli] = useState(initialAdjBeli);
  const [adjPerhiasan, setAdjPerhiasan] = useState(initialAdjPerhiasan);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; msg: string }>({ type: "idle", msg: "" });

  async function handlePublish() {
    setStatus({ type: "loading", msg: "Memproses..." });
    try {
      const res = await fetch("/api/admin/publish-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hargaDasarJual: parseInt(hargaDasar) || 0,
          acuanBuybackLM: parseInt(acuanBuyback) || 0,
          adjJual: parseInt(adjJual) || 0,
          adjBeli: parseInt(adjBeli) || 0,
          adjPerhiasan: parseInt(adjPerhiasan) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", msg: `Publikasi berhasil! ${data.count} harga diperbarui. Refresh halaman.` });
      } else {
        setStatus({ type: "error", msg: data.error ?? "Gagal" });
      }
    } catch {
      setStatus({ type: "error", msg: "Gagal menghubungi server" });
    }
  }

  function fmt(n: string) {
    return parseInt(n || "0").toLocaleString("id-ID");
  }

  const previewK24s = parseInt(acuanBuyback || "0") - 320000;
  const previewK24 = previewK24s - 50000;

  return (
    <div className="space-y-6">
      {/* Info internasional */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
        <h3 className="mb-1 font-serif text-lg font-semibold text-text">Informasi Pasar Hari Ini</h3>
        <p className="mb-4 text-xs text-text-muted">
          {lastCronTime ? `Auto-fetch terakhir: ${lastCronTime} WIB` : "Belum ada data cron — fetch manual saat publish"}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Emas Dunia</p>
            <p className="mt-1 text-xl font-bold text-text">${xauUsd.toLocaleString("en-US")}</p>
            <p className="text-xs text-text-muted">/ oz</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Kurs JISDOR</p>
            <p className="mt-1 text-xl font-bold text-text">Rp {usdIdr.toLocaleString("id-ID")}</p>
            <p className="text-xs text-text-muted">USD/IDR</p>
          </div>
          <div className="rounded-xl border border-border/40 bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Est. Harga Dasar</p>
            <p className="mt-1 text-xl font-bold text-gold-dark">Rp {baseGoldIdr.toLocaleString("id-ID")}</p>
            <p className="text-xs text-text-muted">/ gram</p>
          </div>
        </div>
      </div>

      {/* Acuan Safar Gold */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm">
        <h3 className="mb-1 font-serif text-lg font-semibold text-text">Acuan Harga Safar Gold</h3>
        <p className="mb-5 text-xs text-text-muted">Admin menentukan harga dasar jual & buyback</p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Harga Dasar Jual */}
          <div className="rounded-xl border border-border/40 bg-surface p-4">
            <label className="mb-2 block text-sm font-semibold text-text">
              Harga Dasar Jual LM (Rp/gram)
            </label>
            <input
              type="number"
              value={hargaDasar}
              onChange={(e) => setHargaDasar(e.target.value)}
              className="mb-2 w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm font-bold text-text focus:border-gold focus:outline-none"
            />
            <p className="text-xs text-text-muted">Harga per gram untuk LM 50gr & 100gr. Pecahan lain + premi.</p>
            <div className="mt-2">
              <label className="mb-1 block text-xs font-medium text-text-muted">Adjustment Jual (±)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range" min="-50000" max="50000" step="1000"
                  value={adjJual}
                  onChange={(e) => setAdjJual(e.target.value)}
                  className="flex-1 accent-gold"
                />
                <span className="w-24 text-right text-sm font-semibold text-gold-dark">{fmt(adjJual)}</span>
              </div>
            </div>
          </div>

          {/* Acuan Buyback LM */}
          <div className="rounded-xl border border-border/40 bg-surface p-4">
            <label className="mb-2 block text-sm font-semibold text-text">
              Acuan Buyback LM (Rp/gr, RM 1-2)
            </label>
            <input
              type="number"
              value={acuanBuyback}
              onChange={(e) => setAcuanBuyback(e.target.value)}
              className="mb-2 w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm font-bold text-text focus:border-gold focus:outline-none"
            />
            <p className="text-xs text-text-muted">Harga buyback ANTAM Certi RM 1-2gr. Kategori lain dihitung otomatis.</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Adjustment Buyback</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="-50000" max="50000" step="1000" value={adjBeli} onChange={(e) => setAdjBeli(e.target.value)} className="flex-1 accent-gold" />
                  <span className="w-20 text-right text-sm font-semibold text-gold-dark">{fmt(adjBeli)}</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Adj. Perhiasan</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="-50000" max="50000" step="1000" value={adjPerhiasan} onChange={(e) => setAdjPerhiasan(e.target.value)} className="flex-1 accent-gold" />
                  <span className="w-20 text-right text-sm font-semibold text-gold-dark">{fmt(adjPerhiasan)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-5 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/3 to-transparent p-4">
          <p className="mb-2 text-sm font-semibold text-text">Preview Perhiasan</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-text-muted">K24*: <strong className="text-gold-dark">{previewK24s.toLocaleString("id-ID")}</strong></span>
            <span className="text-text-muted">K24: <strong className="text-gold-dark">{previewK24.toLocaleString("id-ID")}</strong></span>
            <span className="text-text-muted">K18: <strong className="text-gold-dark">{Math.round((parseInt(acuanBuyback || "0") - 505000 + parseInt(adjPerhiasan || "0")) * 0.75).toLocaleString("id-ID")}</strong></span>
            <span className="text-text-muted">K10: <strong className="text-gold-dark">{Math.round((parseInt(acuanBuyback || "0") - 505000 + parseInt(adjPerhiasan || "0")) * 0.4167).toLocaleString("id-ID")}</strong></span>
          </div>
        </div>

        {/* Publish + Status */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handlePublish}
            disabled={status.type === "loading"}
            className="gold-gradient-bg rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-gold/25 transition-all hover:shadow-xl hover:shadow-gold/30 disabled:opacity-60"
          >
            {status.type === "loading" ? "Memproses..." : "Publikasikan"}
          </button>
          {status.msg && (
            <span className={`text-sm font-medium ${status.type === "success" ? "text-green-600" : status.type === "error" ? "text-red-500" : "text-text-muted"}`}>
              {status.type === "loading" && (
                <span className="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              )}
              {status.msg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
