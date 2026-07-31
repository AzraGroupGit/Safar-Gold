import { createAnonClient } from "./supabase/anon";
import { createAdminClient } from "./supabase/admin";

const GOLD_OUNCE_TO_GRAM = 31.1034768;

// ---------- Types ----------
export interface GoldTypeRow {
  id: string;
  name: string;
  karat: number | null;
  weight: number | null;
  category: string;
  margin_buy: number;
  margin_sell: number;
  is_auto: boolean;
  manual_buy: number | null;
  manual_sell: number | null;
}

export interface PriceHistoryRow {
  id: number;
  date: string;
  gold_type_id: string;
  base_price: number;
  buy_price: number;
  sell_price: number;
  created_at: string;
}

export interface AppSettingRow {
  key: string;
  value: string;
}

// ---------- Settings ----------
async function getSetting(key: string): Promise<string> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return data?.value ?? "0";
}

/** Tulis setting — pakai admin client (service role, lewati RLS). */
export async function setSetting(key: string, value: string) {
  const supabase = createAdminClient();
  await supabase.from("app_settings").upsert({ key, value });
}

// ---------- Market Info ----------
export async function getMarketInfo() {
  const usdIdrRate = parseFloat(await getSetting("usd_idr_rate")) || 16300;
  const lastUpdate = await getSetting("last_price_update");
  const todayPrices = await getTodayPrices();
  const antam = todayPrices.find((p) => p.gold_type_id === "antam-100");
  const xauUsdPerOz = antam
    ? Math.round((antam.base_price * GOLD_OUNCE_TO_GRAM) / usdIdrRate)
    : 0;
  return { usdIdrRate, xauUsdPerOz, lastUpdate };
}

// ---------- Hero Content ----------
export type HeroContent = {
  badge: string;
  headlineStart: string;
  headlineGradient: string;
  headlineEnd: string;
  subheadline: string;
  ctaText: string;
};

export async function getHeroContent(): Promise<HeroContent> {
  const supabase = createAnonClient();
  const { data } = await supabase.from("app_settings").select("key, value");
  const map = new Map((data ?? []).map((r) => [r.key, r.value]));
  const or = (key: string, fallback: string) => {
    const v = map.get(key);
    return v && v !== "" ? v : fallback;
  };

  return {
    badge: or("hero_badge", "Harga Real-time — Update Setiap 06:00 WIB"),
    headlineStart: or("hero_headline_start", "Emas Anda,"),
    headlineGradient: or("hero_headline_gradient", "Investasi Masa Depan"),
    headlineEnd: or("hero_headline_end", "Anda"),
    subheadline: or(
      "hero_subheadline",
      "Pantau harga emas real-time, hitung transaksi dengan kalkulator cerdas, dan dapatkan harga terbaik — setiap hari, otomatis."
    ),
    ctaText: or("hero_cta", "Cek Harga Hari Ini"),
  };
}

// ---------- Gold Types ----------
export async function getAllGoldTypes(): Promise<GoldTypeRow[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("gold_types")
    .select("*")
    .order("category", { ascending: true })
    .order("weight", { ascending: true })
    .order("karat", { ascending: false });
  return (data ?? []) as GoldTypeRow[];
}

// ---------- Prices ----------
export async function getTodayPrices(): Promise<PriceHistoryRow[]> {
  const supabase = createAnonClient();
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("price_history")
    .select("*")
    .eq("date", today);
  return (data ?? []) as PriceHistoryRow[];
}

/** Insert/replace harga hari ini — admin client, upsert pada (date, gold_type_id). */
export async function insertPriceHistory(
  prices: Omit<PriceHistoryRow, "id" | "created_at">[]
) {
  const supabase = createAdminClient();
  await supabase
    .from("price_history")
    .upsert(prices, { onConflict: "date,gold_type_id" });
}

// ---------- Price Calculation ----------
export async function calculatePrices(
  baseGoldIdrPerGram: number,
  baseSilverIdrPerGram: number,
  basePalladiumIdrPerGram: number
) {
  const goldTypes = await getAllGoldTypes();

  // Baca parameter dari settings
  const hargaDasarJual = parseFloat(await getSetting("harga_dasar_jual")) || 0;
  const acuanBuybackLM = parseFloat(await getSetting("acuan_buyback_lm")) || 0;
  const adjJual = parseFloat(await getSetting("adjustment_jual")) || 0;
  const adjBeli = parseFloat(await getSetting("adjustment_beli")) || 0;
  const adjPerhiasan = parseFloat(await getSetting("adjustment_perhiasan")) || 0;

  const premiStr = await getSetting("premi_pecahan");
  const spreadStr = await getSetting("spread_buyback_lm");
  const offsetK24s = parseFloat(await getSetting("offset_perhiasan_k24s")) || 320000;
  const offsetK24 = parseFloat(await getSetting("offset_perhiasan_k24")) || 50000;
  const dasarPerhiasanOffset = parseFloat(await getSetting("dasar_perhiasan_offset")) || 505000;

  let premiPecahan: Record<string, number> = {};
  let spreadBuyback: Record<string, number> = {};
  try { premiPecahan = JSON.parse(premiStr); } catch { console.error("Failed to parse premi_pecahan JSON"); }
  try { spreadBuyback = JSON.parse(spreadStr); } catch { console.error("Failed to parse spread_buyback_lm JSON"); }

  return goldTypes.map((gt) => {
    const category = gt.category;

    // ---- Logam Lain (Silver/Palladium) ----
    if (category === "bb-logam") {
      const isSilver = gt.id === "ll-perak";
      const base = isSilver ? baseSilverIdrPerGram : basePalladiumIdrPerGram;
      return {
        gold_type: gt,
        base_price: Math.round(base),
        buy_price: 0,
        sell_price: gt.is_auto ? Math.round(base) : (gt.manual_sell ?? 0),
      };
    }

    // ---- Perhiasan ----
    if (category === "bb-perhiasan") {
      const karat = gt.karat ?? 24;
      if (karat === 24 && gt.id === "ph-k24s") {
        // K24* = acuan_buyback_lm - offset
        const price = acuanBuybackLM - offsetK24s + adjPerhiasan;
        return { gold_type: gt, base_price: Math.round(baseGoldIdrPerGram), buy_price: 0, sell_price: Math.round(price) };
      }
      if (karat === 24 && gt.id === "ph-k24") {
        // K24 = K24* - offset
        const k24sPrice = acuanBuybackLM - offsetK24s + adjPerhiasan;
        return { gold_type: gt, base_price: Math.round(baseGoldIdrPerGram), buy_price: 0, sell_price: Math.round(k24sPrice - offsetK24) };
      }
      if (karat >= 23) {
        // K23: dasar_perhiasan × 95.83% + premium ~100rb
        const dasar = acuanBuybackLM - dasarPerhiasanOffset + adjPerhiasan;
        const karatMult = karat / 24;
        const premium = 100000; // bisa dijadikan setting nanti
        return { gold_type: gt, base_price: Math.round(baseGoldIdrPerGram), buy_price: 0, sell_price: Math.round(dasar * karatMult + premium) };
      }
      // K6 - K22
      const dasar = acuanBuybackLM - dasarPerhiasanOffset + adjPerhiasan;
      const karatMult = karat / 24;
      return { gold_type: gt, base_price: Math.round(baseGoldIdrPerGram), buy_price: 0, sell_price: Math.round(dasar * karatMult) };
    }

    // ---- Buyback LM ----
    if (category === "bb-lm") {
      const spread = spreadBuyback[gt.id] ?? 0;
      const buybackPrice = acuanBuybackLM + spread + adjBeli;
      return {
        gold_type: gt,
        base_price: Math.round(baseGoldIdrPerGram),
        buy_price: 0,
        sell_price: gt.is_auto ? Math.round(buybackPrice) : (gt.manual_sell ?? 0),
      };
    }

    // ---- LM Jual ----
    if (category === "lm") {
      const premi = premiPecahan[String(gt.weight ?? 1)] ?? 0;
      const jualPrice = hargaDasarJual + premi + adjJual;
      return {
        gold_type: gt,
        base_price: Math.round(baseGoldIdrPerGram),
        buy_price: gt.is_auto ? Math.round(jualPrice) : (gt.manual_buy ?? 0),
        sell_price: 0,
      };
    }

    return {
      gold_type: gt,
      base_price: Math.round(baseGoldIdrPerGram),
      buy_price: 0,
      sell_price: 0,
    };
  });
}

// ---------- International Price Fetch ----------
export async function fetchInternationalGoldPrice(): Promise<{
  xauUsdPerOz: number;
  xagUsdPerOz: number;
  xpdUsdPerOz: number;
  usdIdrRate: number;
  error?: string;
}> {
  const apiKey = await getSetting("api_key");
  const fallback = await fetchAllFallbackPrices();

  // Fetch XAU/USD dari GoldAPI
  let xauUsdPerOz = 0;
  let xagUsdPerOz = fallback.xagUsdPerOz;
  let xpdUsdPerOz = fallback.xpdUsdPerOz;
  let apiError: string | undefined;

  const validApi = apiKey && apiKey !== "0" && apiKey !== "";

  if (validApi) {
    try {
      const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
        headers: { "x-access-token": apiKey, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        xauUsdPerOz = data.price;
      } else {
        apiError = `GoldAPI XAU error: ${res.status}`;
      }
    } catch (e) {
      console.error("GoldAPI XAU fetch failed:", e);
      apiError = "GoldAPI network error";
    }

    // Fetch XAG/USD (Perak)
    try {
      const res = await fetch("https://www.goldapi.io/api/XAG/USD", {
        headers: { "x-access-token": apiKey, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        xagUsdPerOz = data.price;
      }
    } catch (e) { console.error("GoldAPI XAG fetch failed:", e); }

    // Fetch XPD/USD (Palladium)
    try {
      const res = await fetch("https://www.goldapi.io/api/XPD/USD", {
        headers: { "x-access-token": apiKey, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        xpdUsdPerOz = data.price;
      }
    } catch (e) { console.error("GoldAPI XPD fetch failed:", e); }
  }

  // Jika XAU gagal → full fallback
  if (!xauUsdPerOz) {
    return { ...fallback, error: apiError };
  }

  // Kurs USD/IDR — JISDOR (frankfurter.app) → fallback exchangerate-api
  let usdIdrRate = parseFloat(await getSetting("usd_idr_rate"));
  if (!usdIdrRate || isNaN(usdIdrRate)) usdIdrRate = 16300;

  try {
    const biRes = await fetch("https://api.frankfurter.app/latest?from=USD&to=IDR");
    if (biRes.ok) {
      const biData = await biRes.json();
      if (biData.rates?.IDR) {
        usdIdrRate = biData.rates.IDR;
        await setSetting("usd_idr_rate", usdIdrRate.toString());
      }
    } else {
      throw new Error("JISDOR failed");
    }
  } catch (e) {
    console.error("JISDOR fetch failed, trying exchangerate-api:", e);
    try {
      const fxRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        if (fxData.rates?.IDR) {
          usdIdrRate = fxData.rates.IDR;
          await setSetting("usd_idr_rate", usdIdrRate.toString());
        }
      }
    } catch (e2) { console.error("exchangerate-api also failed:", e2); }
  }

  return { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate };
}

async function fetchAllFallbackPrices(): Promise<{
  xauUsdPerOz: number;
  xagUsdPerOz: number;
  xpdUsdPerOz: number;
  usdIdrRate: number;
}> {
  const usdIdrRate = parseFloat(await getSetting("usd_idr_rate")) || 16300;
  let xau = 2400, xag = 30, xpd = 1000;

  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=gold%2Csilver%2Cpalladium&vs_currencies=usd");
    if (res.ok) {
      const data = await res.json();
      if (data.gold?.usd) xau = data.gold.usd;
      if (data.silver?.usd) xag = data.silver.usd;
      if (data.palladium?.usd) xpd = data.palladium.usd;
    }
  } catch (e) { console.error("CoinGecko fetch failed:", e); }

  return { xauUsdPerOz: xau, xagUsdPerOz: xag, xpdUsdPerOz: xpd, usdIdrRate };
}

export function convertToIdrPerGram(usdPerOz: number, usdIdrRate: number): number {
  return (usdPerOz * usdIdrRate) / GOLD_OUNCE_TO_GRAM;
}

// ---------- Formatted Prices ----------
export type FormattedPrice = {
  id: string;
  goldTypeId: string;
  goldName: string;
  karat: number | null;
  weight: number | null;
  category: string;
  buyPrice: number;
  sellPrice: number;
  basePrice: number;
  date: string;
  spread: number;
  spreadPercent: string;
  lastUpdated: string;
};

export async function getFormattedTodayPrices(): Promise<FormattedPrice[]> {
  const [todayPrices, goldTypes] = await Promise.all([
    getTodayPrices(),
    getAllGoldTypes(),
  ]);

  if (todayPrices.length === 0) {
    return goldTypes.map((gt) => ({
      id: `empty-${gt.id}`,
      goldTypeId: gt.id,
      goldName: gt.name,
      karat: gt.karat,
      weight: gt.weight,
      category: gt.category,
      buyPrice: 0,
      sellPrice: 0,
      basePrice: 0,
      date: new Date().toISOString().split("T")[0],
      spread: 0,
      spreadPercent: "0.0",
      lastUpdated: "",
    }));
  }

  return todayPrices.map((p) => {
    const gt = goldTypes.find((g) => g.id === p.gold_type_id);
    const spread = p.buy_price - p.sell_price;
    return {
      id: `p-${p.id}`,
      goldTypeId: p.gold_type_id,
      goldName: gt?.name ?? p.gold_type_id,
      karat: gt?.karat ?? null,
      weight: gt?.weight ?? null,
      category: gt?.category ?? "",
      buyPrice: p.buy_price,
      sellPrice: p.sell_price,
      basePrice: p.base_price,
      date: p.date,
      spread,
      spreadPercent: p.buy_price > 0 ? ((spread / p.buy_price) * 100).toFixed(1) : "0.0",
      lastUpdated: p.created_at,
    };
  });
}

// ---------- Formatters ----------
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
