import { NextResponse } from "next/server";
import { parseOrderMutation } from "@/lib/order-lifecycle";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  canAccessOrder,
  canManageOrder,
  protectOrderGp,
  redactOrderForRole,
} from "@/lib/permissions";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const auth = await requireCapability("orders:read-own");
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const adm = createAdminClient();
  const { data, error } = await adm.from("orders").select("*, order_items(*)").eq("id", id).single();
  if (error) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!canAccessOrder(auth.role, auth.user.id, data.created_by)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { data: creator } = data.created_by
    ? await adm.from("user_profiles").select("name, signature").eq("user_id", data.created_by).maybeSingle()
    : { data: null };
  return NextResponse.json({ order: redactOrderForRole(data, auth.role), creator: creator ?? null });
}

export async function DELETE(_request: Request, { params }: Context) {
  const auth = await requireCapability("orders:manage-own");
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const adm = createAdminClient();
  const { data: existing, error: lookupError } = await adm
    .from("orders")
    .select("created_by")
    .eq("id", id)
    .maybeSingle();
  if (lookupError || !existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!canManageOrder(auth.role, auth.user.id, existing.created_by)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { data, error } = await adm.rpc("cancel_order_atomic", { p_order_id: id, p_actor: auth.user.id });
  if (error) {
    const status = error.message.includes("not found") ? 404 : 409;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ success: true, order: data });
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const auth = await requireCapability("orders:manage-own");
    if (!auth.ok) return auth.response;
    const { id } = await params;
    const adm = createAdminClient();
    const { data: existing, error: lookupError } = await adm
      .from("orders")
      .select("created_by, gp")
      .eq("id", id)
      .maybeSingle();
    if (lookupError || !existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (!canManageOrder(auth.role, auth.user.id, existing.created_by)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const payload = protectOrderGp(parseOrderMutation(await request.json()), auth.role, existing.gp);
    const { data, error } = await adm.rpc("update_order_atomic", {
      p_order_id: id,
      p_payload: payload,
      p_actor: auth.user.id,
    });
    if (error) {
      const status = error.message.includes("not found") ? 404 : 409;
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
