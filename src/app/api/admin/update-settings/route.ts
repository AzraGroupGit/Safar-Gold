import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/supabase/server-user";

export async function POST(request: NextRequest) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const admin = createAdminClient();

    if (body.settings) {
      const entries = Object.entries(body.settings).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      await admin.from("app_settings").upsert(entries);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
