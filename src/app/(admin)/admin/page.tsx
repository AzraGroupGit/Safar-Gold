'use client';

import { getAllGoldTypes, getFormattedTodayPrices, getMedianFactors, formatRupiah } from "@/lib/gold-api";
import PriceApprovalPanel from "./PriceApprovalPanel";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/5 text-gold">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <p className="text-2xl font-bold text-text">{value}</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
        {sub && <p className="mt-1 text-xs text-text-light">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [goldTypes, setGoldTypes] = useState<Array<any>>([]);
  const [prices, setPrices] = useState<Array<any>>([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [medianFactors, setMedianFactors] = useState<any>(null);
  const [role, setRole] = useState<string>("admin");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setRole(user.user_metadata?.role ?? "admin");

        const [gt, pr, mf] = await Promise.all([
          getAllGoldTypes(),
          getFormattedTodayPrices(),
          getMedianFactors(),
        ]);
        setGoldTypes(gt);
        setPrices(pr);
        setHasData(pr.length > 0 && pr.some(p => p.buyPrice > 0 || p.sellPrice > 0));
        setMedianFactors(mf);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createAnonClient();
      const { data } = await supabase.from("app_settings").select("key, value");
      setSettings(Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value])));
    };
    fetchSettings();
  }, []);

  if (loading || !settings) {
    return <AdminSkeleton />;
  }

  const s = settings;
  const xauUsd = parseFloat(s.last_cron_xau_usd || "0");
  const xagUsd = parseFloat(s.last_cron_xag_usd || "0");
  const xpdUsd = parseFloat(s.last_cron_xpd_usd || "0");
  const usdIdr = parseFloat(s.last_cron_usd_idr || "0") || parseFloat(s.usd_idr_rate || "16300");
  const lastCron = s.last_cron_time
    ? new Date(s.last_cron_time).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : null;
  const baseGoldIdr = xauUsd > 0 ? Math.round((xauUsd * usdIdr) / 31.1034768) : 0;

  const hargaDasarJual = parseFloat(s.harga_dasar_jual || "0") || Math.round(baseGoldIdr * 1.03);
  const acuanBuybackLM = parseFloat(s.acuan_buyback_lm || "0") || Math.round(baseGoldIdr * 0.97);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">Ringkasan aktivitas & monitoring sistem</p>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Jenis Emas"
          value={`${goldTypes.length}`}
          sub={`${goldTypes.filter((g: any) => g.is_auto).length} auto, ${goldTypes.length - goldTypes.filter((g: any) => g.is_auto).length} manual`}
          icon="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
        />
        <StatCard
          label="Harga Tersedia"
          value={hasData ? `${prices.length}` : "0"}
          sub={hasData ? `Update: ${prices[0]?.date ?? "-"}` : "Jalankan cron"}
          icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard
          label="Antam 100gr"
          value={hasData ? formatRupiah(prices.find((p: any) => p.goldTypeId === "antam-100")?.buyPrice ?? 0) : "-"}
          sub="harga jual / gram"
          icon="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5z"
        />
        <StatCard
          label="Auto Update"
          value="06:00 WIB"
          sub="setiap hari"
          icon="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
        />
      </div>

      {role !== "cs" && (
        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <PriceApprovalPanel
            goldTypes={goldTypes}
            initialHargaDasarJual={String(hargaDasarJual)}
            initialAcuanBuyback={String(acuanBuybackLM)}
            initialAdjJual={s.adjustment_jual ?? "0"}
            initialAdjBeli={s.adjustment_beli ?? "0"}
            initialAdjPerhiasan={s.adjustment_perhiasan ?? "0"}
            initialPersenBuybackPerhiasan={s.persen_buyback_perhiasan ?? "81"}
            premiPecahan={s.premi_pecahan ?? "{}"}
            spreadBuybackLM={s.spread_buyback_lm ?? "{}"}
            baseGoldIdr={baseGoldIdr}
            xauUsd={xauUsd}
            xagUsd={xagUsd}
            xpdUsd={xpdUsd}
            usdIdr={usdIdr}
            lastCronTime={lastCron}
            initialAntamPrice={s.antam_price ?? ""}
            initialAntamPricePrev={s.antam_price_prev ?? ""}
            initialGlobalGoldPrice={s.global_gold_price ?? ""}
            initialGlobalGoldPricePrev={s.global_gold_price_prev ?? ""}
            initialGoogleReviewsWidgetId={s.google_reviews_widget_id ?? ""}
            suggestedJual={medianFactors?.suggestedJual ?? null}
            suggestedBuyback={medianFactors?.suggestedBuyback ?? null}
          />
        </div>
      )}
      {role === "cs" && (
        <div className="rounded-2xl border border-border/60 bg-white p-6 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-text-muted/40" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="mt-4 font-serif text-lg font-semibold text-text">Akses Terbatas</p>
          <p className="mt-1 text-sm text-text-muted">Halaman ini hanya dapat dilihat. Pengaturan harga hanya untuk Admin.</p>
        </div>
      )}
    </div>
  );
}