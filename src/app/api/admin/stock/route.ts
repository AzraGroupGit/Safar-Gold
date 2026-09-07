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

  const [stockRes, salesRes] = await Promise.all([
    adm
      .from("stock")
      .select("*, gold_types:gold_type_id(name, weight, category)")
      .order("gold_type_id"),
    fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/admin/stock/sales-summary?range=${range}`, {
      headers: { "Content-Type": "application/json", cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    }).then(r => r.json()).catch(() => ({ summary: {} })),
  ]);

  const { data: stock, error: stockErr } = stockRes;
  const salesSummary = salesRes.summary ?? {};

  if (stockErr) return NextResponse.json({ error: stockErr.message }, { status: 500 });

  const enrichedStock = (stock ?? []).map((s) => ({
    ...s,
    total_weight_sold: salesSummary[`${s.gold_type_id}|${s.brand ?? ""}`]?.total_weight_sold ??
      salesSummary[s.gold_type_id]?.total_weight_sold ??
      0,
    total_revenue: salesSummary[`${s.gold_type_id}|${s.brand ?? ""}`]?.total_revenue ??
      salesSummary[s.gold_type_id]?.total_revenue ??
      0,
  }));

  return NextResponse.json({ stock: enrichedStock, range });
}
