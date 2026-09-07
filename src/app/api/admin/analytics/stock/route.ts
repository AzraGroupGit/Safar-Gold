import { NextResponse } from "next/server";
import { aggregateStockAnalytics, type StockMovementInput, type StockSale, type StockSnapshot } from "@/lib/operational-analytics";
import type { AnalyticsGrain } from "@/lib/analytics";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";
const addDay = (date: string) => { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };

export async function GET(request: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (getUserRole(user) !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const p = new URL(request.url).searchParams; const from = p.get("from") ?? ""; const to = p.get("to") ?? ""; const grain = (p.get("grain") ?? "day") as AnalyticsGrain;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || from > to || !["day", "week", "month"].includes(grain)) return NextResponse.json({ error: "Filter tidak valid" }, { status: 400 });
  const start = new Date(`${from}T00:00:00+07:00`).toISOString(); const end = new Date(`${addDay(to)}T00:00:00+07:00`).toISOString(); const db = createAdminClient();
  const [stock, movements, sales] = await Promise.all([
    db.from("stock").select("gold_type_id, brand, qty, min_qty, gold_types:gold_type_id(name, category)"),
    db.from("stock_movements").select("type, qty, created_at").gte("created_at", start).lt("created_at", end),
    db.from("orders").select("created_at, order_items(gold_type_id, brand, qty, weight)").eq("status", "completed").eq("type", "sell").gte("created_at", start).lt("created_at", end),
  ]);
  const error = stock.error || movements.error || sales.error; if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: aggregateStockAnalytics(stock.data as unknown as StockSnapshot[], movements.data as StockMovementInput[], sales.data as unknown as StockSale[], from, to, grain) });
}
