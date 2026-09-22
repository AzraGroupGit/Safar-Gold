import { NextResponse } from "next/server";
import { parseGoldTypeUpdateInput } from "@/lib/admin-input";
import { internalServerError, validationError } from "@/lib/api-response";
import { updateGoldType } from "@/lib/gold-api";
import { requireRole } from "@/lib/supabase/server-user";

export async function PUT(request: Request) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseGoldTypeUpdateInput(body);
    if (!parsed.ok) return validationError(parsed.error);
    await updateGoldType(parsed.value.id, parsed.value.updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("gold-types.update", err);
  }
}
