"use client";

import { useEffect, useState } from "react";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip, type ChartOptions } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import type { AnalyticsGrain } from "@/lib/analytics";
import { formatChartDateLabel, formatCompactNumber } from "@/lib/analytics-chart-theme";
import { formatRupiah } from "@/lib/gold-api";
import type { CustomerSourceAnalyticsResult, StockAnalyticsResult } from "@/lib/operational-analytics";
import { AnalyticsEmptyState, AnalyticsKpiCard, AnalyticsPanel, AnalyticsSkeleton, ChartInsight, chartColors, StatusBadge, SummaryStrip } from "./AnalyticsUI";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip);
export type AnalyticsRange = { from: string; to: string; grain: AnalyticsGrain };

const baseTooltip = { backgroundColor: "#fffdf8", titleColor: chartColors.ink, bodyColor: chartColors.muted, borderColor: "#e8e0cf", borderWidth: 1, padding: 13, cornerRadius: 8 } as const;
const lineOptions: ChartOptions<"line"> = { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" }, animation: { duration: 400 }, plugins: { legend: { position: "bottom", labels: { color: chartColors.muted, usePointStyle: true, boxWidth: 7, padding: 18 } }, tooltip: { ...baseTooltip, callbacks: { title: items => formatChartDateLabel(items[0]?.label ?? "") } } }, scales: { x: { border: { display: false }, grid: { display: false }, ticks: { color: chartColors.muted, maxRotation: 0, maxTicksLimit: 9, callback(_value, index) { return formatChartDateLabel(this.getLabelForValue(index)); } } }, y: { beginAtZero: true, border: { display: false }, grid: { color: chartColors.grid }, ticks: { color: chartColors.muted, precision: 0 } } } };
const horizontalOptions: ChartOptions<"bar"> = { responsive: true, maintainAspectRatio: false, indexAxis: "y", animation: { duration: 350 }, plugins: { legend: { display: false }, tooltip: baseTooltip }, scales: { x: { beginAtZero: true, border: { display: false }, grid: { color: chartColors.grid }, ticks: { color: chartColors.muted } }, y: { border: { display: false }, grid: { display: false }, ticks: { color: chartColors.muted } } } };
const moneyOptions: ChartOptions<"bar"> = { ...horizontalOptions, plugins: { legend: { display: false }, tooltip: { ...baseTooltip, callbacks: { label: context => formatRupiah(Number(context.raw)) } } }, scales: { ...horizontalOptions.scales, x: { beginAtZero: true, border: { display: false }, grid: { color: chartColors.grid }, ticks: { color: chartColors.muted, callback: value => `Rp${formatCompactNumber(Number(value))}` } } } };

function useOperationalData<T>(kind: "stock" | "customers", range: AnalyticsRange) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string }>({ data: null, loading: true, error: "" });
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/analytics/${kind}?from=${range.from}&to=${range.to}&grain=${range.grain}`, { signal: controller.signal })
      .then(async response => { const body = await response.json(); if (!response.ok) throw new Error(body.error || "Gagal memuat data."); return body.data as T; })
      .then(data => setState({ data, loading: false, error: "" }))
      .catch(error => { if (error.name !== "AbortError") setState({ data: null, loading: false, error: error.message }); });
    return () => controller.abort();
  }, [kind, range.from, range.grain, range.to]);
  return state;
}

type StockVelocity = StockAnalyticsResult["velocity"][number];
function stockState(item: StockVelocity): { label: string; tone: "green" | "amber" | "red" | "neutral"; priority: number } {
  if (item.qty <= 0) return { label: "Habis", tone: "red", priority: 0 };
  if (item.qty <= item.minQty) return { label: "Menipis", tone: "red", priority: 1 };
  if (item.daysCover !== null && item.daysCover <= 7) return { label: "Segera restock", tone: "amber", priority: 2 };
  if (item.daysCover === null) return { label: "Tidak bergerak", tone: "neutral", priority: 4 };
  return { label: "Aman", tone: "green", priority: 3 };
}

export function StockAnalytics({ range }: { range: AnalyticsRange }) {
  const { data, loading, error } = useOperationalData<StockAnalyticsResult>("stock", range);
  if (loading) return <AnalyticsSkeleton cards={4} />;
  if (error) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>;
  if (!data) return null;
  const m = data.metrics;
  const priorityItems = [...data.velocity].sort((a, b) => stockState(a).priority - stockState(b).priority || b.soldUnits - a.soldUnits).slice(0, 12);
  return <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsKpiCard label="Total Stok" value={m.totalUnits.toLocaleString("id-ID")} note="Unit tersedia saat ini" tone="gold" />
      <AnalyticsKpiCard label="SKU Aktif" value={m.activeSku.toLocaleString("id-ID")} note="SKU yang memiliki stok" />
      <AnalyticsKpiCard label="Stok Menipis" value={m.lowStock.toLocaleString("id-ID")} note="Mencapai batas minimum" tone={m.lowStock ? "amber" : "green"} />
      <AnalyticsKpiCard label="Stok Habis" value={m.outOfStock.toLocaleString("id-ID")} note="SKU yang perlu perhatian" tone={m.outOfStock ? "red" : "green"} />
    </div>
    <SummaryStrip items={[{ label: "Stok masuk", value: `+${m.stockIn.toLocaleString("id-ID")}`, note: "Unit dalam periode" }, { label: "Stok keluar", value: `−${m.stockOut.toLocaleString("id-ID")}`, note: "Unit dalam periode" }, { label: "Pergerakan bersih", value: `${m.netMovement >= 0 ? "+" : ""}${m.netMovement.toLocaleString("id-ID")}`, note: m.netMovement >= 0 ? "Persediaan bertambah" : "Persediaan berkurang" }]} />
    <div className="grid gap-4 xl:grid-cols-12">
      <AnalyticsPanel className="xl:col-span-8" height="h-80" eyebrow="Arus persediaan" title="Pergerakan Stok" subtitle="Perbandingan unit masuk dan keluar sepanjang periode." insight={<ChartInsight label="Pergerakan bersih" value={`${m.netMovement >= 0 ? "+" : ""}${m.netMovement}`} tone={m.netMovement >= 0 ? "green" : "red"} />}>{data.movementTrend.length ? <Line options={lineOptions} data={{ labels: data.movementTrend.map(item => item.key), datasets: [{ label: "Masuk", data: data.movementTrend.map(item => item.stockIn), borderColor: chartColors.green, backgroundColor: chartColors.greenSoft, pointBackgroundColor: "#fff", pointBorderColor: chartColors.green, pointBorderWidth: 2, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.25, tension: .34, fill: true }, { label: "Keluar", data: data.movementTrend.map(item => item.stockOut), borderColor: chartColors.red, borderDash: [5, 5], pointRadius: 0, pointHoverRadius: 5, borderWidth: 1.75, tension: .34 }] }} /> : <AnalyticsEmptyState />}</AnalyticsPanel>
      <AnalyticsPanel className="xl:col-span-4" height="h-80" title="Kesehatan SKU" subtitle="Proporsi SKU aman, menipis, dan habis.">{data.health.safe + data.health.low + data.health.out ? <div className="relative h-full"><Doughnut options={{ responsive: true, maintainAspectRatio: false, cutout: "74%", animation: { duration: 400 }, plugins: { legend: { position: "bottom", labels: { color: chartColors.muted, usePointStyle: true, boxWidth: 8, padding: 16 } }, tooltip: baseTooltip } }} data={{ labels: ["Aman", "Menipis", "Habis"], datasets: [{ data: [data.health.safe, data.health.low, data.health.out], backgroundColor: [chartColors.green, chartColors.amber, chartColors.red], borderColor: "#fff", borderWidth: 3, spacing: 2, hoverOffset: 5 }] }} /><div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[38%] -translate-y-1/2 text-center"><p className="font-serif text-2xl font-semibold tabular-nums text-text">{data.health.safe + data.health.low + data.health.out}</p><p className="text-[10px] uppercase tracking-[.12em] text-text-muted">Total SKU</p></div></div> : <AnalyticsEmptyState />}</AnalyticsPanel>
      <AnalyticsPanel className="xl:col-span-6" title="Distribusi Merek" subtitle="Komposisi unit stok berdasarkan merek.">{data.brands.length ? <Bar options={horizontalOptions} data={{ labels: data.brands.map(item => item.name), datasets: [{ label: "Unit", data: data.brands.map(item => item.value), backgroundColor: chartColors.gold, borderRadius: 4, barThickness: 18 }] }} /> : <AnalyticsEmptyState />}</AnalyticsPanel>
      <AnalyticsPanel className="xl:col-span-6" title="Distribusi Kategori" subtitle="Komposisi unit stok berdasarkan kategori produk.">{data.categories.length ? <Bar options={horizontalOptions} data={{ labels: data.categories.map(item => item.name), datasets: [{ label: "Unit", data: data.categories.map(item => item.value), backgroundColor: chartColors.ink, borderRadius: 4, barThickness: 18 }] }} /> : <AnalyticsEmptyState />}</AnalyticsPanel>
    </div>
    <section className="overflow-hidden rounded-xl border border-border/60 bg-white"><div className="p-5"><h2 className="font-serif text-lg font-semibold text-text">Prioritas Restock</h2><p className="mt-1 text-xs text-text-muted">Produk berisiko ditampilkan lebih dahulu berdasarkan stok minimum dan estimasi ketahanan.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><tr><th className="px-5 py-3">Produk</th><th className="px-4 py-3">Stok</th><th className="px-4 py-3">Minimum</th><th className="px-4 py-3">Terjual</th><th className="px-4 py-3">Ketahanan</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-border/30">{priorityItems.map(item => { const state = stockState(item); return <tr key={`${item.name}-${item.brand}`}><td className="px-5 py-3.5"><span className="font-medium text-text">{item.name}</span><br /><span className="text-xs text-text-muted">{item.brand}</span></td><td className="px-4 py-3 tabular-nums">{item.qty}</td><td className="px-4 py-3 tabular-nums">{item.minQty}</td><td className="px-4 py-3 tabular-nums">{item.soldUnits} · {item.soldWeight}g</td><td className="px-4 py-3 tabular-nums">{item.daysCover === null ? "—" : `${item.daysCover} hari`}</td><td className="px-5 py-3"><StatusBadge tone={state.tone}>{state.label}</StatusBadge></td></tr>; })}{!priorityItems.length && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-text-muted">Belum ada data stok.</td></tr>}</tbody></table></div></section>
  </div>;
}

export function CustomerSourceAnalytics({ range }: { range: AnalyticsRange }) {
  const { data, loading, error } = useOperationalData<CustomerSourceAnalyticsResult>("customers", range);
  if (loading) return <AnalyticsSkeleton />;
  if (error) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>;
  if (!data) return null;
  const m = data.metrics;
  const totalOmzet = data.sources.reduce((sum, source) => sum + source.omzet, 0);
  return <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><AnalyticsKpiCard label="Pelanggan Aktif" value={m.activeCustomers.toLocaleString("id-ID")} note="Bertransaksi dalam periode" tone="gold" /><AnalyticsKpiCard label="Pelanggan Baru" value={m.newCustomers.toLocaleString("id-ID")} note="Order pertama dalam periode" tone="green" /><AnalyticsKpiCard label="Pelanggan Repeat" value={m.repeatCustomers.toLocaleString("id-ID")} note="Lebih dari satu order" /><AnalyticsKpiCard label="Repeat Rate" value={`${m.repeatRate}%`} note="Dari pelanggan aktif" tone="gold" /><AnalyticsKpiCard label="Sumber Teratas" value={m.topSource} note="Berdasarkan kontribusi omzet" tone="amber" /></div>
    <SummaryStrip items={[{ label: "Sumber teridentifikasi", value: Math.max(0, m.activeCustomers - m.unknownCustomers).toLocaleString("id-ID"), note: "Pelanggan dengan sumber akuisisi" }, { label: "Sumber tidak diketahui", value: m.unknownCustomers.toLocaleString("id-ID"), note: "Perlu dilengkapi untuk akurasi" }, { label: "Jumlah kanal aktif", value: data.sources.length.toLocaleString("id-ID"), note: "Menghasilkan transaksi dalam periode" }]} />
    <div className="grid gap-4 xl:grid-cols-12">
      <AnalyticsPanel className="xl:col-span-7" height="h-80" eyebrow="Kontribusi kanal" title="Omzet per Sumber Akuisisi" subtitle="Nilai penjualan dikelompokkan berdasarkan sumber order pertama pelanggan." insight={<ChartInsight label="Kanal teratas" value={m.topSource} tone="amber" />}>{data.sources.length ? <Bar options={moneyOptions} data={{ labels: data.sources.map(item => item.name), datasets: [{ label: "Omzet", data: data.sources.map(item => item.omzet), backgroundColor: data.sources.map((_, index) => index === 0 ? chartColors.gold : `rgba(200, 145, 22, ${Math.max(.3, .7 - index * .08)})`), borderRadius: 5, barThickness: 17 }] }} /> : <AnalyticsEmptyState />}</AnalyticsPanel>
      <AnalyticsPanel className="xl:col-span-5" height="h-80" title="Akuisisi & Retensi" subtitle="Pelanggan baru dibanding transaksi pelanggan lama." insight={<ChartInsight label="Repeat rate" value={`${m.repeatRate}%`} tone="green" />}>{data.trend.length ? <Line options={lineOptions} data={{ labels: data.trend.map(item => item.key), datasets: [{ label: "Pelanggan baru", data: data.trend.map(item => item.newCustomers), borderColor: chartColors.green, backgroundColor: chartColors.greenSoft, pointBackgroundColor: "#fff", pointBorderColor: chartColors.green, pointBorderWidth: 2, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.25, tension: .34, fill: true }, { label: "Transaksi repeat", data: data.trend.map(item => item.repeatOrders), borderColor: chartColors.gold, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2, tension: .34 }] }} /> : <AnalyticsEmptyState />}</AnalyticsPanel>
    </div>
    <section className="overflow-hidden rounded-xl border border-border/60 bg-white"><div className="p-5"><h2 className="font-serif text-lg font-semibold text-text">Perbandingan Sumber Akuisisi</h2><p className="mt-1 text-xs text-text-muted">Sumber mengikuti order pertama pelanggan, bukan sumber setiap transaksi berikutnya.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><tr><th className="px-5 py-3">Peringkat</th><th className="px-4 py-3">Sumber</th><th className="px-4 py-3">Pelanggan</th><th className="px-4 py-3">Baru</th><th className="px-4 py-3">Repeat</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Omzet</th><th className="px-4 py-3">Kontribusi</th><th className="px-5 py-3">GP</th></tr></thead><tbody className="divide-y divide-border/30">{data.sources.map((item, index) => <tr key={item.name}><td className="px-5 py-3.5 font-serif text-base tabular-nums text-gold-dark">#{index + 1}</td><td className="px-4 py-3.5 font-medium text-text">{item.name}</td><td className="px-4 py-3 tabular-nums">{item.customers}</td><td className="px-4 py-3 tabular-nums">{item.newCustomers}</td><td className="px-4 py-3 tabular-nums">{item.repeatCustomers}</td><td className="px-4 py-3 tabular-nums">{item.orders}</td><td className="px-4 py-3 tabular-nums">{formatRupiah(item.omzet)}</td><td className="px-4 py-3 tabular-nums">{totalOmzet ? `${((item.omzet / totalOmzet) * 100).toLocaleString("id-ID", { maximumFractionDigits: 1 })}%` : "0%"}</td><td className="px-5 py-3 tabular-nums">{formatRupiah(item.gp)}</td></tr>)}{!data.sources.length && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-text-muted">Belum ada sumber akuisisi pada periode ini.</td></tr>}</tbody></table></div></section>
  </div>;
}
