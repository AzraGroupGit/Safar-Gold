import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/supabase/server-user";
import { parseSettingsInput } from "@/lib/admin-input";
import { internalServerError, validationError } from "@/lib/api-response";

export async function POST(request: Request) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseSettingsInput(body);
    if (!parsed.ok) return validationError(parsed.error);

    const admin = createAdminClient();
    const { error } = await admin.from("app_settings").upsert(parsed.value);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("update-settings failed", err);
  }
}
