import { NextResponse } from "next/server";
import {
  fetchInternationalGoldPrice,
  calculatePrices,
  convertToIdrPerGram,
  insertPriceHistory,
  setSetting,
} from "@/lib/gold-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { xauUsdPerOz, usdIdrRate, error } = await fetchInternationalGoldPrice();
    const basePricePerGramIdr = convertToIdrPerGram(xauUsdPerOz, usdIdrRate);

    const calculated = await calculatePrices(basePricePerGramIdr);
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
      basePricePerGramIdr,
      xauUsdPerOz,
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
