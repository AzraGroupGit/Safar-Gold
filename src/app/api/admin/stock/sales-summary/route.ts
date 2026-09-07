import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { canManageStock } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageStock(getUserRole(user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") ?? "all";
  if (!["all", "today", "week", "month"].includes(range)) {
    return NextResponse.json({ error: "Rentang tidak valid" }, { status: 400 });
  }
  const adm = createAdminClient();

  let fromDate: string | null = null;
  const today = new Date().toISOString().split("T")[0];
  if (range === "today") {
    fromDate = today;
  } else if (range === "week") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    fromDate = d.toISOString().split("T")[0];
  } else if (range === "month") {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    fromDate = d.toISOString().split("T")[0];
  }

  let query = adm
    .from("orders")
    .select("id, type, status, created_at, order_items(gold_type_id, brand, weight, qty, price_total)")
    .eq("status", "completed")
    .eq("type", "sell");

  if (fromDate) {
    query = query.gte("created_at", fromDate);
  }

  const { data: orders, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const summaryMap = new Map<string, { totalWeightSold: number; totalRevenue: number }>();

  for (const order of orders ?? []) {
    for (const item of order.order_items ?? []) {
      const goldTypeId = item.gold_type_id;
      if (!goldTypeId) continue;
      const brand = item.brand ?? "Antam";
      const weight = item.weight ?? 0;
      const qty = item.qty ?? 1;
      const priceTotal = item.price_total ?? 0;
      const totalWeight = weight * qty;

      const key = `${goldTypeId}|${brand}`;
      const existing = summaryMap.get(key) ?? { totalWeightSold: 0, totalRevenue: 0 };
      existing.totalWeightSold += totalWeight;
      existing.totalRevenue += priceTotal;
      summaryMap.set(key, existing);
    }
  }

  const result: Record<string, { total_weight_sold: number; total_revenue: number }> = {};
  for (const [key, data] of summaryMap.entries()) {
    result[key] = {
      total_weight_sold: Math.round(data.totalWeightSold * 1000) / 1000,
      total_revenue: data.totalRevenue,
    };
  }

  return NextResponse.json({ summary: result, range });
}
