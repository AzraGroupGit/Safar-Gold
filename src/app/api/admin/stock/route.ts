import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const adm = createAdminClient();

  const { data: stock, error: stockErr } = await adm
    .from("stock")
    .select("*, gold_types:gold_type_id(name, weight, category)")
    .order("gold_type_id");

  if (stockErr) return NextResponse.json({ error: stockErr.message }, { status: 500 });

  return NextResponse.json({ stock: stock ?? [] });
}
