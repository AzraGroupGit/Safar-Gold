import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";
import { parseStockAdjustment } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const auth = await requireCapability("stock:manage");
    if (!auth.ok) return auth.response;
    const input = parseStockAdjustment(await request.json());
    const adm = createAdminClient();
    const { data, error } = await adm.rpc("adjust_stock_atomic", {
      p_gold_type_id: input.goldTypeId,
      p_brand: input.brand,
      p_type: input.type,
      p_qty: input.qty,
      p_notes: input.notes,
      p_actor: auth.user.id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ success: true, newQty: data?.new_qty, movementId: data?.movement_id });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Data penyesuaian tidak valid" }, { status: 400 });
  }
}
