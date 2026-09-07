import { NextResponse } from "next/server";
import { aggregateCsPerformance, canViewOwnCsPerformance, type CsPerformanceOrder } from "@/lib/cs-performance";
import { getPreviousRange, type AnalyticsGrain } from "@/lib/analytics";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const wibToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
function addDays(date: string, days: number) { const value = new Date(`${date}T00:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10); }
function isValidDate(value: string) { return datePattern.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)); }

async function loadOrders(userId: string, from: string, to: string) {
  const { data, error } = await createAdminClient().from("orders")
    .select("id, order_number, type, status, customer_name, total, created_at, order_items(qty, weight)")
    .eq("created_by", userId)
    .gte("created_at", new Date(`${from}T00:00:00+07:00`).toISOString())
    .lt("created_at", new Date(`${addDays(to, 1)}T00:00:00+07:00`).toISOString())
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as CsPerformanceOrder[];
}

export async function GET(request: Request) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canViewOwnCsPerformance(getUserRole(user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const params = new URL(request.url).searchParams;
    const today = wibToday();
    const from = params.get("from") ?? `${today.slice(0, 7)}-01`;
    const to = params.get("to") ?? today;
    const grainParam = params.get("grain") ?? "day";
    if (!isValidDate(from) || !isValidDate(to) || from > to) return NextResponse.json({ error: "Rentang tanggal tidak valid" }, { status: 400 });
    if (!(["day", "week", "month"] as string[]).includes(grainParam)) return NextResponse.json({ error: "Granularitas tidak valid" }, { status: 400 });
    const duration = (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;
    if (duration > 1_825) return NextResponse.json({ error: "Rentang maksimal 5 tahun" }, { status: 400 });

    const grain = grainParam as AnalyticsGrain;
    const previousRange = getPreviousRange(from, to);
    const [currentOrders, previousOrders] = await Promise.all([loadOrders(user.id, from, to), loadOrders(user.id, previousRange.from, previousRange.to)]);
    return NextResponse.json({ range: { from, to, grain }, previousRange, current: aggregateCsPerformance(currentOrders, grain), previous: aggregateCsPerformance(previousOrders, grain) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memuat performa" }, { status: 500 });
  }
}
