import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { canManageStock, parseStockAdjustment } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManageStock(getUserRole(user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const input = parseStockAdjustment(await request.json());
    const adm = createAdminClient();
    const { data, error } = await adm.rpc("adjust_stock_atomic", {
      p_gold_type_id: input.goldTypeId,
      p_brand: input.brand,
      p_type: input.type,
      p_qty: input.qty,
      p_notes: input.notes,
      p_actor: user.id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ success: true, newQty: data?.new_qty, movementId: data?.movement_id });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Data penyesuaian tidak valid" }, { status: 400 });
  }
}
