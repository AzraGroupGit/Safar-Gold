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

async function getSettingOr(key: string, fallback: string): Promise<string> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return data && data.value !== "" ? data.value : fallback;
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

export async function getGoldTypesByCategory(category: string): Promise<GoldTypeRow[]> {
  const supabase = createAnonClient();
  const { data } = await supabase
    .from("gold_types")
    .select("*")
    .eq("category", category)
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

export async function getPriceHistory(goldTypeId: string, days = 30): Promise<PriceHistoryRow[]> {
  const supabase = createAnonClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];
  const { data } = await supabase
    .from("price_history")
    .select("*")
    .eq("gold_type_id", goldTypeId)
    .gte("date", sinceStr)
    .order("date", { ascending: false });
  return (data ?? []) as PriceHistoryRow[];
}

/** Update jenis emas — admin client. */
export async function updateGoldType(id: string, data: Partial<GoldTypeRow>) {
  const supabase = createAdminClient();
  await supabase.from("gold_types").update(data).eq("id", id);
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
export async function calculatePrices(basePricePerGramIdr: number) {
  const goldTypes = await getAllGoldTypes();

  return goldTypes.map((gt) => {
    if (gt.is_auto) {
      const buyPrice = Math.round(basePricePerGramIdr * (1 + gt.margin_buy / 100));
      const sellPrice = Math.round(basePricePerGramIdr * (1 - gt.margin_sell / 100));
      return {
        gold_type: gt,
        base_price: Math.round(basePricePerGramIdr),
        buy_price: buyPrice,
        sell_price: sellPrice,
      };
    }
    return {
      gold_type: gt,
      base_price: Math.round(basePricePerGramIdr),
      buy_price: gt.manual_buy ?? 0,
      sell_price: gt.manual_sell ?? 0,
    };
  });
}

// ---------- International Price Fetch ----------
export async function fetchInternationalGoldPrice(): Promise<{
  xauUsdPerOz: number;
  usdIdrRate: number;
  error?: string;
}> {
  const apiKey = await getSetting("api_key");

  if (!apiKey || apiKey === "0") {
    return await fetchFallbackPrice();
  }

  try {
    const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
      headers: { "x-access-token": apiKey, "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const fallback = await fetchFallbackPrice();
      return { ...fallback, error: `GoldAPI error: ${res.status}` };
    }

    const data = await res.json();
    const xauUsdPerOz = data.price;

    let usdIdrRate = parseFloat(await getSetting("usd_idr_rate"));
    if (!usdIdrRate || isNaN(usdIdrRate)) usdIdrRate = 16300;

    try {
      const fxRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        const rate = fxData.rates?.IDR;
        if (rate) {
          usdIdrRate = rate;
          await setSetting("usd_idr_rate", rate.toString());
        }
      }
    } catch {
      // fallback ke rate tersimpan
    }

    return { xauUsdPerOz, usdIdrRate };
  } catch {
    const fallback = await fetchFallbackPrice();
    return { ...fallback, error: "Network error, using fallback" };
  }
}

async function fetchFallbackPrice(): Promise<{ xauUsdPerOz: number; usdIdrRate: number }> {
  const usdIdrRate = parseFloat(await getSetting("usd_idr_rate")) || 16300;

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=usd"
    );
    if (res.ok) {
      const data = await res.json();
      const xauUsdPerOz = data.gold?.usd;
      if (xauUsdPerOz) return { xauUsdPerOz, usdIdrRate };
    }
  } catch {
    // lanjut ke fallback statis
  }

  return { xauUsdPerOz: 2400, usdIdrRate };
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
