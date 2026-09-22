import { NextResponse } from "next/server";
import { parseGoldTypeCreateInput } from "@/lib/admin-input";
import { internalServerError, validationError } from "@/lib/api-response";
import { createGoldType } from "@/lib/gold-api";
import { requireRole } from "@/lib/supabase/server-user";

export async function POST(request: Request) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseGoldTypeCreateInput(body);
    if (!parsed.ok) return validationError(parsed.error);
    await createGoldType(parsed.value);

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("gold-types.create", err);
  }
}
