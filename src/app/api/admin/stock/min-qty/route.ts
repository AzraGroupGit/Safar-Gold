import { NextResponse } from "next/server";
import { internalServerError, validationError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";
import { parseStockMinimum } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireCapability("stock:manage");
  if (!auth.ok) return auth.response;

  let input: ReturnType<typeof parseStockMinimum>;
  try {
    input = parseStockMinimum(await request.json().catch(() => null));
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "Data minimum stok tidak valid");
  }

  try {
    const adm = createAdminClient();

    const { error } = await adm
      .from("stock")
      .update({ min_qty: input.minQty, updated_at: new Date().toISOString() })
      .eq("gold_type_id", input.goldTypeId)
      .eq("brand", input.brand);

    if (error) return internalServerError("stock.minimum.update", error);

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("stock.minimum.update", err);
  }
}
