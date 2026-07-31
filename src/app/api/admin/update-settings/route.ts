import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
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
