import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { canManageStock, parseStockCorrection } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManageStock(getUserRole(user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const input = parseStockCorrection(await request.json());
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("correct_manual_stock_movement_atomic", {
      p_movement_id: input.movementId,
      p_corrected_qty: input.correctedQty,
      p_reason: input.reason,
      p_actor: user.id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ success: true, correction: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Data koreksi tidak valid" }, { status: 400 });
  }
}
