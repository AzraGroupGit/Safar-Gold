import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  const adm = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: orders } = await adm.from("orders").select("*, order_items(*)").eq("status", "completed").eq("created_at", { gte: today });

  const allOrders = orders ?? [];
  const jual = allOrders.filter(o => o.type === "sell");
  const buyback = allOrders.filter(o => o.type === "buyback");

  const totalJual = jual.reduce((s, o) => s + o.total, 0);
  const totalBuyback = buyback.reduce((s, o) => s + o.total, 0);

  const { data: stock } = await adm.from("stock").select("*, gold_types:gold_type_id(name)");

  return NextResponse.json({
    eod: {
      date: today,
      totalOrders: allOrders.length,
      totalJualOrders: jual.length,
      totalBuybackOrders: buyback.length,
      totalJual,
      totalBuyback,
      net: totalJual - totalBuyback,
      stock: stock ?? [],
      generatedAt: new Date().toISOString(),
    },
  });
}
