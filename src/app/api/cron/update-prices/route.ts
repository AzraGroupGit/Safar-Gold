import { NextResponse } from "next/server";
import { internalServerError } from "@/lib/api-response";
import { requireCronOrAdmin } from "@/lib/cron-auth";
import { fetchInternationalGoldPrice, getPrivateSetting, getSetting, setSetting } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

const GOLD_OZ = 31.1034768;

export async function GET(request: Request) {
  try {
    const authorization = await requireCronOrAdmin(request);
    if (!authorization.ok) return authorization.response;

    const { searchParams } = new URL(request.url);
    const isForced = searchParams.get("force") === "true";
    const today = new Date().toISOString().split("T")[0];

    if (!isForced) {
      const lastCronTime = await getPrivateSetting("last_cron_time");
      if (lastCronTime !== "0") {
        const lastDate = lastCronTime.split("T")[0];
        if (lastDate === today) {
          return NextResponse.json({
            success: true,
            skipped: true,
            message: `Already fetched today (${today}). Skipping.`,
            last_cron: lastCronTime,
          });
        }
      }
    }
    const { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate, xauSource, xagSource, xpdSource, warning } =
      await fetchInternationalGoldPrice();

    if (xauSource === "static" || !Number.isFinite(xauUsdPerOz) || xauUsdPerOz <= 0) {
      return NextResponse.json(
        { success: false, error: "Harga XAU valid belum tersedia; harga sebelumnya dipertahankan" },
        { status: 502 },
      );
    }

    const now = new Date().toISOString();
    const warnings: string[] = [];

    // Roll prev Emas Dunia sebelum data baru menimpa: prev = harga manual jika ada,
    // jika tidak = hitung dari data internasional terakhir (kemarin)
    const manualGlobal = parseInt(await getSetting("global_gold_price")) || 0;
    const prevXau = parseFloat(await getSetting("last_cron_xau_usd")) || 0;
    const prevXag = parseFloat(await getSetting("last_cron_xag_usd")) || 0;
    const prevXpd = parseFloat(await getSetting("last_cron_xpd_usd")) || 0;
    const prevUsd = parseFloat(await getPrivateSetting("last_cron_usd_idr")) || 0;
    // Data sebelum perbaikan dapat berisi trio placeholder; jangan jadikan pembanding harga valid pertama.
    const wasStaticPlaceholder = manualGlobal <= 0 && prevXau === 2400 && prevXag === 30 && prevXpd === 1000;
    let prevGlobal = manualGlobal;
    if (prevGlobal <= 0 && prevXau > 0 && prevUsd > 0) {
      prevGlobal = Math.round((prevXau * prevUsd) / GOLD_OZ);
    }
    if (wasStaticPlaceholder) {
      await setSetting("global_gold_price_prev", "0");
    } else if (prevGlobal > 0) {
      await setSetting("global_gold_price_prev", String(prevGlobal));
    }

    await setSetting("last_cron_xau_usd", xauUsdPerOz.toString());
    if (xagSource !== "static" && xagUsdPerOz > 0) {
      await setSetting("last_cron_xag_usd", xagUsdPerOz.toString());
    } else {
      warnings.push("XAG static fallback not saved");
    }
    if (xpdSource !== "static" && xpdUsdPerOz > 0) {
      await setSetting("last_cron_xpd_usd", xpdUsdPerOz.toString());
    } else {
      warnings.push("XPD static fallback not saved");
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
      sources: { xau: xauSource, xag: xagSource, xpd: xpdSource },
      time: now,
      ...(warning && { warning }),
      ...(warnings.length > 0 && { save_warnings: warnings }),
    });
  } catch (err) {
    return internalServerError("cron.update-prices", err);
  }
}
