import { NextResponse } from "next/server";
import {
  fetchInternationalGoldPrice,
  calculatePrices,
  convertToIdrPerGram,
  insertPriceHistory,
  setSetting,
} from "@/lib/gold-api";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate, error } =
      await fetchInternationalGoldPrice();
    const baseGoldIdr = convertToIdrPerGram(xauUsdPerOz, usdIdrRate);
    const baseSilverIdr = convertToIdrPerGram(xagUsdPerOz, usdIdrRate);
    const basePalladiumIdr = convertToIdrPerGram(xpdUsdPerOz, usdIdrRate);

    const calculated = await calculatePrices(baseGoldIdr, baseSilverIdr, basePalladiumIdr);
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

    return NextResponse.json({
      success: true,
      date: today,
      baseGold: baseGoldIdr,
      baseSilver: baseSilverIdr,
      basePalladium: basePalladiumIdr,
      xauUsdPerOz,
      xagUsdPerOz,
      xpdUsdPerOz,
      usdIdrRate,
      goldTypes: calculated.map((c) => ({
        name: c.gold_type.name,
        buy: c.buy_price,
        sell: c.sell_price,
      })),
      ...(error && { warning: error }),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
