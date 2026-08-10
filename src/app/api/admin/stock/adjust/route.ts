import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { goldTypeId, type, qty, notes } = await request.json();
    if (!goldTypeId || !type || !qty || qty <= 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const adm = createAdminClient();
    const { data: stockRow } = await adm.from("stock").select("qty").eq("gold_type_id", goldTypeId).maybeSingle();
    const current = stockRow?.qty ?? 0;
    const newQty = type === "in" ? current + qty : Math.max(0, current - qty);

    await adm.from("stock").upsert({ gold_type_id: goldTypeId, qty: newQty, updated_at: new Date().toISOString() });
    await adm.from("stock_movements").insert({
      gold_type_id: goldTypeId,
      type,
      qty,
      notes: notes || `Manual — ${type === "in" ? "Masuk" : "Keluar"}`,
    });

    return NextResponse.json({ success: true, newQty });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
