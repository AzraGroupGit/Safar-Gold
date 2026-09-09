"use client";

import { useEffect, useState } from "react";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip, type ChartOptions } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import type { AnalyticsGrain } from "@/lib/analytics";
import type { CsActivityResult } from "@/lib/cs-performance";
import { AnalyticsEmptyState, AnalyticsKpiCard, AnalyticsPanel, AnalyticsSkeleton, chartColors, StatusBadge, SummaryStrip } from "../analitik/AnalyticsUI";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip);
type Preset = "today" | "week" | "month" | "year" | "custom";
type Range = { from: string; to: string; grain: AnalyticsGrain };
type Response = { range: Range; current: CsActivityResult; previous: CsActivityResult };

const wibToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
function addDays(date: string, days: number) { const value = new Date(`${date}T00:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10); }
function presetRange(preset: Exclude<Preset, "custom">): Range { const today = wibToday(); if (preset === "week") return { from: addDays(today, -6), to: today, grain: "day" }; if (preset === "month") return { from: `${today.slice(0, 7)}-01`, to: today, grain: "day" }; if (preset === "year") return { from: `${today.slice(0, 4)}-01-01`, to: today, grain: "month" }; return { from: today, to: today, grain: "day" }; }
function change(current: number, previous: number) { if (!previous) return "Belum dapat dibandingkan"; const value = ((current - previous) / Math.abs(previous)) * 100; return `${value >= 0 ? "▲" : "▼"} ${Math.abs(value).toLocaleString("id-ID", { maximumFractionDigits: 1 })}% dari periode lalu`; }

const chartOptions: ChartOptions<"bar"> = { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" }, animation: { duration: 350 }, plugins: { legend: { position: "bottom", labels: { color: chartColors.muted, usePointStyle: true, boxWidth: 7, padding: 18 } }, tooltip: { backgroundColor: "#ffffff", titleColor: chartColors.ink, bodyColor: chartColors.muted, borderColor: "#e8e4d8", borderWidth: 1, padding: 12 } }, scales: { x: { stacked: true, border: { display: false }, grid: { display: false }, ticks: { color: chartColors.muted, maxRotation: 0, maxTicksLimit: 9 } }, y: { stacked: true, beginAtZero: true, border: { display: false }, grid: { color: chartColors.grid }, ticks: { color: chartColors.muted, precision: 0 } } } };

export default function CsPerformanceClient() {
  const [preset, setPreset] = useState<Preset>("month");
  const [range, setRange] = useState<Range>(() => presetRange("month"));
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/cs-performance?from=${range.from}&to=${range.to}&grain=${range.grain}`, { signal: controller.signal })
      .then(async response => { const body = await response.json(); if (!response.ok) throw new Error(response.status === 403 ? "Dashboard ini hanya dapat diakses oleh CS." : body.error || "Gagal memuat performa."); return body as Response; })
      .then(result => { setData(result); setError(""); })
      .catch(fetchError => { if (fetchError.name !== "AbortError") setError(fetchError.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [range]);

  function updateRange(next: Range) { setLoading(true); setError(""); setRange(next); }
  function choosePreset(next: Exclude<Preset, "custom">) { setPreset(next); updateRange(presetRange(next)); }
  const periodLabel = `${new Date(`${range.from}T00:00:00`).toLocaleDateString("id-ID")} – ${new Date(`${range.to}T00:00:00`).toLocaleDateString("id-ID")}`;

  return <div>
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-gold-dark">Personal workspace</p><h1 className="font-serif text-2xl font-semibold tracking-tight text-text">Performa Saya</h1><p className="mt-1 text-sm text-text-muted">Ringkasan order yang Anda buat · WIB</p></div><div className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-dark"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold" />{periodLabel}</div></header>
    <section aria-label="Filter periode" className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-border/60 bg-white p-4"><div className="mr-auto"><p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Rentang performa</p><p className="mt-1 text-[11px] text-text-light">Statistik hanya berasal dari order yang Anda buat.</p></div><div className="flex flex-wrap gap-1 rounded-lg bg-surface p-1">{([{ key: "today", label: "Hari ini" }, { key: "week", label: "7 hari" }, { key: "month", label: "Bulan ini" }, { key: "year", label: "Tahun ini" }] as const).map(item => <button type="button" key={item.key} onClick={() => choosePreset(item.key)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${preset === item.key ? "border-border/60 bg-white text-gold-dark" : "border-transparent text-text-muted hover:text-text"}`}>{item.label}</button>)}</div><label className="text-xs font-medium text-text-muted">Dari<input type="date" value={range.from} max={range.to} onChange={event => { setPreset("custom"); updateRange({ ...range, from: event.target.value }); }} className="mt-1 block rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></label><label className="text-xs font-medium text-text-muted">Sampai<input type="date" value={range.to} min={range.from} onChange={event => { setPreset("custom"); updateRange({ ...range, to: event.target.value }); }} className="mt-1 block rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></label><label className="text-xs font-medium text-text-muted">Tampilan<select value={range.grain} onChange={event => updateRange({ ...range, grain: event.target.value as AnalyticsGrain })} className="mt-1 block rounded-lg border border-border/60 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"><option value="day">Harian</option><option value="week">Mingguan</option><option value="month">Bulanan</option></select></label></section>
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}
    {loading && <AnalyticsSkeleton cards={4} />}
    {!loading && data && <Dashboard data={data} />}
  </div>;
}

function Dashboard({ data }: { data: Response }) {
  const current = data.current; const previous = data.previous; const m = current.metrics;
  return <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><AnalyticsKpiCard label="Order Dibuat" value={m.totalOrders.toLocaleString("id-ID")} note="Seluruh status dalam periode" footer={change(m.totalOrders, previous.metrics.totalOrders)} tone="gold" /><AnalyticsKpiCard label="Order Selesai" value={m.completedOrders.toLocaleString("id-ID")} note="Berhasil diselesaikan" footer={change(m.completedOrders, previous.metrics.completedOrders)} tone="green" /><AnalyticsKpiCard label="Order Dibatalkan" value={m.cancelledOrders.toLocaleString("id-ID")} note="Tidak masuk performa selesai" footer={change(m.cancelledOrders, previous.metrics.cancelledOrders)} tone={m.cancelledOrders ? "red" : "green"} /><AnalyticsKpiCard label="Completion Rate" value={`${m.completionRate}%`} note="Order selesai dari seluruh order" footer={change(m.completionRate, previous.metrics.completionRate)} tone="gold" /></div>
    <SummaryStrip items={[{ label: "Order jual", value: m.sellOrders.toLocaleString("id-ID"), note: "Order jual yang selesai" }, { label: "Order buyback", value: m.buybackOrders.toLocaleString("id-ID"), note: "Order buyback yang selesai" }, { label: "Volume selesai", value: `${m.itemCount.toLocaleString("id-ID")} item · ${m.totalWeight.toLocaleString("id-ID")}g`, note: "Akumulasi item dan berat dari order selesai" }]} />
    <div className="grid gap-4 xl:grid-cols-12"><AnalyticsPanel className="xl:col-span-8" height="h-80" eyebrow="Aktivitas" title="Tren Order" subtitle="Order selesai dan dibatalkan pada setiap periode.">{current.trend.length ? <Bar options={chartOptions} data={{ labels: current.trend.map(item => item.key), datasets: [{ label: "Selesai", data: current.trend.map(item => item.completed), backgroundColor: chartColors.green, borderRadius: 3 }, { label: "Dibatalkan", data: current.trend.map(item => item.cancelled), backgroundColor: chartColors.red, borderRadius: 3 }] }} /> : <AnalyticsEmptyState />}</AnalyticsPanel><AnalyticsPanel className="xl:col-span-4" height="h-80" title="Komposisi Order" subtitle="Perbandingan order jual dan buyback yang selesai.">{m.completedOrders ? <Doughnut options={{ responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { position: "bottom", labels: { color: chartColors.muted, usePointStyle: true, boxWidth: 8, padding: 16 } } } }} data={{ labels: ["Jual", "Buyback"], datasets: [{ data: [m.sellOrders, m.buybackOrders], backgroundColor: [chartColors.gold, chartColors.ink], borderWidth: 0, spacing: 3 }] }} /> : <AnalyticsEmptyState />}</AnalyticsPanel></div>
    <section className="overflow-hidden rounded-xl border border-border/60 bg-white"><div className="p-5"><h2 className="font-serif text-lg font-semibold text-text">Riwayat Order Saya</h2><p className="mt-1 text-xs text-text-muted">20 order terbaru pada periode terpilih.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead className="bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><tr><th className="px-5 py-3">Tanggal</th><th className="px-4 py-3">Nomor Order</th><th className="px-4 py-3">Pelanggan</th><th className="px-4 py-3">Tipe</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-border/30">{current.recentOrders.map(order => <tr key={order.id}><td className="px-5 py-3.5 tabular-nums text-text-muted">{new Date(order.created_at).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" })}</td><td className="px-4 py-3 font-medium text-text">{order.order_number}</td><td className="px-4 py-3">{order.customer_name}</td><td className="px-4 py-3">{order.type === "sell" ? "Jual" : "Buyback"}</td><td className="px-5 py-3"><StatusBadge tone={order.status === "completed" ? "green" : "red"}>{order.status === "completed" ? "Selesai" : "Dibatalkan"}</StatusBadge></td></tr>)}{!current.recentOrders.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-text-muted">Belum ada order pada periode ini.</td></tr>}</tbody></table></div></section>
  </div>;
}
