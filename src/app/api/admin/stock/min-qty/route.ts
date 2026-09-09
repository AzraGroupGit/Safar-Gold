import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const auth = await requireCapability("stock:manage");
    if (!auth.ok) return auth.response;
    const { goldTypeId, minQty, brand } = await request.json();
    if (!goldTypeId || typeof minQty !== "number" || !Number.isInteger(minQty) || minQty < 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const adm = createAdminClient();
    const brandValue = brand ?? "Antam";

    const { error } = await adm
      .from("stock")
      .update({ min_qty: minQty, updated_at: new Date().toISOString() })
      .eq("gold_type_id", goldTypeId)
      .eq("brand", brandValue);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
