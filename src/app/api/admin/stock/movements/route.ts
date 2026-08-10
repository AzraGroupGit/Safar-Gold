import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const adm = createAdminClient();
  const { data, error } = await adm
    .from("stock_movements")
    .select("*, gold_types:gold_type_id(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ movements: data ?? [] });
}
