import { NextResponse } from "next/server";
import { calculatePrices, insertPriceHistory, setSetting } from "@/lib/gold-api";
import { fetchInternationalGoldPrice, convertToIdrPerGram } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hargaDasarJual, acuanBuybackLM, adjJual, adjBeli, adjPerhiasan, persenBuybackPerhiasan } = body;

    await setSetting("harga_dasar_jual", String(hargaDasarJual ?? 0));
    await setSetting("acuan_buyback_lm", String(acuanBuybackLM ?? 0));
    await setSetting("adjustment_jual", String(adjJual ?? 0));
    await setSetting("adjustment_beli", String(adjBeli ?? 0));
    await setSetting("adjustment_perhiasan", String(adjPerhiasan ?? 0));
    await setSetting("persen_buyback_perhiasan", String(persenBuybackPerhiasan ?? 81));

    const { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate, error, warning } =
      await fetchInternationalGoldPrice();
    const baseGold = convertToIdrPerGram(xauUsdPerOz, usdIdrRate);
    const baseSilver = convertToIdrPerGram(xagUsdPerOz, usdIdrRate);
    const basePalladium = convertToIdrPerGram(xpdUsdPerOz, usdIdrRate);

    const calculated = await calculatePrices(baseGold, baseSilver, basePalladium);
    const today = new Date().toISOString().split("T")[0];

    const priceRows = calculated.map((c) => ({
      date: today,
      gold_type_id: c.gold_type.id,
      base_price: c.base_price,
      buy_price: c.buy_price,
      sell_price: c.sell_price,
    }));

    await insertPriceHistory(priceRows);
    await setSetting("last_price_update", new Date().toISOString());

    const silverResult = calculated.find((c) => c.gold_type.id === "ll-perak");
    const palladiumResult = calculated.find((c) => c.gold_type.id === "ll-palladium");

    return NextResponse.json({
      success: true,
      count: priceRows.length,
      raw: { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate },
      computed: { baseGold, baseSilver, basePalladium },
      silver: silverResult ? { name: silverResult.gold_type.name, is_auto: silverResult.gold_type.is_auto, sell_price: silverResult.sell_price } : null,
      palladium: palladiumResult ? { name: palladiumResult.gold_type.name, is_auto: palladiumResult.gold_type.is_auto, sell_price: palladiumResult.sell_price } : null,
      goldTypes: calculated.map((c) => ({
        name: c.gold_type.name,
        buy: c.buy_price,
        sell: c.sell_price,
      })),
      ...(error && { error }),
      ...(warning && { warning }),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
