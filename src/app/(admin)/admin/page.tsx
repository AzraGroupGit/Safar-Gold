import { getAllGoldTypes, getFormattedTodayPrices, formatRupiah } from "@/lib/gold-api";
import PriceApprovalPanel from "./PriceApprovalPanel";
import { createAnonClient } from "@/lib/supabase/anon";

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

export default async function AdminDashboard() {
  const goldTypes = await getAllGoldTypes();
  const prices = await getFormattedTodayPrices();
  const hasData = prices.length > 0 && prices[0].buyPrice > 0;
  const autoCount = goldTypes.filter((g) => g.is_auto).length;

  const supabase = createAnonClient();
  const { data: settings } = await supabase.from("app_settings").select("key, value");
  const s = Object.fromEntries((settings ?? []).map((r) => [r.key, r.value]));

  // Data pasar dari cron terakhir (atau fetch live kalau belum ada)
  const xauUsd = parseFloat(s.last_cron_xau_usd || "0");
  const usdIdr = parseFloat(s.last_cron_usd_idr || "0") || parseFloat(s.usd_idr_rate || "16300");
  const lastCron = s.last_cron_time
    ? new Date(s.last_cron_time).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : null;
  const baseGoldIdr = xauUsd > 0 ? Math.round((xauUsd * usdIdr) / 31.1034768) : 0;

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
          sub={`${autoCount} auto, ${goldTypes.length - autoCount} manual`}
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
          value={hasData ? formatRupiah(prices.find((p) => p.goldTypeId === "antam-100")?.buyPrice ?? 0) : "-"}
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

      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
        <PriceApprovalPanel
          initialHargaDasarJual={s.harga_dasar_jual ?? "0"}
          initialAcuanBuyback={s.acuan_buyback_lm ?? "0"}
          initialAdjJual={s.adjustment_jual ?? "0"}
          initialAdjBeli={s.adjustment_beli ?? "0"}
          initialAdjPerhiasan={s.adjustment_perhiasan ?? "0"}
          baseGoldIdr={baseGoldIdr}
          xauUsd={xauUsd}
          usdIdr={usdIdr}
          lastCronTime={lastCron}
        />
      </div>
    </div>
  );
}
