"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { calculateChangePercent, type AnalyticsGrain, type AnalyticsMetrics, type AnalyticsResult } from "@/lib/analytics";
import { formatRupiah } from "@/lib/gold-api";
import AnalyticsCharts from "./AnalyticsCharts";
import { CustomerSourceAnalytics, StockAnalytics } from "./OperationalAnalytics";
import { AnalyticsKpiCard, AnalyticsSkeleton, SummaryStrip } from "./AnalyticsUI";
import CsTeamAnalytics from "./CsTeamAnalytics";

type AnalyticsResponse = { range: { from: string; to: string; grain: AnalyticsGrain }; previousRange: { from: string; to: string }; current: AnalyticsResult; previous: AnalyticsResult };
type Preset = "today" | "week" | "month" | "year" | "custom";
type AnalyticsTab = "finance" | "stock" | "customers" | "cs-team";

function dateInWib() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
function addDays(date: string, days: number) { const parsed = new Date(`${date}T00:00:00Z`); parsed.setUTCDate(parsed.getUTCDate() + days); return parsed.toISOString().slice(0, 10); }
function presetRange(preset: Exclude<Preset, "custom">) {
  const today = dateInWib();
  if (preset === "week") return { from: addDays(today, -6), to: today, grain: "day" as AnalyticsGrain };
  if (preset === "month") return { from: `${today.slice(0, 7)}-01`, to: today, grain: "day" as AnalyticsGrain };
  if (preset === "year") return { from: `${today.slice(0, 4)}-01-01`, to: today, grain: "month" as AnalyticsGrain };
  return { from: today, to: today, grain: "day" as AnalyticsGrain };
}

function Change({ current, previous }: { current: number; previous: number }) {
  const change = calculateChangePercent(current, previous);
  if (change === null) return <span className="text-text-light">Belum dapat dibandingkan</span>;
  const rising = change >= 0;
  return <span className={rising ? "text-emerald-700" : "text-red-600"}>{rising ? "▲" : "▼"} {Math.abs(change).toLocaleString("id-ID", { maximumFractionDigits: 1 })}% dari periode lalu</span>;
}

export default function AnalyticsClient() {
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const tab: AnalyticsTab = requestedTab === "stock" || requestedTab === "customers" || requestedTab === "cs-team" ? requestedTab : "finance";
  const [preset, setPreset] = useState<Preset>("month");
  const [range, setRange] = useState(() => presetRange("month"));
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tab !== "finance") return;
    const controller = new AbortController();
    fetch(`/api/admin/analytics?from=${range.from}&to=${range.to}&grain=${range.grain}`, { signal: controller.signal })
      .then(async response => { const body = await response.json(); if (!response.ok) throw new Error(response.status === 403 ? "Analitik keuangan hanya dapat diakses oleh admin." : body.error || "Gagal memuat analitik."); return body; })
      .then(setData)
      .catch(fetchError => { if (fetchError.name !== "AbortError") setError(fetchError.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [range, tab]);

  function chooseTab(next: AnalyticsTab) { const params = new URLSearchParams(searchParams.toString()); if (next === "finance") params.delete("tab"); else params.set("tab", next); const query = params.toString(); router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }); }
  function updateRange(next: typeof range) { setLoading(true); setError(""); setRange(next); }
  function choosePreset(value: Exclude<Preset, "custom">) { setPreset(value); updateRange(presetRange(value)); }

  const metrics: AnalyticsMetrics | undefined = data?.current.metrics;
  const previous: AnalyticsMetrics | undefined = data?.previous.metrics;
  const periodLabel = `${new Date(`${range.from}T00:00:00`).toLocaleDateString("id-ID")} – ${new Date(`${range.to}T00:00:00`).toLocaleDateString("id-ID")}`;

  return <div>
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-gold-dark">Business intelligence</p><h1 className="font-serif text-2xl font-semibold tracking-tight text-text">Analitik</h1><p className="mt-1 text-sm text-text-muted">Keuangan, persediaan, dan akuisisi pelanggan · WIB</p></div>
      <div className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-dark"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold" />{periodLabel}</div>
    </header>

    <nav aria-label="Kategori analitik" className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-border/60 bg-white p-1.5">
      {([{ key: "finance", label: "Keuangan" }, { key: "stock", label: "Stok" }, { key: "customers", label: "Sumber Pelanggan" }, { key: "cs-team", label: "Performa CS" }] as const).map(item => <button type="button" key={item.key} onClick={() => chooseTab(item.key)} aria-current={tab === item.key ? "page" : undefined} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${tab === item.key ? "bg-sidebar text-gold-light" : "text-text-muted hover:bg-surface hover:text-text"}`}>{item.label}</button>)}
    </nav>

    <section aria-label="Filter periode" className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-border/60 bg-white p-4">
      <div className="mr-auto"><p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Rentang analisis</p><p className="mt-1 text-[11px] text-text-light">Data mengikuti periode dan zona waktu WIB.</p></div>
      <div className="flex flex-wrap gap-1 rounded-lg bg-surface p-1">
        {([{ key: "today", label: "Hari ini" }, { key: "week", label: "7 hari" }, { key: "month", label: "Bulan ini" }, { key: "year", label: "Tahun ini" }] as const).map(item => <button type="button" key={item.key} onClick={() => choosePreset(item.key)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${preset === item.key ? "border-border/60 bg-white text-gold-dark" : "border-transparent text-text-muted hover:text-text"}`}>{item.label}</button>)}
      </div>
      <label className="text-xs font-medium text-text-muted">Dari<input type="date" value={range.from} max={range.to} onChange={event => { setPreset("custom"); updateRange({ ...range, from: event.target.value }); }} className="mt-1 block rounded-lg border border-border/60 px-3 py-2 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></label>
      <label className="text-xs font-medium text-text-muted">Sampai<input type="date" value={range.to} min={range.from} onChange={event => { setPreset("custom"); updateRange({ ...range, to: event.target.value }); }} className="mt-1 block rounded-lg border border-border/60 px-3 py-2 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></label>
      <label className="text-xs font-medium text-text-muted">Tampilan<select value={range.grain} onChange={event => updateRange({ ...range, grain: event.target.value as AnalyticsGrain })} className="mt-1 block rounded-lg border border-border/60 bg-white px-3 py-2 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"><option value="day">Harian</option><option value="week">Mingguan</option><option value="month">Bulanan</option></select></label>
    </section>

    {tab === "finance" && error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}
    {tab === "finance" && loading && <AnalyticsSkeleton />}
    {tab === "finance" && !loading && data && metrics && previous && <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AnalyticsKpiCard label="Omzet Penjualan" value={formatRupiah(metrics.omzet)} note="Order jual selesai" footer={<Change current={metrics.omzet} previous={previous.omzet} />} tone="gold" />
        <AnalyticsKpiCard label="Pembelian / Buyback" value={formatRupiah(metrics.buyback)} note="Dana pembelian persediaan" footer={<Change current={metrics.buyback} previous={previous.buyback} />} tone="amber" />
        <AnalyticsKpiCard label="Arus Bersih" value={formatRupiah(metrics.transactionNet)} note="Omzet dikurangi buyback" footer={<Change current={metrics.transactionNet} previous={previous.transactionNet} />} />
        <AnalyticsKpiCard label="Gross Profit" value={formatRupiah(metrics.grossProfit)} note="Total GP yang tercatat" footer={<Change current={metrics.grossProfit} previous={previous.grossProfit} />} tone="green" />
        <AnalyticsKpiCard label="GP Margin" value={metrics.gpMarginPercent === null ? "—" : `${metrics.gpMarginPercent.toLocaleString("id-ID")}%`} note="GP dibanding omzet" footer={<Change current={metrics.gpMarginPercent ?? 0} previous={previous.gpMarginPercent ?? 0} />} tone="gold" />
      </div>
      <SummaryStrip items={[{ label: "Total transaksi", value: metrics.orderCount.toLocaleString("id-ID"), note: `${metrics.sellOrderCount} jual · ${metrics.buybackOrderCount} buyback` }, { label: "Rata-rata nilai transaksi", value: formatRupiah(metrics.averageOrderValue), note: "Seluruh transaksi dalam periode" }, { label: "Kelengkapan data GP", value: `${metrics.gpCoveragePercent.toLocaleString("id-ID")}%`, note: `${metrics.gpRecordedOrders} dari ${metrics.orderCount} order memiliki GP` }]} />
      <AnalyticsCharts data={data.current} />
    </div>}
    {tab === "stock" && <StockAnalytics range={range} />}
    {tab === "customers" && <CustomerSourceAnalytics range={range} />}
    {tab === "cs-team" && <CsTeamAnalytics key={`${range.from}-${range.to}-${range.grain}`} range={range} />}
  </div>;
}
