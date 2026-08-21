'use client';

import { getAllGoldTypes, getFormattedTodayPrices, getMedianFactors, formatRupiah } from "@/lib/gold-api";
import type { GoldTypeRow, FormattedPrice } from "@/lib/gold-api";
import PriceApprovalPanel from "./PriceApprovalPanel";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function TrendIndicator({ value }: { value: number }) {
  const up = value >= 0;
  const pct = `${Math.abs(value).toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
  return (
    <p
      className={`mt-2 inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
        up ? "text-emerald-600" : "text-red-500"
      }`}
    >
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {up ? <path d="M5 15l7-7 7 7" /> : <path d="M5 9l7 7 7-7" />}
      </svg>
      {up ? "naik" : "turun"} {pct}
    </p>
  );
}

function StatCard({
  label,
  value,
  sub,
  trend,
  live = false,
  href,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number | null;
  live?: boolean;
  href?: string;
}) {
  const body = (
    <>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        {live && (
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        )}
        {label}
      </p>
      <p className="mt-2.5 font-serif text-[1.7rem] font-semibold leading-none tracking-tight tabular-nums text-text">
        {value}
      </p>
      {trend !== null && trend !== undefined && <TrendIndicator value={trend} />}
      {sub && <p className="mt-1.5 text-xs text-text-light">{sub}</p>}
    </>
  );

  const cls =
    "block h-full rounded-xl border border-border/70 bg-white p-5 transition-colors duration-200 hover:border-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2";

  if (href) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-xl border border-border/70 bg-white px-6 py-16 text-center">
      <svg
        className="h-10 w-10 text-text-light"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <h2 className="mt-4 font-serif text-lg font-semibold text-text">Gagal memuat dashboard</h2>
      <p className="mt-1 max-w-sm text-sm text-text-muted">
        Periksa koneksi Anda, lalu coba muat ulang.
      </p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
        Muat Ulang
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const [goldTypes, setGoldTypes] = useState<GoldTypeRow[]>([]);
  const [prices, setPrices] = useState<FormattedPrice[]>([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const [medianFactors, setMedianFactors] = useState<Awaited<ReturnType<typeof getMedianFactors>> | null>(null);
  const [role, setRole] = useState<string>("admin");
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled && user) setRole(user.user_metadata?.role ?? "admin");

        const [gt, pr, mf] = await Promise.all([
          getAllGoldTypes(),
          getFormattedTodayPrices(),
          getMedianFactors(),
        ]);
        if (!cancelled) {
          setGoldTypes(gt);
          setPrices(pr);
          setHasData(pr.length > 0 && pr.some(p => p.buyPrice > 0 || p.sellPrice > 0));
          setMedianFactors(mf);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        if (!cancelled) setError("Gagal memuat data dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const supabase = createAnonClient();
        const { data } = await supabase.from("app_settings").select("key, value");
        if (!cancelled) {
          setSettings(
            Object.fromEntries(
              (data ?? []).map((r: { key: string; value: string }): [string, string] => [r.key, r.value]),
            ),
          );
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        if (!cancelled) setError("Gagal memuat data dashboard.");
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryKey((k) => k + 1);
  };

  if (error) {
    return <DashboardError onRetry={handleRetry} />;
  }

  if (loading || !settings) {
    return <AdminSkeleton />;
  }

  const s = settings;
  const xauUsd = parseFloat(s.last_cron_xau_usd || "0");
  const usdIdr = parseFloat(s.last_cron_usd_idr || "0") || parseFloat(s.usd_idr_rate || "16300");
  const lastCron = s.last_cron_time
    ? new Date(s.last_cron_time).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : null;
  const baseGoldIdr = xauUsd > 0 ? Math.round((xauUsd * usdIdr) / 31.1034768) : 0;

  const hargaDasarJual = parseFloat(s.harga_dasar_jual || "0") || Math.round(baseGoldIdr * 1.03);
  const acuanBuybackLM = parseFloat(s.acuan_buyback_lm || "0") || Math.round(baseGoldIdr * 0.97);

  const antamPrice = hasData
    ? (prices.find((p: FormattedPrice) => p.goldTypeId === "antam-100")?.buyPrice ?? 0)
    : 0;
  const antamPrev = parseFloat(s.antam_price_prev || "0");
  const antamTrend =
    antamPrev > 0 && antamPrice > 0 ? ((antamPrice - antamPrev) / antamPrev) * 100 : null;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-text">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">Ringkasan aktivitas & monitoring sistem</p>
        </div>
        {lastCron && (
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-dark">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Cron terakhir: {lastCron}
          </div>
        )}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Jenis Emas"
          value={`${goldTypes.length}`}
          sub={`${goldTypes.filter((g: GoldTypeRow) => g.is_auto).length} auto, ${goldTypes.length - goldTypes.filter((g: GoldTypeRow) => g.is_auto).length} manual`}
          href="/admin/jenis-emas"
        />
        <StatCard
          label="Harga Tersedia"
          value={hasData ? `${prices.length}` : "0"}
          sub={hasData ? `Update: ${prices[0]?.date ?? "-"}` : "Jalankan cron"}
          href="/admin/harga"
        />
        <StatCard
          label="Antam 100gr"
          value={hasData ? formatRupiah(antamPrice) : "-"}
          trend={antamTrend}
          sub="harga jual / gram"
          href="/admin/harga"
        />
        <StatCard
          label="Auto Update"
          value="06:00 WIB"
          sub="setiap hari"
          live
        />
      </div>

      {role !== "cs" && (
        <div className="rounded-xl border border-border/60 bg-white">
          <PriceApprovalPanel
            initialHargaDasarJual={String(hargaDasarJual)}
            initialAcuanBuyback={String(acuanBuybackLM)}
            initialAdjJual={s.adjustment_jual ?? "0"}
            initialAdjBeli={s.adjustment_beli ?? "0"}
            initialAdjPerhiasan={s.adjustment_perhiasan ?? "0"}
            initialPersenBuybackPerhiasan={s.persen_buyback_perhiasan ?? "81"}
            baseGoldIdr={baseGoldIdr}
            xauUsd={xauUsd}
            usdIdr={usdIdr}
            lastCronTime={lastCron}
            initialAntamPrice={s.antam_price ?? ""}
            initialAntamPricePrev={s.antam_price_prev ?? ""}
            initialGlobalGoldPrice={s.global_gold_price ?? ""}
            initialGlobalGoldPricePrev={s.global_gold_price_prev ?? ""}
            suggestedJual={medianFactors?.suggestedJual ?? null}
            suggestedBuyback={medianFactors?.suggestedBuyback ?? null}
          />
        </div>
      )}
      {role === "cs" && (
        <div className="rounded-xl border border-border/60 bg-white p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-text-muted/40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <p className="mt-4 font-serif text-lg font-semibold text-text">Akses Terbatas</p>
          <p className="mt-1 text-sm text-text-muted">
            Halaman ini hanya dapat dilihat. Pengaturan harga hanya untuk Admin.
          </p>
        </div>
      )}
    </div>
  );
}
