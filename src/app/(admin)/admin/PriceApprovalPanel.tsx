"use client";

import { useState, useRef } from "react";
import PricePreviewModal from "@/components/PricePreviewModal";

interface Props {
  initialHargaDasarJual: string;
  initialAcuanBuyback: string;
  initialAdjJual: string;
  initialAdjBeli: string;
  initialAdjPerhiasan: string;
  initialPersenBuybackPerhiasan: string;
  baseGoldIdr: number;
  xauUsd: number;
  usdIdr: number;
  lastCronTime: string | null;
  suggestedJual: number | null;
  suggestedBuyback: number | null;
  initialAntamPrice: string;
  initialAntamPricePrev: string;
  initialGlobalGoldPrice: string;
  initialGlobalGoldPricePrev: string;
}

type PreviewPriceItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: number | null;
  karat: number | null;
  isTotalPrice?: boolean;
};

export default function PriceApprovalPanel({
  initialHargaDasarJual,
  initialAcuanBuyback,
  initialAdjJual,
  initialAdjBeli,
  initialAdjPerhiasan,
  initialPersenBuybackPerhiasan,
  baseGoldIdr,
  xauUsd,
  usdIdr,
  lastCronTime,
  suggestedJual,
  suggestedBuyback,
  initialAntamPrice,
  initialAntamPricePrev,
  initialGlobalGoldPrice,
  initialGlobalGoldPricePrev,
}: Props) {
  const [hargaDasar, setHargaDasar] = useState(initialHargaDasarJual);
  const [acuanBuyback, setAcuanBuyback] = useState(initialAcuanBuyback);
  const [adjJual, setAdjJual] = useState(initialAdjJual);
  const [adjBeli, setAdjBeli] = useState(initialAdjBeli);
  const [adjPerhiasan] = useState(initialAdjPerhiasan);
  const [persenBuybackPerhiasan, setPersenBuybackPerhiasan] = useState(
    initialPersenBuybackPerhiasan,
  );
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    msg: string;
  }>({ type: "idle", msg: "" });
  const [fetchStatus, setFetchStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    msg: string;
  }>({ type: "idle", msg: "" });
  const [antamPrice, setAntamPrice] = useState(initialAntamPrice);
  const [globalGoldPrice, setGlobalGoldPrice] = useState(
    initialGlobalGoldPrice,
  );
  const savedAntamRef = useRef(initialAntamPrice);
  const prevAntamRef = useRef(initialAntamPricePrev);
  const savedGlobalRef = useRef(initialGlobalGoldPrice);
  const prevGlobalRef = useRef(initialGlobalGoldPricePrev);
  const [antamSaveStatus, setAntamSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [globalSaveStatus, setGlobalSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");

  const [previewItems, setPreviewItems] = useState<PreviewPriceItem[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  async function handleOpenPreview() {
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/admin/preview-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hargaDasarJual: parseInt(hargaDasar) || 0,
          acuanBuybackLM: parseInt(acuanBuyback) || 0,
          adjJual: parseInt(adjJual) || 0,
          adjBeli: parseInt(adjBeli) || 0,
          persenBuybackPerhiasan: parseFloat(persenBuybackPerhiasan) || 81,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewItems(data.items ?? []);
        setShowPreviewModal(true);
      }
    } finally {
      setPreviewLoading(false);
    }
  }

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
          persenBuybackPerhiasan: parseFloat(persenBuybackPerhiasan) || 81,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({
          type: "success",
          msg: `Publikasi berhasil! ${data.count} harga diperbarui. Refresh halaman.`,
        });
      } else {
        setStatus({ type: "error", msg: data.error ?? "Gagal" });
      }
    } catch {
      setStatus({ type: "error", msg: "Gagal menghubungi server" });
    }
  }

  async function handleFetchAcuan() {
    setFetchStatus({ type: "loading", msg: "Fetching..." });
    try {
      const res = await fetch("/api/cron/update-prices?force=true");
      const data = await res.json();
      if (data.success) {
        setFetchStatus({
          type: "success",
          msg: `OK! XAU $${data.xauUsdPerOz}, JISDOR Rp ${data.usdIdrRate.toLocaleString("id-ID")}. Refresh.`,
        });
      } else {
        setFetchStatus({ type: "error", msg: data.error ?? "Gagal" });
      }
    } catch {
      setFetchStatus({ type: "error", msg: "Gagal fetch" });
    }
  }

  async function handleSaveAntamPrice(value: string) {
    const cleaned = cleanNumber(value);
    if (cleaned === savedAntamRef.current) return;
    let prevValue = parseInt(cleanNumber(prevAntamRef.current)) || 0;
    if (prevValue <= 0) prevValue = parseInt(savedAntamRef.current) || 0;
    setAntamSaveStatus("saving");
    try {
      await fetch("/api/admin/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            antam_price_prev: String(prevValue),
            antam_price: cleaned,
          },
        }),
      });
      savedAntamRef.current = cleaned;
      prevAntamRef.current = String(prevValue);
      setAntamSaveStatus("saved");
      setTimeout(() => setAntamSaveStatus("idle"), 2000);
    } catch {
      setAntamSaveStatus("idle");
    }
  }

  async function handleScrapeAntam() {
    setScraping(true);
    setScrapeError("");
    try {
      const res = await fetch("/api/cron/scrape-antam", { method: "POST" });
      const data = await res.json();
      if (data.success && data.antamPrice > 0) {
        setAntamPrice(String(data.antamPrice));
        handleSaveAntamPrice(String(data.antamPrice));
      } else {
        setScrapeError(data.error ?? "Gagal scrape");
      }
    } catch {
      setScrapeError("Gagal menghubungi server");
    } finally {
      setScraping(false);
    }
  }

  async function handleSaveGlobalGoldPrice(value: string) {
    const cleaned = cleanNumber(value);
    if (cleaned === savedGlobalRef.current) return;
    let prevValue = parseInt(cleanNumber(prevGlobalRef.current)) || 0;
    if (prevValue <= 0) prevValue = parseInt(savedGlobalRef.current) || 0;
    if (prevValue <= 0 && baseGoldIdr > 0) prevValue = Math.round(baseGoldIdr);
    setGlobalSaveStatus("saving");
    try {
      await fetch("/api/admin/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            global_gold_price_prev: String(prevValue),
            global_gold_price: cleaned,
          },
        }),
      });
      savedGlobalRef.current = cleaned;
      prevGlobalRef.current = String(prevValue);
      setGlobalSaveStatus("saved");
      setTimeout(() => setGlobalSaveStatus("idle"), 2000);
    } catch {
      setGlobalSaveStatus("idle");
    }
  }

  function addDots(n: string) {
    const clean = n.replace(/\D/g, "");
    if (!clean) return "";
    return parseInt(clean, 10).toLocaleString("id-ID");
  }

  function cleanNumber(n: string) {
    return n.replace(/\D/g, "");
  }

  // Signed variants for ± adjustment fields (allow a leading minus).
  function cleanSigned(n: string) {
    const neg = n.trim().startsWith("-");
    const digits = n.replace(/\D/g, "");
    if (!digits) return neg ? "-" : "";
    return (neg ? "-" : "") + digits;
  }

  function addDotsSigned(n: string) {
    const neg = n.trim().startsWith("-");
    const digits = n.replace(/\D/g, "");
    if (!digits) return neg ? "-" : "";
    return (neg ? "-" : "") + parseInt(digits, 10).toLocaleString("id-ID");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1 font-serif text-lg font-semibold text-text">
              Informasi Pasar Hari Ini
            </h3>
            <p className="text-xs text-text-muted">
              {lastCronTime
                ? `Auto-fetch terakhir: ${lastCronTime} WIB`
                : "Belum ada data cron — refresh manual"}
            </p>
          </div>
          <button
            onClick={handleFetchAcuan}
            disabled={fetchStatus.type === "loading"}
            className="flex items-center gap-2 rounded-lg border border-gold/40 px-4 py-2 text-sm font-semibold text-gold-dark transition-colors hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <svg
              className={`h-4 w-4 ${fetchStatus.type === "loading" ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
              />
            </svg>
            {fetchStatus.type === "loading"
              ? "Memuat..."
              : "Refresh Data Pasar"}
          </button>
        </div>
        {fetchStatus.msg && (
          <p
            className={`mt-2 text-xs ${fetchStatus.type === "success" ? "text-green-600" : fetchStatus.type === "error" ? "text-red-500" : ""}`}
          >
            {fetchStatus.msg}
          </p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/40 bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Emas Dunia
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-text">
              ${xauUsd.toLocaleString("en-US")}
            </p>
            <p className="text-xs text-text-muted">/ oz</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Kurs JISDOR
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-text">
              Rp {usdIdr.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-text-muted">USD/IDR</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Est. Harga Dasar
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-gold-dark">
              Rp {baseGoldIdr.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-text-muted">/ gram</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gold/20 bg-white p-6">
        <h3 className="mb-1 font-serif text-lg font-semibold text-text">
          Acuan Harga Safar Gold
        </h3>
        <p className="mb-5 text-xs text-text-muted">
          Admin menentukan harga dasar jual & buyback
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border/40 bg-surface p-4">
            <label className="mb-2 block text-sm font-semibold text-text">
              Harga Dasar Jual LM (Rp/gram)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={addDots(hargaDasar)}
              onChange={(e) => setHargaDasar(cleanNumber(e.target.value))}
              className="mb-2 w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm font-bold text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
            <p className="text-xs text-text-muted">
              Harga per gram untuk LM 50gr & 100gr. Pecahan lain + premi.
            </p>
            <div className="mt-1 space-y-0.5">
              <p className="flex items-center gap-2 text-xs text-gold-dark">
                <span>
                  Intl +3% = Rp{" "}
                  {Math.round(baseGoldIdr * 1.03).toLocaleString("id-ID")}
                </span>
                {parseInt(hargaDasar) !== Math.round(baseGoldIdr * 1.03) && (
                  <button
                    onClick={() =>
                      setHargaDasar(String(Math.round(baseGoldIdr * 1.03)))
                    }
                    className="inline-flex items-center justify-center rounded-md border border-gold/30 p-0.5 text-gold-dark hover:bg-gold/10"
                    title="Kembali ke rekomendasi"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                      />
                    </svg>
                  </button>
                )}
              </p>
              {suggestedJual && (
                <p className="flex items-center gap-2 text-xs text-gold-dark">
                  <span>
                    Median 30-hari = Rp {suggestedJual.toLocaleString("id-ID")}
                  </span>
                  {parseInt(hargaDasar) !== suggestedJual && (
                    <button
                      onClick={() => setHargaDasar(String(suggestedJual))}
                      className="inline-flex items-center justify-center rounded-md border border-gold/30 p-0.5 text-gold-dark hover:bg-gold/10"
                      title="Gunakan median historis"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                        />
                      </svg>
                    </button>
                  )}
                </p>
              )}
            </div>
            <div className="mt-2">
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Adjustment Jual (±)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={addDotsSigned(adjJual)}
                onChange={(e) => setAdjJual(cleanSigned(e.target.value))}
                className="w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm font-semibold text-gold-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border/40 bg-surface p-4">
            <label className="mb-2 block text-sm font-semibold text-text">
              Acuan Buyback LM (Rp/gr, RM 1-2)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={addDots(acuanBuyback)}
              onChange={(e) => setAcuanBuyback(cleanNumber(e.target.value))}
              className="mb-2 w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm font-bold text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
            <p className="text-xs text-text-muted">
              Harga buyback ANTAM Certi RM 1-2gr. Kategori lain dihitung
              otomatis.
            </p>
            <div className="mt-1 space-y-0.5">
              <p className="flex items-center gap-2 text-xs text-gold-dark">
                <span>
                  Intl −3% = Rp{" "}
                  {Math.round(baseGoldIdr * 0.97).toLocaleString("id-ID")}
                </span>
                {parseInt(acuanBuyback) !== Math.round(baseGoldIdr * 0.97) && (
                  <button
                    onClick={() =>
                      setAcuanBuyback(String(Math.round(baseGoldIdr * 0.97)))
                    }
                    className="inline-flex items-center justify-center rounded-md border border-gold/30 p-0.5 text-gold-dark hover:bg-gold/10"
                    title="Kembali ke rekomendasi"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                      />
                    </svg>
                  </button>
                )}
              </p>
              {suggestedBuyback && (
                <p className="flex items-center gap-2 text-xs text-gold-dark">
                  <span>
                    Median 30-hari = Rp{" "}
                    {suggestedBuyback.toLocaleString("id-ID")}
                  </span>
                  {parseInt(acuanBuyback) !== suggestedBuyback && (
                    <button
                      onClick={() => setAcuanBuyback(String(suggestedBuyback))}
                      className="inline-flex items-center justify-center rounded-md border border-gold/30 p-0.5 text-gold-dark hover:bg-gold/10"
                      title="Gunakan median historis"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                        />
                      </svg>
                    </button>
                  )}
                </p>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Adjustment Buyback
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={addDotsSigned(adjBeli)}
                  onChange={(e) => setAdjBeli(cleanSigned(e.target.value))}
                  className="w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm font-semibold text-gold-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div>
              {/* <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Adj. Perhiasan</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={addDotsSigned(adjPerhiasan)}
                  onChange={(e) => setAdjPerhiasan(cleanSigned(e.target.value))}
                  className="w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm font-semibold text-gold-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div> */}
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Persen Buyback Perhiasan (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  value={persenBuybackPerhiasan}
                  onChange={(e) => setPersenBuybackPerhiasan(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm font-semibold text-gold-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
                <p className="mt-1 text-[10px] text-text-muted">
                  Margin buyback perhiasan K6–K22
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-white p-6">
        <h3 className="mb-1 font-serif text-lg font-semibold text-text">
          Tampilan Harga di Homepage
        </h3>
        <p className="mb-5 text-xs text-text-muted">
          Harga yang muncul di kartu bagian bawah Hero. Tidak memengaruhi
          perhitungan harga jual/buyback.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/40 bg-surface p-4">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Emas Dunia (Rp/gram)
            </label>
            <p className="mb-1 text-[11px] text-text-muted">
              Biarkan kosong untuk gunakan harga otomatis dari data live
            </p>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={addDots(globalGoldPrice)}
                onChange={(e) =>
                  setGlobalGoldPrice(cleanNumber(e.target.value))
                }
                onBlur={(e) => handleSaveGlobalGoldPrice(e.target.value)}
                placeholder="Kosong = auto"
                className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm font-bold text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              />
              {globalSaveStatus !== "idle" && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-600">
                  {globalSaveStatus === "saving" ? "..." : "✓"}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-border/40 bg-surface p-4">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Emas Antam (Rp/gram)
            </label>
            <p className="mb-1 text-[11px] text-text-muted">
              Harga diisi otomatis dari scraping logammulia.com (06:00). Gunakan
              ikon refresh untuk scrape manual. Mengosongkan field akan
              menampilkan &quot;-&quot;.
            </p>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={addDots(antamPrice)}
                onChange={(e) => setAntamPrice(cleanNumber(e.target.value))}
                onBlur={(e) => handleSaveAntamPrice(e.target.value)}
                placeholder="Masukkan harga"
                className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 pr-10 text-sm font-bold text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              />
              <button
                type="button"
                onClick={handleScrapeAntam}
                disabled={scraping}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted transition-colors hover:text-gold-dark disabled:opacity-50"
                title="Scrape dari logammulia.com"
              >
                {scraping ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : antamSaveStatus !== "idle" ? (
                  <span className="text-xs text-green-600">✓</span>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                    />
                  </svg>
                )}
              </button>
            </div>
            {scrapeError && (
              <p className="mt-1 text-[11px] text-red-500">{scrapeError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 px-6 pb-6">
        <button
          onClick={handleOpenPreview}
          disabled={previewLoading}
          className="rounded-lg border border-gold/40 px-6 py-3 text-sm font-semibold text-gold-dark transition-colors hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {previewLoading ? "Memuat..." : "Preview Harga"}
        </button>
        <button
          onClick={handlePublish}
          disabled={status.type === "loading"}
          className="rounded-lg bg-gold px-8 py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {status.type === "loading" ? "Memproses..." : "Publikasikan"}
        </button>
        {status.msg && (
          <span
            className={`mr-auto text-sm font-medium ${status.type === "success" ? "text-green-600" : status.type === "error" ? "text-red-500" : "text-text-muted"}`}
          >
            {status.type === "loading" && (
              <span className="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            )}
            {status.msg}
          </span>
        )}
      </div>

      <PricePreviewModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        items={previewItems}
      />
    </div>
  );
}
