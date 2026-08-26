import { NextResponse } from "next/server";
import { fetchInternationalGoldPrice, getSetting, setSetting } from "@/lib/gold-api";
import { createAnonClient } from "@/lib/supabase/anon";

export const dynamic = "force-dynamic";

const GOLD_OZ = 31.1034768;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isForced = searchParams.get("force") === "true";
    const today = new Date().toISOString().split("T")[0];

    if (!isForced) {
      const supabase = createAnonClient();
      const { data: lastCron } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "last_cron_time")
        .single();

      if (lastCron?.value) {
        const lastDate = lastCron.value.split("T")[0];
        if (lastDate === today) {
          return NextResponse.json({
            success: true,
            skipped: true,
            message: `Already fetched today (${today}). Skipping.`,
            last_cron: lastCron.value,
          });
        }
      }
    }
    const { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate, error, warning } =
      await fetchInternationalGoldPrice();

    const now = new Date().toISOString();
    const warnings: string[] = [];

    // Roll prev Emas Dunia sebelum data baru menimpa: prev = harga manual jika ada,
    // jika tidak = hitung dari data internasional terakhir (kemarin)
    if (xauUsdPerOz > 0) {
      const manualGlobal = parseInt(await getSetting("global_gold_price")) || 0;
      const prevXau = parseFloat(await getSetting("last_cron_xau_usd")) || 0;
      const prevUsd = parseFloat(await getSetting("last_cron_usd_idr")) || 0;
      let prevGlobal = manualGlobal;
      if (prevGlobal <= 0 && prevXau > 0 && prevUsd > 0) {
        prevGlobal = Math.round((prevXau * prevUsd) / GOLD_OZ);
      }
      if (prevGlobal > 0) {
        await setSetting("global_gold_price_prev", String(prevGlobal));
      }
    }

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
      { status: 500 },
    );
  }
}
