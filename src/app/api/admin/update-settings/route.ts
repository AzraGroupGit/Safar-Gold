import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    const tx = db.transaction(() => {
      if (body.margins) {
        const updateMargin = db.prepare(
          "UPDATE gold_types SET margin_buy = ?, margin_sell = ? WHERE id = ?"
        );
        for (const [id, m] of Object.entries(body.margins)) {
          const { buy, sell } = m as { buy: number; sell: number };
          updateMargin.run(buy, sell, id);
        }
      }

      if (body.settings) {
        const upsert = db.prepare(
          "INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?"
        );
        for (const [key, value] of Object.entries(body.settings)) {
          upsert.run(key, String(value), String(value));
        }
      }
    });
    tx();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
