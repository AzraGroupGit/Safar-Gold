import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const admin = createAdminClient();

    if (body.hero) {
      const h = body.hero;
      const entries: { key: string; value: string }[] = [
        { key: "hero_badge", value: h.badge ?? "" },
        { key: "hero_headline_start", value: h.headlineStart ?? "" },
        { key: "hero_headline_gradient", value: h.headlineGradient ?? "" },
        { key: "hero_headline_end", value: h.headlineEnd ?? "" },
        { key: "hero_subheadline", value: h.subheadline ?? "" },
        { key: "hero_cta", value: h.ctaText ?? "" },
      ];
      await admin.from("app_settings").upsert(entries);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
