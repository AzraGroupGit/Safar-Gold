import { NextResponse } from "next/server";
import { parseHeroContentInput } from "@/lib/admin-input";
import { internalServerError, validationError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/supabase/server-user";

export async function POST(request: Request) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseHeroContentInput(body);
    if (!parsed.ok) return validationError(parsed.error);

    const admin = createAdminClient();
    const hero = parsed.value;
    const entries: { key: string; value: string }[] = [
      { key: "hero_badge", value: hero.badge },
      { key: "hero_headline_start", value: hero.headlineStart },
      { key: "hero_headline_gradient", value: hero.headlineGradient },
      { key: "hero_headline_end", value: hero.headlineEnd },
      { key: "hero_subheadline", value: hero.subheadline },
      { key: "hero_cta", value: hero.ctaText },
    ];
    const { error } = await admin.from("app_settings").upsert(entries);
    if (error) return internalServerError("content.save", error);

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("content.save", err);
  }
}
