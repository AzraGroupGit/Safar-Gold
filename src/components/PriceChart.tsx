"use client";

import { useState } from "react";
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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

function generateMockData(days: number, basePrice: number) {
  const labels: string[] = [];
  const antam: number[] = [];
  const ubs: number[] = [];
  const perhiasan: number[] = [];

  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }));

    const variance = () => (Math.random() - 0.5) * basePrice * 0.02;
    antam.push(basePrice + variance());
    ubs.push(basePrice - 20000 + variance());
    perhiasan.push(basePrice + 40000 + variance());
  }

  return { labels, antam, ubs, perhiasan };
}

const periods = [
  { key: 7, label: "7 Hari" },
  { key: 30, label: "30 Hari" },
  { key: 90, label: "90 Hari" },
];

export default function PriceChart() {
  const [period, setPeriod] = useState(7);
  const data = generateMockData(period, 1245000);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Antam",
        data: data.antam,
        borderColor: "#c89116",
        backgroundColor: "rgba(200, 145, 22, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "UBS",
        data: data.ubs,
        borderColor: "#b8860b",
        backgroundColor: "rgba(184, 134, 11, 0.06)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Perhiasan 24K",
        data: data.perhiasan,
        borderColor: "#d4a76a",
        backgroundColor: "rgba(212, 167, 106, 0.05)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyleWidth: 8,
          padding: 20,
          font: { family: "var(--font-sans)", size: 12 },
          color: "#6b6b6b",
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1a1a1a",
        bodyColor: "#6b6b6b",
        borderColor: "#e8e4d8",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const val = ctx.parsed.y ? ctx.parsed.y.toLocaleString("id-ID") : "0";
            return `${ctx.dataset.label}: Rp ${val}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { size: 11 } },
        border: { color: "#e8e4d8" },
      },
      y: {
        grid: { color: "#f2efe7" },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
          callback: (val: string | number) => {
            const n = Number(val);
            return n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : `${(n / 1000).toFixed(0)}K`;
          },
        },
        border: { color: "#e8e4d8" },
      },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 px-8 py-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-text">Grafik Harga Emas</h3>
          <p className="mt-0.5 text-xs text-text-muted">Pergerakan harga per gram (IDR)</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-surface p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                period === p.key
                  ? "gold-gradient-bg text-white shadow-sm shadow-gold/15"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        <div className="h-72">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
