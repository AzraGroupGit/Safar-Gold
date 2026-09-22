import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/supabase/server-user";
import { parseUserProfileInput } from "@/lib/admin-input";
import { internalServerError, validationError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireRole("admin", "cs");
  if (!auth.ok) return auth.response;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ profile: null });
  if (userId !== auth.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const adm = createAdminClient();
  const { data, error } = await adm
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return internalServerError("user profile load failed", error);

  return NextResponse.json({ profile: data ?? null });
}

export async function PUT(request: Request) {
  const auth = await requireRole("admin", "cs");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseUserProfileInput(body);
    if (!parsed.ok) return validationError(parsed.error);
    const { userId, name, signature } = parsed.value;
    if (userId !== auth.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adm = createAdminClient();
    const { error } = await adm.from("user_profiles").upsert({
      user_id: userId,
      name: name ?? null,
      signature: signature ?? null,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("user profile save failed", err);
  }
}
