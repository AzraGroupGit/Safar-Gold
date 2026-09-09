import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseOrderMutation } from "@/lib/order-lifecycle";
import { hasCapability, protectOrderGp, redactOrderForRole } from "@/lib/permissions";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireCapability("orders:read-own");
  if (!auth.ok) return auth.response;
  const adm = createAdminClient();

  let query = adm
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (!hasCapability(auth.role, "orders:read-any")) {
    query = query.eq("created_by", auth.user.id);
  }
  const { data: orders, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    orders: (orders ?? []).map((order) => redactOrderForRole(order, auth.role)),
  });
}

export async function POST(request: Request) {
  try {
    const auth = await requireCapability("orders:create");
    if (!auth.ok) return auth.response;
    const payload = protectOrderGp(parseOrderMutation(await request.json()), auth.role, null);
    const adm = createAdminClient();
    const { data, error } = await adm.rpc("create_order_atomic", {
      p_payload: payload,
      p_actor: auth.user.id,
    });
    if (error) {
      const status = error.message.includes("Insufficient stock") ? 409 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
    const order = data && typeof data === "object"
      ? redactOrderForRole(data as Record<string, unknown>, auth.role)
      : data;
    return NextResponse.json({ success: true, order });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payload order tidak valid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
