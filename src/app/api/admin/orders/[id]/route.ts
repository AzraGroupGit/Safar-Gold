import { NextResponse } from "next/server";
import { conflictError, internalServerError, logInternalError, validationError } from "@/lib/api-response";
import { parseOrderId, parseOrderMutation } from "@/lib/order-lifecycle";
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

function getErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null || !("message" in error)) return "";
  return typeof error.message === "string" ? error.message : "";
}

function orderNotFound() {
  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}

async function validatedOrderId(params: Context["params"]): Promise<string> {
  return parseOrderId((await params).id);
}

export async function GET(_request: Request, { params }: Context) {
  const auth = await requireCapability("orders:read-own");
  if (!auth.ok) return auth.response;
  let id;
  try {
    id = await validatedOrderId(params);
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "ID order tidak valid");
  }

  try {
    const adm = createAdminClient();
    const { data, error } = await adm.from("orders").select("*, order_items(*)").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") return orderNotFound();
      return internalServerError("orders.detail", error);
    }
    if (!data) return orderNotFound();
    if (!canAccessOrder(auth.role, auth.user.id, data.created_by)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let creator = null;
    if (data.created_by) {
      try {
        const creatorResult = await adm
          .from("user_profiles")
          .select("name, signature")
          .eq("user_id", data.created_by)
          .maybeSingle();
        if (creatorResult.error) {
          logInternalError("orders.detail.creator", creatorResult.error);
        } else {
          creator = creatorResult.data;
        }
      } catch (error) {
        logInternalError("orders.detail.creator", error);
      }
    }
    return NextResponse.json({ order: redactOrderForRole(data, auth.role), creator: creator ?? null });
  } catch (error) {
    return internalServerError("orders.detail", error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const auth = await requireCapability("orders:manage-own");
  if (!auth.ok) return auth.response;
  let id;
  try {
    id = await validatedOrderId(params);
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "ID order tidak valid");
  }

  try {
    const adm = createAdminClient();
    const { data: existing, error: lookupError } = await adm
      .from("orders")
      .select("created_by")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) return internalServerError("orders.cancel.lookup", lookupError);
    if (!existing) return orderNotFound();
    if (!canManageOrder(auth.role, auth.user.id, existing.created_by)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { data, error } = await adm.rpc("cancel_order_atomic", { p_order_id: id, p_actor: auth.user.id });
    if (error) {
      if (getErrorMessage(error).toLowerCase().includes("not found")) return orderNotFound();
      return internalServerError("orders.cancel", error);
    }
    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    return internalServerError("orders.cancel", error);
  }
}

export async function PUT(request: Request, { params }: Context) {
  const auth = await requireCapability("orders:manage-own");
  if (!auth.ok) return auth.response;
  let id;
  try {
    id = await validatedOrderId(params);
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "ID order tidak valid");
  }

  let parsedPayload;
  try {
    const body = await request.json().catch(() => null);
    parsedPayload = parseOrderMutation(body);
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "Payload order tidak valid");
  }

  try {
    const adm = createAdminClient();
    const { data: existing, error: lookupError } = await adm
      .from("orders")
      .select("created_by, gp")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) return internalServerError("orders.update.lookup", lookupError);
    if (!existing) return orderNotFound();
    if (!canManageOrder(auth.role, auth.user.id, existing.created_by)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const payload = protectOrderGp(parsedPayload, auth.role, existing.gp);
    const { data, error } = await adm.rpc("update_order_atomic", {
      p_order_id: id,
      p_payload: payload,
      p_actor: auth.user.id,
    });
    if (error) {
      const message = getErrorMessage(error).toLowerCase();
      if (message.includes("not found")) return orderNotFound();
      if (message.includes("insufficient stock")) {
        return conflictError("INSUFFICIENT_STOCK", "Stok tidak mencukupi");
      }
      if (message.includes("cancelled order")) {
        return conflictError("ORDER_CANCELLED", "Order yang dibatalkan tidak dapat diubah");
      }
      return internalServerError("orders.update", error);
    }
    const order = data && typeof data === "object"
      ? redactOrderForRole(data as Record<string, unknown>, auth.role)
      : data;
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return internalServerError("orders.update", error);
  }
}
