import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const db = getDb();
    const update = db.prepare("UPDATE gold_types SET is_auto = ? WHERE id = ?");

    const tx = db.transaction(() => {
      for (const item of body) {
        update.run(item.isAuto ? 1 : 0, item.id);
      }
    });
    tx();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
