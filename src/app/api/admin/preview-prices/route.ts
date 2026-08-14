import { NextResponse } from "next/server";
import { computePrices, getAllGoldTypes, getSetting, fetchInternationalGoldPrice, convertToIdrPerGram } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hargaDasarJual = parseFloat(body.hargaDasarJual) || 0;
    const acuanBuybackLM = parseFloat(body.acuanBuybackLM) || 0;
    const adjJual = parseFloat(body.adjJual) || 0;
    const adjBeli = parseFloat(body.adjBeli) || 0;
    const persenBuybackPerhiasan = parseFloat(body.persenBuybackPerhiasan) || 81;

    const [goldTypes, premiStr, spreadStr, international] = await Promise.all([
      getAllGoldTypes(),
      getSetting("premi_pecahan"),
      getSetting("spread_buyback_lm"),
      fetchInternationalGoldPrice(),
    ]);

    let premiPecahan: Record<string, number> = {};
    let spreadBuyback: Record<string, number> = {};
    try { premiPecahan = JSON.parse(premiStr); } catch {}
    try { spreadBuyback = JSON.parse(spreadStr); } catch {}

    const baseGold = convertToIdrPerGram(international.xauUsdPerOz, international.usdIdrRate);
    const baseSilver = convertToIdrPerGram(international.xagUsdPerOz, international.usdIdrRate);
    const basePalladium = convertToIdrPerGram(international.xpdUsdPerOz, international.usdIdrRate);

    const calculated = computePrices({
      goldTypes,
      hargaDasarJual,
      acuanBuybackLM,
      adjJual,
      adjBeli,
      persenBuybackPerhiasan,
      premiPecahan,
      spreadBuyback,
      baseGoldIdrPerGram: baseGold,
      baseSilverIdrPerGram: baseSilver,
      basePalladiumIdrPerGram: basePalladium,
    });

    const items = calculated.map((c) => ({
      id: c.gold_type.id,
      name: c.gold_type.name,
      category: c.gold_type.category,
      price: c.gold_type.category === "lm" ? c.buy_price : c.sell_price,
      weight: c.gold_type.weight,
      karat: c.gold_type.karat,
    }));

    return NextResponse.json({ success: true, items });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
