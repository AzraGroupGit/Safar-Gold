"use client";

import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  type ScriptableContext,
  type Chart as ChartInstance,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

type HistoryRow = { date: string; gold_type_id: string; buy_price: number; sell_price: number };

type TodayValues = { lm: number; buyback: number };

const SERIES = [
  { key: "lm", id: "antam-1", field: "buy_price", label: "Logam Mulia", color: "#c89116" },
  { key: "buyback", id: "ph-k24s", field: "sell_price", label: "Buyback 24K*", color: "#9b7110" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

const periods = [
  { key: 7, label: "7 Hari" },
  { key: 30, label: "30 Hari" },
  { key: 90, label: "90 Hari" },
];

function formatRupiah(n: number): string {
  return n.toLocaleString("id-ID");
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`;
  return `Rp ${n}`;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

const crosshairPlugin = {
  id: "crosshair",
  afterDatasetsDraw(chart: ChartInstance) {
    const active = chart.tooltip?.getActiveElements?.();
    if (!active || active.length === 0) return;
    const x = active[0].element.x;
    const y = chart.scales.y;
    const ctx = chart.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y.top);
    ctx.lineTo(x, y.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(200, 145, 22, 0.28)";
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  },
};

export default function PriceChart({ history, todayValues }: { history: HistoryRow[]; todayValues?: TodayValues }) {
  const [period, setPeriod] = useState(30);
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({ lm: true, buyback: false });
  const [activeKey, setActiveKey] = useState<SeriesKey>("lm");

  const activeSeries: SeriesKey = visible[activeKey] ? activeKey : (visible.lm ? "lm" : "buyback");

  function toggle(key: SeriesKey) {
    const turningOn = !visible[key];
    setVisible((v) => ({ ...v, [key]: !v[key] }));
    if (turningOn) setActiveKey(key);
  }

  const { labels, seriesData, stats } = useMemo(() => {
    const map = new Map<string, Record<string, number>>();
    for (const row of history) {
      const s = SERIES.find((s) => s.id === row.gold_type_id);
      if (!s) continue;
      const val = row[s.field];
      if (val == null || val <= 0) continue;
      if (!map.has(row.date)) map.set(row.date, {});
      map.get(row.date)![s.key] = val;
    }

    const today = new Date().toISOString().split("T")[0];
    if (todayValues) {
      const entry = map.get(today) ?? {};
      if (todayValues.lm > 0) entry.lm = todayValues.lm;
      if (todayValues.buyback > 0) entry.buyback = todayValues.buyback;
      map.set(today, entry);
    }

    // Rentang N hari kalender berurutan (berakhir hari ini), hari tanpa data = null
    const dates: string[] = [];
    const todayDate = new Date(today + "T00:00:00Z");
    for (let i = period - 1; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setUTCDate(d.getUTCDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }

    const data: Record<SeriesKey, (number | null)[]> = {
      lm: dates.map((d) => map.get(d)?.lm ?? null),
      buyback: dates.map((d) => map.get(d)?.buyback ?? null),
    };

    const activeVals = data[activeSeries].filter((v): v is number => v != null);
    const last = activeVals[activeVals.length - 1] ?? 0;
    const first = activeVals[0] ?? 0;
    const change = last - first;
    const changePct = first > 0 ? (change / first) * 100 : 0;
    const high = activeVals.length ? Math.max(...activeVals) : 0;
    const low = activeVals.length ? Math.min(...activeVals) : 0;

    return {
      labels: dates.map(formatDateLabel),
      seriesData: data,
      stats: { last, change, changePct, high, low, hasData: activeVals.length > 0 },
    };
  }, [history, period, todayValues, activeSeries]);

  const makeAreaGradient = (ctx: ScriptableContext<"line">, color: string) => {
    const chart = ctx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return color;
    const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    return gradient;
  };

  const makeLineGradient = (ctx: ScriptableContext<"line">) => {
    const chart = ctx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return "#c89116";
    const gradient = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    gradient.addColorStop(0, "#e8b830");
    gradient.addColorStop(0.5, "#c89116");
    gradient.addColorStop(1, "#9b7110");
    return gradient;
  };

  const datasets: any[] = SERIES.filter((s) => visible[s.key]).map((s) => {
    const isPrimary = s.key === "lm";
    return {
      label: s.label,
      data: seriesData[s.key],
      borderColor: isPrimary ? (makeLineGradient as never) : s.color,
      backgroundColor: isPrimary
        ? (ctx: ScriptableContext<"line">) => makeAreaGradient(ctx, "rgba(200, 145, 22, 0.28)")
        : "transparent",
      fill: isPrimary,
      tension: 0.35,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: s.color,
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 2,
      borderWidth: isPrimary ? 3 : 2,
      borderDash: s.key === "buyback" ? [6, 4] : undefined,
      spanGaps: true,
    };
  });

  // Marker titik "hari ini" pada series aktif
  if (visible[activeSeries] && seriesData[activeSeries].some((v) => v != null)) {
    const lastIdx = seriesData[activeSeries].length - 1;
    datasets.push({
      label: "Hari Ini",
      data: seriesData[activeSeries].map((v, i) => (i === lastIdx ? v : null)),
      borderColor: "transparent",
      backgroundColor: "transparent",
      fill: false,
      pointRadius: (ctx: ScriptableContext<"line">) => {
        const i = ctx.dataIndex;
        return i === lastIdx ? 6 : 0;
      },
      pointBackgroundColor: "#c89116",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointHoverRadius: 7,
      showLine: false,
    });
  }

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1a1a1a",
        bodyColor: "#6b6b6b",
        titleFont: { family: "var(--font-sans)", weight: "bold" as const, size: 12 },
        bodyFont: { family: "var(--font-sans)", size: 12 },
        borderColor: "#e8e4d8",
        borderWidth: 1,
        padding: 14,
        cornerRadius: 14,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            if (ctx.parsed.y == null) return "";
            const val = ctx.parsed.y.toLocaleString("id-ID");
            return ` ${ctx.dataset.label}: Rp ${val}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { size: 11 }, maxRotation: 0, autoSkipPadding: 12 },
        border: { display: false },
      },
      y: {
        grid: { color: "#f2efe7", borderDash: [4, 4] },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
          padding: 8,
          callback: (val: string | number) => {
            const n = Number(val);
            return n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : `${(n / 1000).toFixed(0)}K`;
          },
        },
        border: { display: false },
      },
    },
  };

  const isUp = stats.change >= 0;
  const activeLabel = SERIES.find((s) => s.key === activeSeries)?.label ?? "Logam Mulia";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-lg shadow-gold/5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

      <div className="relative border-b border-border/40 px-6 py-5 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">Grafik Harga Emas</p>
            <h3 className="mt-1 font-serif text-xl font-bold text-text md:text-2xl">Pergerakan Harga per Gram</h3>
          </div>
          <div className="flex items-center gap-1.5 self-start rounded-xl border border-border/60 bg-surface p-1">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  period === p.key ? "gold-gradient-bg text-white shadow-sm shadow-gold/15" : "text-text-muted hover:text-text"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative px-6 py-5 md:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-text-muted">Harga {activeLabel} Terkini</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-serif text-3xl font-bold text-text">
                {stats.hasData ? `Rp ${formatRupiah(stats.last)}` : "-"}
              </span>
              {stats.hasData && stats.change !== 0 && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isUp ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>
                  {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{formatRupiah(stats.change)} ({isUp ? "+" : ""}{stats.changePct.toFixed(1).replace(".", ",")}%)
                </span>
              )}
            </div>
          </div>

          {stats.hasData && (
            <div className="flex flex-wrap gap-2">
              <div className="rounded-xl border border-border/40 bg-surface px-4 py-2">
                <p className="text-[10px] uppercase tracking-wider text-text-muted">Tertinggi</p>
                <p className="text-sm font-semibold text-text">{formatCompact(stats.high)}</p>
              </div>
              <div className="rounded-xl border border-border/40 bg-surface px-4 py-2">
                <p className="text-[10px] uppercase tracking-wider text-text-muted">Terendah</p>
                <p className="text-sm font-semibold text-text">{formatCompact(stats.low)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Custom legend — toggle chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          {SERIES.map((s) => (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                visible[s.key]
                  ? "border-gold/40 bg-gold/5 text-gold-dark"
                  : "border-border/60 bg-white text-text-muted hover:border-gold/30 hover:text-text"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color, opacity: visible[s.key] ? 1 : 0.4 }}
              />
              {s.label}
            </button>
          ))}
        </div>

        <div className="h-72">
          <Line data={chartData} options={options} plugins={[crosshairPlugin]} />
        </div>
      </div>
    </div>
  );
}
