import { NextResponse } from "next/server";
import { fetchInternationalGoldPrice, setSetting } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

export async function GET(_request: Request) {
  try {
    const { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate, error, warning } =
      await fetchInternationalGoldPrice();

    const now = new Date().toISOString();
    const warnings: string[] = [];

    if (xauUsdPerOz > 0) {
      await setSetting("last_cron_xau_usd", xauUsdPerOz.toString());
    } else {
      warnings.push("XAU price is 0, not saved");
    }
    if (xagUsdPerOz > 0) {
      await setSetting("last_cron_xag_usd", xagUsdPerOz.toString());
    } else {
      warnings.push("XAG price is 0, not saved");
    }
    if (xpdUsdPerOz > 0) {
      await setSetting("last_cron_xpd_usd", xpdUsdPerOz.toString());
    } else {
      warnings.push("XPD price is 0, not saved");
    }
    if (usdIdrRate > 0) {
      await setSetting("last_cron_usd_idr", usdIdrRate.toString());
    }
    await setSetting("last_cron_time", now);

    return NextResponse.json({
      success: true,
      xauUsdPerOz,
      xagUsdPerOz,
      xpdUsdPerOz,
      usdIdrRate,
      time: now,
      ...(error && { error }),
      ...(warning && { warning }),
      ...(warnings.length > 0 && { save_warnings: warnings }),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
