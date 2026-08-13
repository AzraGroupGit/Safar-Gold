import { createAnonClient } from "./supabase/anon";
import { createAdminClient } from "./supabase/admin";

const GOLD_OUNCE_TO_GRAM = 31.1034768;

// Urutan tampilan Buyback Logam Mulia — dari certi terkecil ke merek lain
export const BB_LM_ORDER = [
  "bb-certi-1-2",
  "bb-certi-3-5",
  "bb-certi-10-25",
  "bb-certi-50-100",
  "bb-non-rm",
  "bb-retro",
  "bb-merek-lain",
];

// Rank perhiasan: K24* di atas K24, lalu descending karat
export function perhiasanRank(id: string): number {
  if (id === "ph-k24s") return 25;
  const m = id.match(/ph-k(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

// Urutan tampilan Logam Lain — Perak dulu, lalu Palladium
export const BB_LOGAM_ORDER = ["ll-perak", "ll-palladium"];

function orderIndex(arr: string[], id: string): number {
  const i = arr.indexOf(id);
  return i === -1 ? 999 : i;
}

// Urutan kanonik seluruh gold_types (kategori + dalam kategori)
export function sortGoldTypes<T extends { id: string; category: string; weight?: number | null; karat?: number | null }>(gts: T[]): T[] {
  const CATEGORY_ORDER = ["lm", "bb-lm", "bb-perhiasan", "bb-logam"];
  return [...gts].sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    if (a.category === "lm") return (a.weight ?? 0) - (b.weight ?? 0);
    if (a.category === "bb-lm") return orderIndex(BB_LM_ORDER, a.id) - orderIndex(BB_LM_ORDER, b.id);
    if (a.category === "bb-perhiasan") return perhiasanRank(b.id) - perhiasanRank(a.id);
    if (a.category === "bb-logam") return orderIndex(BB_LOGAM_ORDER, a.id) - orderIndex(BB_LOGAM_ORDER, b.id);
    return 0;
  });
}

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
export async function getSetting(key: string): Promise<string> {
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
  const xauUsdPerOzRaw = parseFloat(await getSetting("last_cron_xau_usd")) || 0;
  let xauUsdPerOz = xauUsdPerOzRaw;
  if (xauUsdPerOz <= 0) {
    const baseGoldIdr = parseFloat(await getSetting("harga_dasar_jual")) || 0;
    xauUsdPerOz = baseGoldIdr > 0
      ? Math.round((baseGoldIdr * GOLD_OUNCE_TO_GRAM) / usdIdrRate)
      : 0;
  }
  const xagUsdPerOz = parseFloat(await getSetting("last_cron_xag_usd")) || 0;
  const xpdUsdPerOz = parseFloat(await getSetting("last_cron_xpd_usd")) || 0;
  return { usdIdrRate, xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, lastUpdate };
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

export async function createGoldType(gt: Omit<GoldTypeRow, "is_auto" | "manual_buy" | "manual_sell">) {
  const supabase = createAdminClient();
  await supabase.from("gold_types").insert({ ...gt, is_auto: true });
}

export async function updateGoldType(id: string, updates: Partial<Omit<GoldTypeRow, "id">>) {
  const supabase = createAdminClient();
  await supabase.from("gold_types").update(updates).eq("id", id);
}

export async function deleteGoldType(id: string) {
  const supabase = createAdminClient();
  await supabase.from("gold_types").delete().eq("id", id);
}

// ---------- Prices ----------
export async function getTodayPrices(): Promise<PriceHistoryRow[]> {
  const supabase = createAnonClient();
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("price_history")
    .select("*")
    .eq("date", today);
  if (data && data.length > 0) return data as PriceHistoryRow[];

  const { data: latestDates } = await supabase
    .from("price_history")
    .select("date")
    .order("date", { ascending: false })
    .limit(1);
  if (latestDates && latestDates.length > 0) {
    const { data: fallback } = await supabase
      .from("price_history")
      .select("*")
      .eq("date", latestDates[0].date);
    return (fallback ?? []) as PriceHistoryRow[];
  }

  return [];
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
      // Referensi: harga Merek Lain (acuan + spread + adjBeli)
      const merekLain = acuanBuybackLM + (spreadBuyback["bb-merek-lain"] ?? 0) + adjBeli;
      if (karat === 24 && gt.id === "ph-k24s") {
        // K24* = Merek Lain − 100.000
        const price = merekLain - 100000;
        return { gold_type: gt, base_price: Math.round(baseGoldIdrPerGram), buy_price: 0, sell_price: Math.round(price) };
      }
      if (karat === 24 && gt.id === "ph-k24") {
        // K24 = K24* − 75.000
        const price = merekLain - 100000 - 75000;
        return { gold_type: gt, base_price: Math.round(baseGoldIdrPerGram), buy_price: 0, sell_price: Math.round(price) };
      }
      if (karat >= 23) {
        // K23 = K24 − 110.000 (K24 = merekLain − 175.000)
        const price = merekLain - 175000 - 110000;
        return { gold_type: gt, base_price: Math.round(baseGoldIdrPerGram), buy_price: 0, sell_price: Math.round(price) };
      }
      // K6 - K22 (tidak berubah)
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
  warning?: string;
}> {
  const apiKey = await getSetting("api_key");
  const fallback = await fetchAllFallbackPrices();

  let xauUsdPerOz = 0;
  let xagUsdPerOz = fallback.xagUsdPerOz;
  let xpdUsdPerOz = fallback.xpdUsdPerOz;
  let usdIdrRate = 0;
  let apiError: string | undefined;
  const warnings: string[] = [];

  const validApi = apiKey && apiKey !== "0" && apiKey !== "";

  if (validApi) {
    try {
      const res = await fetch(
        `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU,XAG,XPD,IDR`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.rates) {
          if (typeof data.rates.XAU === "number" && data.rates.XAU > 0) {
            xauUsdPerOz = Math.round(1 / data.rates.XAU);
          }
          if (typeof data.rates.XAG === "number" && data.rates.XAG > 0) {
            xagUsdPerOz = Math.round((1 / data.rates.XAG) * 100) / 100;
          }
          if (typeof data.rates.XPD === "number" && data.rates.XPD > 0) {
            xpdUsdPerOz = Math.round((1 / data.rates.XPD) * 100) / 100;
          }
          if (typeof data.rates.IDR === "number" && data.rates.IDR > 0) {
            usdIdrRate = data.rates.IDR;
            await setSetting("usd_idr_rate", usdIdrRate.toString());
          }
          if (!xauUsdPerOz) {
            apiError = "MetalpriceAPI: XAU price missing or zero";
          }
        } else {
          apiError = `MetalpriceAPI: ${data.error?.info ?? "unknown error"}`;
        }
      } else {
        apiError = `MetalpriceAPI error: ${res.status}`;
      }
    } catch (e) {
      console.error("MetalpriceAPI fetch failed:", e);
      apiError = "MetalpriceAPI network error";
    }
  }

  // Jika XAU gagal → full fallback
  if (!xauUsdPerOz) {
    return { ...fallback, error: apiError };
  }

  // Jika XAG/XPD gagal → pakai fallback
  if (xagUsdPerOz === fallback.xagUsdPerOz) {
    warnings.push("XAG using fallback");
  }
  if (xpdUsdPerOz === fallback.xpdUsdPerOz) {
    warnings.push("XPD using fallback");
  }

  // Kurs USD/IDR — jika belum didapat dari MetalpriceAPI, fallback frankfurter
  if (!usdIdrRate) {
    usdIdrRate = parseFloat(await getSetting("usd_idr_rate"));
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
  }

  return { xauUsdPerOz, xagUsdPerOz, xpdUsdPerOz, usdIdrRate, ...(warnings.length > 0 && { warning: warnings.join("; ") }) };
}

async function fetchAllFallbackPrices(): Promise<{
  xauUsdPerOz: number;
  xagUsdPerOz: number;
  xpdUsdPerOz: number;
  usdIdrRate: number;
}> {
  const usdIdrRate = parseFloat(await getSetting("usd_idr_rate")) || 16300;
  const DEFAULT_XAU = 2400;
  const DEFAULT_XAG = 30;
  const DEFAULT_XPD = 1000;

  let xau = DEFAULT_XAU;
  let xag = DEFAULT_XAG;
  let xpd = DEFAULT_XPD;

  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=gold,silver,palladium&vs_currencies=usd");
    if (res.ok) {
      const data = await res.json();
      if (typeof data.gold?.usd === "number" && data.gold.usd > 200) xau = data.gold.usd;
      if (typeof data.silver?.usd === "number" && data.silver.usd > 10) xag = data.silver.usd;
      if (typeof data.palladium?.usd === "number" && data.palladium.usd > 100) xpd = data.palladium.usd;
    }
  } catch (e) { console.error("CoinGecko fetch failed:", e); }

  return { xauUsdPerOz: xau, xagUsdPerOz: xag, xpdUsdPerOz: xpd, usdIdrRate };
}

export function convertToIdrPerGram(usdPerOz: number, usdIdrRate: number): number {
  return (usdPerOz * usdIdrRate) / GOLD_OUNCE_TO_GRAM;
}

// ---------- Scrape Harga Antam (Logam Mulia) ----------
export type ScrapeAntamResult = {
  success: boolean;
  antamPrice?: number;
  previousPrice?: number;
  error?: string;
};

/** Scrape harga emas Antam dari logammulia.com via Firecrawl (force fresh). */
export async function scrapeAntamPrice(): Promise<ScrapeAntamResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return { success: false, error: "FIRECRAWL_API_KEY not configured" };
  }

  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://www.logammulia.com",
      formats: ["markdown"],
      onlyMainContent: true,
      maxAge: 0,
      storeInCache: false,
    }),
  });

  const data = await res.json();
  if (!data.success) {
    return { success: false, error: "Firecrawl scrape failed", detail: data } as any;
  }

  const markdown: string = data.data?.markdown ?? "";

  // Parse: "Emas\nHarga/gram Rp2.700.000,00..."
  const emasSection = markdown.match(/Emas\s*\n\s*Harga\/gram\s+Rp([\d.]+)/i);
  let price = 0;

  if (emasSection?.[1]) {
    price = parseInt(emasSection[1].replace(/\./g, ""), 10);
  } else {
    // Fallback: "Harga Terakhir: Rp2.680.000,00"
    const lastPrice = markdown.match(/Harga Terakhir:\s*Rp([\d.]+)/i);
    if (lastPrice?.[1]) {
      price = parseInt(lastPrice[1].replace(/\./g, ""), 10);
    }
  }

  if (price <= 0) {
    return { success: false, error: "Could not parse gold price", detail: markdown.substring(0, 500) } as any;
  }

  const prevRaw = await getSetting("antam_price");
  const prevPrice = prevRaw ? parseInt(prevRaw, 10) || 0 : 0;

  await setSetting("antam_price_prev", String(prevPrice));
  await setSetting("antam_price", String(price));

  return { success: true, antamPrice: price, previousPrice: prevPrice };
}

// ---------- Customers ----------
export function normalizePhone(phone: string): string {
  let d = (phone ?? "").replace(/\D/g, "");
  if (d.startsWith("62")) d = "0" + d.slice(2);
  return d;
}

export type CustomerInput = {
  name: string;
  phone: string;
  nik?: string | null;
  source?: string | null;
  address?: string | null;
  kelurahan?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  provinsi?: string | null;
  instagram?: string | null;
};

/** Upsert customer master by phone (normalized). Returns customer id. */
export async function upsertCustomerByPhone(input: CustomerInput): Promise<string | null> {
  const supabase = createAdminClient();
  const phone = normalizePhone(input.phone);
  if (!phone) return null;

  const fields = {
    name: input.name,
    phone,
    nik: input.nik ?? null,
    source: input.source ?? null,
    address: input.address ?? null,
    kelurahan: input.kelurahan ?? null,
    kecamatan: input.kecamatan ?? null,
    kabupaten: input.kabupaten ?? null,
    provinsi: input.provinsi ?? null,
    instagram: input.instagram ?? null,
  };

  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("customers")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    return existing.id;
  }

  const { data: created } = await supabase
    .from("customers")
    .insert(fields)
    .select("id")
    .single();
  return created?.id ?? null;
}

// ---------- Public Settings (Kontak, Jam, dll) ----------
export type PublicSettings = {
  phone: string;
  email: string;
  address: string;
  weekdayOpen: string;
  weekdayClose: string;
  saturdayOpen: string;
  saturdayClose: string;
};

export async function getPublicSettings(): Promise<PublicSettings> {
  const supabase = createAnonClient();
  const { data } = await supabase.from("app_settings").select("key, value");
  const map = new Map((data ?? []).map((r) => [r.key, r.value]));
  return {
    phone: map.get("phone") || "+62 812-3456-7890",
    email: map.get("email") || "info@safargold.com",
    address: map.get("address") || "Jl. Emas No. 1, Jakarta",
    weekdayOpen: map.get("weekday_open") || "09:00",
    weekdayClose: map.get("weekday_close") || "17:00",
    saturdayOpen: map.get("saturday_open") || "09:00",
    saturdayClose: map.get("saturday_close") || "14:00",
  };
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

  const todayMap = new Map(todayPrices.map((p) => [p.gold_type_id, p]));

  const lmRef = todayMap.get("antam-100");
  const bbRef = todayMap.get("bb-certi-1-2");
  const phRef = todayMap.get("ph-k24s");

  function getRef(category: string) {
    if (category === "lm") return lmRef;
    if (category === "bb-lm") return bbRef;
    if (category === "bb-perhiasan") return phRef;
    return null;
  }

  return todayPrices.map((p) => {
    const gt = goldTypes.find((g) => g.id === p.gold_type_id);
    const category = gt?.category ?? "";
    const ref = getRef(category);

    let spread = 0;
    if (ref && category === "lm") {
      spread = p.buy_price - ref.buy_price;
    } else if (ref && p.gold_type_id !== ref.gold_type_id) {
      spread = ref.sell_price - p.sell_price;
    }

    return {
      id: `p-${p.id}`,
      goldTypeId: p.gold_type_id,
      goldName: gt?.name ?? p.gold_type_id,
      karat: gt?.karat ?? null,
      weight: gt?.weight ?? null,
      category,
      buyPrice: p.buy_price,
      sellPrice: p.sell_price,
      basePrice: p.base_price,
      date: p.date,
      spread,
      spreadPercent: ref && category === "lm" && ref.buy_price > 0
        ? ((spread / ref.buy_price) * 100).toFixed(1)
        : "0.0",
      lastUpdated: p.created_at,
    };
  });
}

// ---------- Median Historis 30 Hari ----------
export async function getMedianFactors(): Promise<{
  faktorJual: number | null;
  faktorBuyback: number | null;
  suggestedJual: number | null;
  suggestedBuyback: number | null;
}> {
  const supabase = createAnonClient();
  const days = 30;

  const { data } = await supabase
    .from("price_history")
    .select("date, gold_type_id, base_price")
    .in("gold_type_id", ["antam-100", "bb-certi-1-2"])
    .order("date", { ascending: false })
    .limit(days * 2);

  if (!data || data.length === 0) {
    return { faktorJual: null, faktorBuyback: null, suggestedJual: null, suggestedBuyback: null };
  }

  const jualBases: number[] = [];
  const bbBases: number[] = [];
  const seenDatesJual = new Set<string>();
  const seenDatesBB = new Set<string>();

  for (const row of data) {
    if (row.gold_type_id === "antam-100" && row.base_price > 0 && !seenDatesJual.has(row.date)) {
      seenDatesJual.add(row.date);
      jualBases.push(row.base_price);
    }
    if (row.gold_type_id === "bb-certi-1-2" && row.base_price > 0 && !seenDatesBB.has(row.date)) {
      seenDatesBB.add(row.date);
      bbBases.push(row.base_price);
    }
    if (jualBases.length >= days && bbBases.length >= days) break;
  }

  const suggestedJual = jualBases.length > 0 ? median(jualBases) : null;
  const suggestedBuyback = bbBases.length > 0 ? median(bbBases) : null;

  return { faktorJual: null, faktorBuyback: null, suggestedJual, suggestedBuyback };
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
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
