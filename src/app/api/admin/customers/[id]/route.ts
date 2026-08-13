import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adm = createAdminClient();

  const { data: customer, error } = await adm.from("customers").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const { data: orders } = await adm
    .from("orders")
    .select("id, order_number, type, total, status, invoice_number, created_at")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ customer, orders: orders ?? [] });
}
