import { NextResponse } from "next/server";
import { parseGoldTypeModesInput } from "@/lib/admin-input";
import { internalServerError, validationError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncTodayPrices } from "@/lib/gold-api";
import { requireRole } from "@/lib/supabase/server-user";

export async function POST(request: Request) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseGoldTypeModesInput(body);
    if (!parsed.ok) return validationError(parsed.error);

    const admin = createAdminClient();
    for (const item of parsed.value) {
      const { error } = await admin.from("gold_types").update({
        is_auto: item.isAuto,
        manual_buy: item.manualBuy,
        manual_sell: item.manualSell,
      }).eq("id", item.id);
      if (error) return internalServerError("gold-types.mode-update", error);
    }

    await syncTodayPrices();

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("gold-types.mode-update", err);
  }
}
