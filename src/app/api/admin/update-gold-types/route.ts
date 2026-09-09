import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncTodayPrices } from "@/lib/gold-api";
import { requireRole } from "@/lib/supabase/server-user";

export async function POST(request: NextRequest) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const admin = createAdminClient();
    for (const item of body) {
      await admin.from("gold_types").update({
        is_auto: item.isAuto,
        manual_buy: item.manualBuy ?? null,
        manual_sell: item.manualSell ?? null,
      }).eq("id", item.id);
    }

    await syncTodayPrices();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
