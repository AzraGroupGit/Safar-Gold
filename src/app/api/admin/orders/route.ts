import { NextResponse } from "next/server";
import { conflictError, internalServerError, validationError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseOrderMutation } from "@/lib/order-lifecycle";
import { hasCapability, protectOrderGp, redactOrderForRole } from "@/lib/permissions";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireCapability("orders:read-own");
  if (!auth.ok) return auth.response;
  try {
    const adm = createAdminClient();

    let query = adm
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (!hasCapability(auth.role, "orders:read-any")) {
      query = query.eq("created_by", auth.user.id);
    }
    const { data: orders, error } = await query;

    if (error) return internalServerError("orders.list", error);

    return NextResponse.json({
      orders: (orders ?? []).map((order) => redactOrderForRole(order, auth.role)),
    });
  } catch (error) {
    return internalServerError("orders.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await requireCapability("orders:create");
  if (!auth.ok) return auth.response;

  let payload;
  try {
    const body = await request.json().catch(() => null);
    payload = protectOrderGp(parseOrderMutation(body), auth.role, null);
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "Payload order tidak valid");
  }

  try {
    const adm = createAdminClient();
    const { data, error } = await adm.rpc("create_order_atomic", {
      p_payload: payload,
      p_actor: auth.user.id,
    });
    if (error) {
      if (error.message.includes("Insufficient stock")) {
        return conflictError("INSUFFICIENT_STOCK", "Stok tidak mencukupi");
      }
      return internalServerError("orders.create", error);
    }
    const order = data && typeof data === "object"
      ? redactOrderForRole(data as Record<string, unknown>, auth.role)
      : data;
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return internalServerError("orders.create", error);
  }
}
