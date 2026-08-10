import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") ?? "today";
  const adm = createAdminClient();

  let fromDate: string;
  const today = new Date().toISOString().split("T")[0];
  if (range === "week") {
    const d = new Date(); d.setDate(d.getDate() - 7);
    fromDate = d.toISOString().split("T")[0];
  } else if (range === "month") {
    const d = new Date(); d.setDate(d.getDate() - 30);
    fromDate = d.toISOString().split("T")[0];
  } else {
    fromDate = today;
  }

  const { data: orders, error } = await adm
    .from("orders")
    .select("*, order_items(*)")
    .eq("status", "completed")
    .gte("created_at", fromDate)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const allOrders = orders ?? [];
  const jual = allOrders.filter(o => o.type === "sell");
  const buyback = allOrders.filter(o => o.type === "buyback");

  const totalJual = jual.reduce((s, o) => s + o.total, 0);
  const totalBuyback = buyback.reduce((s, o) => s + o.total, 0);
  const totalJualItems = jual.reduce((s, o) => s + (o.order_items ?? []).reduce((si: number, i: any) => si + i.qty, 0), 0);
  const totalBuybackItems = buyback.reduce((s, o) => s + (o.order_items ?? []).reduce((si: number, i: any) => si + i.qty, 0), 0);

  return NextResponse.json({
    summary: {
      totalOrders: allOrders.length,
      totalJual,
      totalBuyback,
      totalJualItems,
      totalBuybackItems,
      net: totalJual - totalBuyback,
      range,
    },
    orders: allOrders.slice(0, 50),
  });
}
