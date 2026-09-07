import { NextResponse } from "next/server";
import { canManageOrders, parseOrderMutation } from "@/lib/order-lifecycle";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageOrders(getUserRole(user))) return NextResponse.json({ error: "Role akun belum memiliki akses untuk mengelola order" }, { status: 403 });
  const { id } = await params;
  const adm = createAdminClient();
  const { data, error } = await adm.from("orders").select("*, order_items(*)").eq("id", id).single();
  if (error) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order: data });
}

export async function DELETE(_request: Request, { params }: Context) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageOrders(getUserRole(user))) return NextResponse.json({ error: "Role akun belum memiliki akses untuk mengelola order" }, { status: 403 });
  const { id } = await params;
  const adm = createAdminClient();
  const { data, error } = await adm.rpc("cancel_order_atomic", { p_order_id: id, p_actor: user.id });
  if (error) {
    const status = error.message.includes("not found") ? 404 : 409;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ success: true, order: data });
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManageOrders(getUserRole(user))) return NextResponse.json({ error: "Role akun belum memiliki akses untuk mengelola order" }, { status: 403 });
    const { id } = await params;
    const payload = parseOrderMutation(await request.json());
    const adm = createAdminClient();
    const { data, error } = await adm.rpc("update_order_atomic", {
      p_order_id: id,
      p_payload: payload,
      p_actor: user.id,
    });
    if (error) {
      const status = error.message.includes("not found") ? 404 : 409;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payload order tidak valid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
