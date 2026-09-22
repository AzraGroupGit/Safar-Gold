import { NextResponse } from "next/server";
import { conflictError, internalServerError, validationError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";
import { parseStockAdjustment } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireCapability("stock:manage");
  if (!auth.ok) return auth.response;

  let input: ReturnType<typeof parseStockAdjustment>;
  try {
    input = parseStockAdjustment(await request.json().catch(() => null));
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "Data penyesuaian tidak valid");
  }

  try {
    const adm = createAdminClient();
    const { data, error } = await adm.rpc("adjust_stock_atomic", {
      p_gold_type_id: input.goldTypeId,
      p_brand: input.brand,
      p_type: input.type,
      p_qty: input.qty,
      p_notes: input.notes,
      p_actor: auth.user.id,
    });
    if (error) {
      if (error.message.startsWith("Insufficient stock")) {
        return conflictError("INSUFFICIENT_STOCK", "Stok tidak mencukupi");
      }
      return internalServerError("stock.adjust", error);
    }
    return NextResponse.json({ success: true, newQty: data?.new_qty, movementId: data?.movement_id });
  } catch (err) {
    return internalServerError("stock.adjust", err);
  }
}
