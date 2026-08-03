import { NextRequest, NextResponse } from "next/server";
import { updateGoldType } from "@/lib/gold-api";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, karat, weight, margin_buy, margin_sell } = body;

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) {
      const validCategories = ["lm", "bb-lm", "bb-perhiasan", "bb-logam"];
      if (!validCategories.includes(category)) {
        return NextResponse.json({ error: "Kategori tidak valid" }, { status: 400 });
      }
      updates.category = category;
    }
    if (karat !== undefined) updates.karat = karat;
    if (weight !== undefined) updates.weight = weight;
    if (margin_buy !== undefined) updates.margin_buy = margin_buy;
    if (margin_sell !== undefined) updates.margin_sell = margin_sell;

    await updateGoldType(id, updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
