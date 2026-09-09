import "server-only";

import { cache } from "react";
import { createAnonClient } from "@/lib/supabase/anon";

const GOLD_OUNCE_TO_GRAM = 31.1034768;

type SettingRow = { key: string; value: string | null };

const getSettingsMap = cache(async () => {
  const supabase = createAnonClient();
  const { data } = await supabase.from("app_settings").select("key, value");

  return new Map(
    ((data ?? []) as SettingRow[]).map(({ key, value }) => [key, value ?? ""]),
  );
});

function valueOr(map: Map<string, string>, key: string, fallback: string) {
  const value = map.get(key);
  return value && value !== "" ? value : fallback;
}

/** Read a public setting without issuing another query during the same server render. */
export async function getPublicSetting(key: string): Promise<string> {
  return (await getSettingsMap()).get(key) ?? "0";
}

export type PublicSettings = {
  phone: string;
  email: string;
  address: string;
  weekdayOpen: string;
  weekdayClose: string;
  saturdayOpen: string;
  saturdayClose: string;
};

export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  const map = await getSettingsMap();

  return {
    phone: valueOr(map, "phone", "+62 812-3456-7890"),
    email: valueOr(map, "email", "info@safargold.com"),
    address: valueOr(map, "address", "Jl. Emas No. 1, Jakarta"),
    weekdayOpen: valueOr(map, "weekday_open", "09:00"),
    weekdayClose: valueOr(map, "weekday_close", "17:00"),
    saturdayOpen: valueOr(map, "saturday_open", "09:00"),
    saturdayClose: valueOr(map, "saturday_close", "14:00"),
  };
});

export type HeroContent = {
  badge: string;
  headlineStart: string;
  headlineGradient: string;
  headlineEnd: string;
  subheadline: string;
  ctaText: string;
};

export const getHeroContent = cache(async (): Promise<HeroContent> => {
  const map = await getSettingsMap();

  return {
    badge: valueOr(map, "hero_badge", "Harga Real-time — Update Setiap 06:00 WIB"),
    headlineStart: valueOr(map, "hero_headline_start", "Emas Anda,"),
    headlineGradient: valueOr(map, "hero_headline_gradient", "Investasi Masa Depan"),
    headlineEnd: valueOr(map, "hero_headline_end", "Anda"),
    subheadline: valueOr(
      map,
      "hero_subheadline",
      "Pantau harga emas real-time, hitung transaksi dengan kalkulator cerdas, dan dapatkan harga terbaik — setiap hari, otomatis.",
    ),
    ctaText: valueOr(map, "hero_cta", "Cek Harga Hari Ini"),
  };
});

export const getPublicMarketInfo = cache(async () => {
  const map = await getSettingsMap();
  const usdIdrRate = parseFloat(valueOr(map, "usd_idr_rate", "0")) || 16300;
  const lastUpdate = valueOr(map, "last_price_update", "0");
  const xauUsdPerOzRaw = parseFloat(valueOr(map, "last_cron_xau_usd", "0")) || 0;
  const baseGoldIdr = parseFloat(valueOr(map, "harga_dasar_jual", "0")) || 0;
  const xauUsdPerOz = xauUsdPerOzRaw > 0
    ? xauUsdPerOzRaw
    : baseGoldIdr > 0
      ? Math.round((baseGoldIdr * GOLD_OUNCE_TO_GRAM) / usdIdrRate)
      : 0;

  return {
    usdIdrRate,
    xauUsdPerOz,
    xagUsdPerOz: parseFloat(valueOr(map, "last_cron_xag_usd", "0")) || 0,
    xpdUsdPerOz: parseFloat(valueOr(map, "last_cron_xpd_usd", "0")) || 0,
    lastUpdate,
  };
});
