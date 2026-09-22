import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/gold-api";
import { hasCapability } from "@/lib/permissions";
import { requireCapability } from "@/lib/supabase/server-user";
import { internalServerError, validationError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

// Lookup customer by phone (normalized) — untuk autofill di form order
export async function GET(request: Request) {
  const auth = await requireCapability("customers:lookup");
  if (!auth.ok) return auth.response;
  const { searchParams } = new URL(request.url);
  const phone = normalizePhone(searchParams.get("phone") ?? "");
  if (!phone) return NextResponse.json({ customer: null });
  if (phone.length < 8 || phone.length > 15) {
    return validationError("Nomor HP harus terdiri dari 8 sampai 15 digit");
  }

  const adm = createAdminClient();
  const { data: customer, error } = await adm
    .from("customers")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();
  if (error) return internalServerError("customer lookup failed", error);

  if (!customer) return NextResponse.json({ customer: null });

  // Order count untuk badge repeat
  let countQuery = adm
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", customer.id);
  if (!hasCapability(auth.role, "customers:read-any")) {
    countQuery = countQuery.eq("created_by", auth.user.id);
  }
  const { count, error: countError } = await countQuery;
  if (countError) return internalServerError("customer order count failed", countError);

  return NextResponse.json({ customer: { ...customer, order_count: count ?? 0 } });
}
