import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/gold-api";
import { hasCapability } from "@/lib/permissions";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

// Lookup customer by phone (normalized) — untuk autofill di form order
export async function GET(request: Request) {
  const auth = await requireCapability("customers:lookup");
  if (!auth.ok) return auth.response;
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
  let countQuery = adm
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", customer.id);
  if (!hasCapability(auth.role, "customers:read-any")) {
    countQuery = countQuery.eq("created_by", auth.user.id);
  }
  const { count } = await countQuery;

  return NextResponse.json({ customer: { ...customer, order_count: count ?? 0 } });
}
