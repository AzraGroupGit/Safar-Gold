import { getAllGoldTypes, getFormattedTodayPrices, formatRupiah } from "@/lib/gold-api";
import UpdateTrigger from "./UpdateTrigger";

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

      <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Fetch Harga Internasional", desc: "Setiap 06:00 WIB, sistem mengambil harga XAU/USD dari GoldAPI atau CoinGecko (fallback)." },
            { step: "2", title: "Konversi & Kalkulasi", desc: "Harga USD/oz dikonversi ke IDR/gram, lalu dihitung dengan margin jual & buyback per jenis emas." },
            { step: "3", title: "Update Tampilan", desc: "Harga final disimpan ke database dan langsung tampil di website. Riwayat tersimpan untuk analisis." },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-border/40 bg-surface p-5">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/5 text-sm font-bold text-gold">
                {item.step}
              </span>
              <h4 className="mb-2 font-serif text-base font-semibold text-text">{item.title}</h4>
              <p className="text-sm leading-relaxed text-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
        <UpdateTrigger />
      </div>
    </div>
  );
}
