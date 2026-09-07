import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { canManageStock } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManageStock(getUserRole(user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
