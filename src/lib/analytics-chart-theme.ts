const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" });
const monthYearFormatter = new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric", timeZone: "UTC" });

export function formatChartDateLabel(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00Z`);
    return `${date.getUTCDate()} ${monthFormatter.format(date)}`;
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    return monthYearFormatter.format(new Date(`${value}-01T00:00:00Z`));
  }
  return value;
}

export function formatCompactNumber(value: number): string {
  const absolute = Math.abs(value);
  const format = (amount: number, suffix: string) => `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(amount)} ${suffix}`;
  if (absolute >= 1_000_000_000) return format(value / 1_000_000_000, "M");
  if (absolute >= 1_000_000) return format(value / 1_000_000, "jt");
  if (absolute >= 1_000) return format(value / 1_000, "rb");
  return new Intl.NumberFormat("id-ID").format(value);
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / Math.abs(previous)) * 1_000) / 10;
}
