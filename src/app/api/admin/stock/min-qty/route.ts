import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { goldTypeId, minQty } = await request.json();
    if (!goldTypeId || typeof minQty !== "number" || minQty < 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const adm = createAdminClient();
    const { error } = await adm
      .from("stock")
      .update({ min_qty: minQty, updated_at: new Date().toISOString() })
      .eq("gold_type_id", goldTypeId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
