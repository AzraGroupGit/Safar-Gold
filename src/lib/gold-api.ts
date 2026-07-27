import { getDb } from "./db";
export { getDb };
import type { GoldTypeRow, PriceHistoryRow, AppSettingRow } from "./db";
export type { GoldTypeRow, PriceHistoryRow, AppSettingRow };

const GOLD_OUNCE_TO_GRAM = 31.1034768;

function getSetting(key: string): string {
  const db = getDb();
  const row = db.prepare("SELECT value FROM app_settings WHERE key = ?").get(key) as
    | AppSettingRow
    | undefined;
  return row?.value ?? "0";
}

export function setSetting(key: string, value: string) {
  const db = getDb();
  db.prepare(
    "INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?"
  ).run(key, value, value);
}

export function getMarketInfo() {
  const usdIdrRate = parseFloat(getSetting("usd_idr_rate")) || 16300;
  const lastUpdate = getSetting("last_price_update");
  // Estimate international price from Antam base price if available
  const todayPrices = getTodayPrices();
  const antam = todayPrices.find((p) => p.gold_type_id === "antam-100");
  const xauUsdPerOz = antam
    ? Math.round((antam.base_price * GOLD_OUNCE_TO_GRAM) / usdIdrRate)
    : 0;
  return { usdIdrRate, xauUsdPerOz, lastUpdate };
}

export function getAllGoldTypes(): GoldTypeRow[] {
  const db = getDb();
  return db.prepare("SELECT * FROM gold_types ORDER BY category, karat DESC").all() as GoldTypeRow[];
}

export function getTodayPrices(): PriceHistoryRow[] {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  return db
    .prepare("SELECT * FROM price_history WHERE date = ?")
    .all(today) as PriceHistoryRow[];
}

export function getPriceHistory(goldTypeId: string, days = 30): PriceHistoryRow[] {
  const db = getDb();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];
  return db
    .prepare(
      "SELECT * FROM price_history WHERE gold_type_id = ? AND date >= ? ORDER BY date DESC"
    )
    .all(goldTypeId, sinceStr) as PriceHistoryRow[];
}

export function updateGoldType(id: string, data: Partial<GoldTypeRow>) {
  const db = getDb();
  const fields = Object.keys(data).filter((k) => k !== "id");
  if (fields.length === 0) return;
  const sets = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => (data as Record<string, unknown>)[f]);
  db.prepare(`UPDATE gold_types SET ${sets} WHERE id = ?`).run(...values, id);
}

export function insertPriceHistory(prices: Omit<PriceHistoryRow, "id" | "created_at">[]) {
  const db = getDb();
  const insert = db.prepare(
    "INSERT OR REPLACE INTO price_history (date, gold_type_id, base_price, buy_price, sell_price) VALUES (?, ?, ?, ?, ?)"
  );
  const tx = db.transaction(() => {
    for (const p of prices) {
      insert.run(p.date, p.gold_type_id, p.base_price, p.buy_price, p.sell_price);
    }
  });
  tx();
}

export function calculatePrices(basePricePerGramIdr: number) {
  const goldTypes = getAllGoldTypes(); // already fetches all

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
    } else {
      return {
        gold_type: gt,
        base_price: Math.round(basePricePerGramIdr),
        buy_price: gt.manual_buy ?? 0,
        sell_price: gt.manual_sell ?? 0,
      };
    }
  });
}

export async function fetchInternationalGoldPrice(): Promise<{
  xauUsdPerOz: number;
  usdIdrRate: number;
  error?: string;
}> {
  const apiKey = getSetting("api_key");

  if (!apiKey) {
    const fallback = await fetchFallbackPrice();
    return fallback;
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

    let usdIdrRate = parseFloat(getSetting("usd_idr_rate"));
    if (!usdIdrRate || isNaN(usdIdrRate)) usdIdrRate = 16300;

    try {
      const fxRes = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        const rate = fxData.rates?.IDR;
        if (rate) {
          usdIdrRate = rate;
          setSetting("usd_idr_rate", rate.toString());
        }
      }
    } catch {
      // fallback to stored rate
    }

    return { xauUsdPerOz, usdIdrRate };
  } catch {
    const fallback = await fetchFallbackPrice();
    return { ...fallback, error: "Network error, using fallback" };
  }
}

async function fetchFallbackPrice(): Promise<{ xauUsdPerOz: number; usdIdrRate: number }> {
  const usdIdrRate = parseFloat(getSetting("usd_idr_rate")) || 16300;

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
    // continue to static fallback
  }

  return { xauUsdPerOz: 2400, usdIdrRate };
}

export function convertToIdrPerGram(usdPerOz: number, usdIdrRate: number): number {
  return (usdPerOz * usdIdrRate) / GOLD_OUNCE_TO_GRAM;
}

export type FormattedPrice = {
  id: string;
  goldTypeId: string;
  goldName: string;
  karat: number;
  category: string;
  buyPrice: number;
  sellPrice: number;
  basePrice: number;
  date: string;
  spread: number;
  spreadPercent: string;
  lastUpdated: string;
};

export function getFormattedTodayPrices(): FormattedPrice[] {
  const todayPrices = getTodayPrices();

  if (todayPrices.length === 0) {
    return getAllGoldTypes().map((gt) => ({
      id: `empty-${gt.id}`,
      goldTypeId: gt.id,
      goldName: gt.name,
      karat: gt.karat,
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
    const gt = getAllGoldTypes().find((g) => g.id === p.gold_type_id);
    const spread = p.buy_price - p.sell_price;
    return {
      id: `p-${p.id}`,
      goldTypeId: p.gold_type_id,
      goldName: gt?.name ?? p.gold_type_id,
      karat: gt?.karat ?? 24,
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
