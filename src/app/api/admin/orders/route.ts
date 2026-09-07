import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageOrders, parseOrderMutation } from "@/lib/order-lifecycle";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const adm = createAdminClient();

  const { data: orders, error } = await adm
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: orders ?? [] });
}

export async function POST(request: Request) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManageOrders(getUserRole(user))) {
      return NextResponse.json({ error: "Role akun belum memiliki akses untuk mengelola order" }, { status: 403 });
    }
    const payload = parseOrderMutation(await request.json());
    const adm = createAdminClient();
    const { data, error } = await adm.rpc("create_order_atomic", {
      p_payload: payload,
      p_actor: user.id,
    });
    if (error) {
      const status = error.message.includes("Insufficient stock") ? 409 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payload order tidak valid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
