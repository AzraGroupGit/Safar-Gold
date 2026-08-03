import { NextRequest, NextResponse } from "next/server";
import { createGoldType } from "@/lib/gold-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, karat, weight, margin_buy, margin_sell } = body;

    if (!id || !name || !category) {
      return NextResponse.json({ error: "id, name, category wajib diisi" }, { status: 400 });
    }

    const validCategories = ["lm", "bb-lm", "bb-perhiasan", "bb-logam"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Kategori tidak valid" }, { status: 400 });
    }

    await createGoldType({
      id,
      name,
      category,
      karat: karat ?? null,
      weight: weight ?? null,
      margin_buy: margin_buy ?? 3.0,
      margin_sell: margin_sell ?? 2.0,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
