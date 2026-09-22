import { NextResponse } from "next/server";
import { conflictError, internalServerError, validationError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";
import { parseStockCorrection } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireCapability("stock:manage");
  if (!auth.ok) return auth.response;

  let input: ReturnType<typeof parseStockCorrection>;
  try {
    input = parseStockCorrection(await request.json().catch(() => null));
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "Data koreksi tidak valid");
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("correct_manual_stock_movement_atomic", {
      p_movement_id: input.movementId,
      p_corrected_qty: input.correctedQty,
      p_reason: input.reason,
      p_actor: auth.user.id,
    });
    if (error) {
      const expectedConflict = [
        "Stock movement not found",
        "Order movement must be corrected from the order",
        "Stock movement is not active",
        "Corrected quantity must differ from original quantity",
        "Insufficient stock for correction",
      ].includes(error.message);
      if (expectedConflict) {
        return conflictError(
          "STOCK_CORRECTION_CONFLICT",
          "Koreksi stok tidak dapat diproses",
        );
      }
      return internalServerError("stock.correct", error);
    }
    return NextResponse.json({ success: true, correction: data });
  } catch (error) {
    return internalServerError("stock.correct", error);
  }
}
