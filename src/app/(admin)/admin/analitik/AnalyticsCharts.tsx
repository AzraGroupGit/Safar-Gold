"use client";

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip, type ChartOptions } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import type { AnalyticsResult } from "@/lib/analytics";
import { formatChartDateLabel, formatCompactNumber } from "@/lib/analytics-chart-theme";
import { AnalyticsEmptyState, AnalyticsPanel, ChartInsight, chartColors } from "./AnalyticsUI";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip);

const fullMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const tooltipBase = { backgroundColor: "#fffdf8", titleColor: chartColors.ink, bodyColor: chartColors.muted, borderColor: "#e8e0cf", borderWidth: 1, padding: 13, cornerRadius: 8, displayColors: true } as const;
const lineOptions: ChartOptions<"line"> = {
  responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" },
  animation: { duration: 350 },
  plugins: {
    legend: { position: "bottom", labels: { color: chartColors.muted, usePointStyle: true, boxWidth: 7, padding: 20, font: { size: 11 } } },
    tooltip: { ...tooltipBase, callbacks: { title: items => formatChartDateLabel(items[0]?.label ?? ""), label: context => `${context.dataset.label}: ${fullMoney.format(Number(context.raw))}` } },
  },
  scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: chartColors.muted, maxRotation: 0, autoSkip: true, maxTicksLimit: 9, callback(_value, index) { return formatChartDateLabel(this.getLabelForValue(index)); } } }, y: { beginAtZero: true, border: { display: false }, grid: { color: chartColors.grid }, ticks: { color: chartColors.muted, callback: value => `Rp${formatCompactNumber(Number(value))}` } } },
};

const horizontalMoneyOptions: ChartOptions<"bar"> = {
  responsive: true, maintainAspectRatio: false, indexAxis: "y", animation: { duration: 350 },
  plugins: { legend: { display: false }, tooltip: { ...tooltipBase, callbacks: { label: context => fullMoney.format(Number(context.raw)) } } },
  scales: { x: { beginAtZero: true, border: { display: false }, grid: { color: chartColors.grid }, ticks: { color: chartColors.muted, callback: value => `Rp${formatCompactNumber(Number(value))}` } }, y: { border: { display: false }, grid: { display: false }, ticks: { color: chartColors.muted } } },
};

const countOptions: ChartOptions<"bar"> = {
  responsive: true, maintainAspectRatio: false, indexAxis: "y", animation: { duration: 400 },
  plugins: { legend: { display: false }, tooltip: tooltipBase },
  scales: { x: { beginAtZero: true, border: { display: false }, grid: { color: chartColors.grid }, ticks: { color: chartColors.muted, precision: 0 } }, y: { border: { display: false }, grid: { display: false }, ticks: { color: chartColors.muted } } },
};

export default function AnalyticsCharts({ data }: { data: AnalyticsResult }) {
  const empty = <AnalyticsEmptyState />;
  const peak = data.trend.reduce((best, point) => point.omzet > best.omzet ? point : best, data.trend[0] ?? { key: "-", omzet: 0 });
  const average = data.trend.length ? data.metrics.omzet / data.trend.length : 0;
  return <div className="grid gap-4 xl:grid-cols-12">
    <AnalyticsPanel className="xl:col-span-12" height="h-80" eyebrow="Performa utama" title="Tren Keuangan" subtitle={`Rata-rata ${fullMoney.format(average)} per titik periode · puncak ${formatChartDateLabel(peak.key)}.`} insight={<ChartInsight label="Margin GP" value={data.metrics.gpMarginPercent === null ? "—" : `${data.metrics.gpMarginPercent}%`} tone="green" />}>
      {data.trend.length ? <Line options={lineOptions} data={{ labels: data.trend.map(point => point.key), datasets: [
        { label: "Omzet", data: data.trend.map(point => point.omzet), borderColor: chartColors.gold, backgroundColor: chartColors.goldSoft, pointBackgroundColor: "#fff", pointBorderColor: chartColors.gold, pointBorderWidth: 2, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5, tension: .34, fill: true },
        { label: "Buyback", data: data.trend.map(point => point.buyback), borderColor: chartColors.amber, borderDash: [5, 5], pointRadius: 0, pointHoverRadius: 5, borderWidth: 1.75, tension: .34 },
        { label: "Gross Profit", data: data.trend.map(point => point.grossProfit), borderColor: chartColors.green, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.25, tension: .34 },
      ] }} /> : empty}
    </AnalyticsPanel>

    <AnalyticsPanel className="xl:col-span-4" title="Komposisi Transaksi" subtitle="Proporsi order jual dan buyback yang selesai.">
      {data.metrics.orderCount ? <div className="relative h-full"><Doughnut options={{ responsive: true, maintainAspectRatio: false, cutout: "74%", animation: { duration: 400 }, plugins: { legend: { position: "bottom", labels: { color: chartColors.muted, usePointStyle: true, boxWidth: 8, padding: 18 } }, tooltip: { ...tooltipBase, callbacks: { label: context => { const value = Number(context.raw); return `${context.label}: ${value} · ${Math.round(value / data.metrics.orderCount * 100)}%`; } } } } }} data={{ labels: ["Jual", "Buyback"], datasets: [{ data: [data.metrics.sellOrderCount, data.metrics.buybackOrderCount], backgroundColor: [chartColors.green, chartColors.amber], hoverOffset: 5, borderColor: "#fff", borderWidth: 3, spacing: 2 }] }} /><div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[38%] -translate-y-1/2 text-center"><p className="font-serif text-2xl font-semibold tabular-nums text-text">{data.metrics.orderCount}</p><p className="text-[10px] uppercase tracking-[.12em] text-text-muted">Transaksi</p></div></div> : empty}
    </AnalyticsPanel>
    <AnalyticsPanel className="xl:col-span-8" title="Performa Produk" subtitle="Merek dengan kontribusi omzet penjualan tertinggi.">
      {data.products.length ? <Bar options={horizontalMoneyOptions} data={{ labels: data.products.slice(0, 8).map(product => product.name), datasets: [{ label: "Omzet", data: data.products.slice(0, 8).map(product => product.omzet), backgroundColor: data.products.slice(0, 8).map((_, index) => index === 0 ? chartColors.gold : `rgba(200, 145, 22, ${Math.max(.28, .72 - index * .07)})`), borderRadius: 5, barThickness: 17 }] }} /> : empty}
    </AnalyticsPanel>
    <AnalyticsPanel className="xl:col-span-12" title="Sumber Transaksi" subtitle="Jumlah transaksi berdasarkan sumber yang tercatat pada order.">
      {data.sources.length ? <Bar options={countOptions} data={{ labels: data.sources.map(source => source.name), datasets: [{ label: "Transaksi", data: data.sources.map(source => source.orders), backgroundColor: data.sources.map((_, index) => index === 0 ? chartColors.gold : "rgba(45, 39, 27, .66)"), borderRadius: 5, barThickness: 18 }] }} /> : empty}
    </AnalyticsPanel>
  </div>;
}
