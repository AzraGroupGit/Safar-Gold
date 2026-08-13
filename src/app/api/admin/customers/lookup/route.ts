import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

// Lookup customer by phone (normalized) — untuk autofill di form order
export async function GET(request: Request) {
  const adm = createAdminClient();
  const { searchParams } = new URL(request.url);
  const phone = normalizePhone(searchParams.get("phone") ?? "");
  if (!phone) return NextResponse.json({ customer: null });

  const { data: customer } = await adm
    .from("customers")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (!customer) return NextResponse.json({ customer: null });

  // Order count untuk badge repeat
  const { count } = await adm
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", customer.id);

  return NextResponse.json({ customer: { ...customer, order_count: count ?? 0 } });
}
