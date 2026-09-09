import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasCapability, redactCustomerForRole } from "@/lib/permissions";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireCapability("customers:read-own");
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const adm = createAdminClient();

  const canReadAny = hasCapability(auth.role, "customers:read-any");
  let ordersQuery = adm
    .from("orders")
    .select("id, order_number, type, total, status, invoice_number, created_at")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });
  if (!canReadAny) ordersQuery = ordersQuery.eq("created_by", auth.user.id);
  const { data: orders, error: ordersError } = await ordersQuery;
  if (ordersError) return NextResponse.json({ error: ordersError.message }, { status: 500 });
  if (!canReadAny && (orders ?? []).length === 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: customer, error } = await adm.from("customers").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const safeCustomer = redactCustomerForRole(customer, auth.role);

  return NextResponse.json({ customer: safeCustomer, orders: orders ?? [], scope: canReadAny ? "all" : "own" });
}
