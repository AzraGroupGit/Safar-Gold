import type { ReactNode } from "react";

export const chartColors = {
  gold: "#c89116",
  goldDark: "#9b7110",
  green: "#15803d",
  amber: "#d97706",
  red: "#dc2626",
  ink: "#2d271b",
  muted: "#6b6b6b",
  grid: "rgba(120, 99, 60, .09)",
  goldSoft: "rgba(200, 145, 22, .14)",
  greenSoft: "rgba(21, 128, 61, .10)",
} as const;

type Tone = "gold" | "green" | "amber" | "red" | "neutral";

const toneClasses: Record<Tone, { value: string; icon: string; bar: string }> = {
  gold: { value: "text-gold-dark", icon: "bg-gold/10 text-gold-dark", bar: "bg-gold" },
  green: { value: "text-emerald-700", icon: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-600" },
  amber: { value: "text-amber-700", icon: "bg-amber-50 text-amber-700", bar: "bg-amber-500" },
  red: { value: "text-red-700", icon: "bg-red-50 text-red-700", bar: "bg-red-500" },
  neutral: { value: "text-text", icon: "bg-surface-alt text-text-muted", bar: "bg-text-muted" },
};

export function AnalyticsIcon({ children }: { children: ReactNode }) {
  return <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg">{children}</span>;
}

export function AnalyticsKpiCard({ label, value, note, footer, tone = "neutral", icon }: { label: string; value: ReactNode; note: string; footer?: ReactNode; tone?: Tone; icon?: ReactNode }) {
  const style = toneClasses[tone];
  return <article className="relative overflow-hidden rounded-xl border border-border/60 bg-white p-5">
    <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-0.5 ${style.bar}`} />
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-[.13em] text-text-muted">{label}</p><p className={`mt-2 break-words font-serif text-xl font-semibold tabular-nums ${style.value}`}>{value}</p></div>
      {icon && <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.icon}`}>{icon}</span>}
    </div>
    <p className="mt-1 text-xs text-text-muted">{note}</p>
    {footer && <div className="mt-4 border-t border-border/40 pt-3 text-[11px] font-medium">{footer}</div>}
  </article>;
}

export function AnalyticsPanel({ title, subtitle, eyebrow, insight, children, className = "", height = "h-72" }: { title: string; subtitle?: string; eyebrow?: string; insight?: ReactNode; children: ReactNode; className?: string; height?: string }) {
  return <section className={`relative overflow-hidden rounded-xl border border-border/60 bg-white p-5 transition-shadow duration-300 hover:shadow-[0_14px_35px_rgba(89,67,22,.06)] ${className}`}>
    <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-gold/[.045] blur-2xl" />
    <header className="relative flex items-start justify-between gap-4">
      <div className="min-w-0">{eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-gold-dark">{eyebrow}</p>}<h2 className={`${eyebrow ? "mt-1" : ""} font-serif text-lg font-semibold text-text`}>{title}</h2>{subtitle && <p className="mt-1 text-xs leading-relaxed text-text-muted">{subtitle}</p>}</div>
      {insight && <div className="shrink-0 rounded-lg border border-border/50 bg-surface/60 px-3 py-2 text-right">{insight}</div>}
    </header>
    <div className={`mt-5 ${height}`}>{children}</div>
  </section>;
}

export function ChartInsight({ label, value, tone = "neutral" }: { label: string; value: ReactNode; tone?: "green" | "amber" | "red" | "neutral" }) {
  const color = { green: "text-emerald-700", amber: "text-amber-700", red: "text-red-700", neutral: "text-text" }[tone];
  return <><p className="text-[9px] font-semibold uppercase tracking-[.12em] text-text-muted">{label}</p><p className={`mt-0.5 font-serif text-sm font-semibold tabular-nums ${color}`}>{value}</p></>;
}

export function AnalyticsEmptyState({ message = "Belum ada data pada periode ini." }: { message?: string }) {
  return <div role="status" className="flex h-full flex-col items-center justify-center text-center"><span aria-hidden="true" className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface text-gold-dark">◇</span><p className="text-sm font-medium text-text">Data belum tersedia</p><p className="mt-1 max-w-xs text-xs text-text-muted">{message}</p></div>;
}

export function AnalyticsSkeleton({ cards = 5 }: { cards?: number }) {
  return <div aria-busy="true" aria-label="Memuat analitik" className="space-y-4"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: cards }).map((_, index) => <div key={index} className="h-36 animate-pulse rounded-xl border border-border/40 bg-white" />)}</div><div className="h-80 animate-pulse rounded-xl border border-border/40 bg-white" /></div>;
}

export function SummaryStrip({ items }: { items: { label: string; value: ReactNode; note?: string }[] }) {
  return <section className="grid overflow-hidden rounded-xl border border-border/60 bg-white lg:grid-cols-3">{items.map((item, index) => <div key={item.label} className={`p-5 ${index ? "border-t border-border/40 lg:border-l lg:border-t-0" : ""}`}><p className="text-xs font-medium text-text-muted">{item.label}</p><p className="mt-1 font-serif text-xl font-semibold tabular-nums text-text">{item.value}</p>{item.note && <p className="mt-1 text-[11px] text-text-muted">{item.note}</p>}</div>)}</section>;
}

export function StatusBadge({ tone, children }: { tone: "green" | "amber" | "red" | "neutral"; children: ReactNode }) {
  const styles = { green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700", neutral: "bg-surface-alt text-text-muted" };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[tone]}`}>{children}</span>;
}
