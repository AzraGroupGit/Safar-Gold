import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const upsert = db.prepare("INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?");

    const tx = db.transaction(() => {
      if (body.hero) {
        upsert.run("hero_headline", body.hero.headline, body.hero.headline);
        upsert.run("hero_subheadline", body.hero.subheadline, body.hero.subheadline);
        upsert.run("hero_cta", body.hero.ctaText, body.hero.ctaText);
      }
    });
    tx();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
