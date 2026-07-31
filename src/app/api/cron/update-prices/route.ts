import { NextResponse } from "next/server";
import { fetchInternationalGoldPrice, setSetting } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

export async function GET(_request: Request) {
  try {
    const { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate, error } =
      await fetchInternationalGoldPrice();

    const now = new Date().toISOString();

    await setSetting("last_cron_xau_usd", xauUsdPerOz.toString());
    await setSetting("last_cron_xag_usd", xagUsdPerOz.toString());
    await setSetting("last_cron_xpd_usd", xpdUsdPerOz.toString());
    await setSetting("last_cron_usd_idr", usdIdrRate.toString());
    await setSetting("last_cron_time", now);

    return NextResponse.json({
      success: true,
      xauUsdPerOz,
      xagUsdPerOz,
      xpdUsdPerOz,
      usdIdrRate,
      time: now,
      ...(error && { warning: error }),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
