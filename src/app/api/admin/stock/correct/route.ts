import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";
import { parseStockCorrection } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const auth = await requireCapability("stock:manage");
    if (!auth.ok) return auth.response;
    const input = parseStockCorrection(await request.json());
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("correct_manual_stock_movement_atomic", {
      p_movement_id: input.movementId,
      p_corrected_qty: input.correctedQty,
      p_reason: input.reason,
      p_actor: auth.user.id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ success: true, correction: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Data koreksi tidak valid" }, { status: 400 });
  }
}
