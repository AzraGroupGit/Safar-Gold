export type AnalyticsGrain = "day" | "week" | "month";

export type AnalyticsOrder = {
  id: string;
  type: "sell" | "buyback";
  total: number;
  gp: number | null;
  source: string | null;
  created_at: string;
  order_items: {
    item_name: string;
    brand: string | null;
    qty: number;
    weight: number;
    price_total: number;
  }[] | null;
};

export type AnalyticsMetrics = {
  omzet: number;
  buyback: number;
  transactionNet: number;
  grossProfit: number;
  orderCount: number;
  sellOrderCount: number;
  buybackOrderCount: number;
  gpRecordedOrders: number;
  gpCoveragePercent: number;
  gpMarginPercent: number | null;
  averageOrderValue: number;
};

export type AnalyticsResult = {
  metrics: AnalyticsMetrics;
  trend: { key: string; omzet: number; buyback: number; grossProfit: number; orders: number }[];
  products: { name: string; omzet: number; items: number; weight: number }[];
  sources: { name: string; orders: number; omzet: number }[];
};

const wibDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function wibDate(timestamp: string) {
  return wibDateFormatter.format(new Date(timestamp));
}

function addDays(date: string, days: number) {
  const parsed = new Date(`${date}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function bucketKey(timestamp: string, grain: AnalyticsGrain) {
  const date = wibDate(timestamp);
  if (grain === "month") return date.slice(0, 7);
  if (grain === "week") {
    const parsed = new Date(`${date}T00:00:00Z`);
    const day = parsed.getUTCDay() || 7;
    parsed.setUTCDate(parsed.getUTCDate() - day + 1);
    return parsed.toISOString().slice(0, 10);
  }
  return date;
}

function roundPercent(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateChangePercent(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return roundPercent(((current - previous) / Math.abs(previous)) * 100);
}

export function getPreviousRange(from: string, to: string) {
  const durationDays = Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;
  return { from: addDays(from, -durationDays), to: addDays(from, -1) };
}

export function aggregateAnalytics(orders: AnalyticsOrder[], grain: AnalyticsGrain): AnalyticsResult {
  let omzet = 0;
  let buyback = 0;
  let grossProfit = 0;
  let sellOrderCount = 0;
  let buybackOrderCount = 0;
  let gpRecordedOrders = 0;
  const trend = new Map<string, AnalyticsResult["trend"][number]>();
  const products = new Map<string, AnalyticsResult["products"][number]>();
  const sources = new Map<string, AnalyticsResult["sources"][number]>();

  for (const order of orders) {
    const total = Number(order.total) || 0;
    const gp = order.gp === null ? 0 : Number(order.gp) || 0;
    if (order.type === "sell") { omzet += total; sellOrderCount += 1; }
    else { buyback += total; buybackOrderCount += 1; }
    if (order.gp !== null) { grossProfit += gp; gpRecordedOrders += 1; }

    const key = bucketKey(order.created_at, grain);
    const point = trend.get(key) ?? { key, omzet: 0, buyback: 0, grossProfit: 0, orders: 0 };
    if (order.type === "sell") point.omzet += total;
    else point.buyback += total;
    point.grossProfit += gp;
    point.orders += 1;
    trend.set(key, point);

    const sourceName = order.source?.trim() || "Tidak diketahui";
    const source = sources.get(sourceName) ?? { name: sourceName, orders: 0, omzet: 0 };
    source.orders += 1;
    if (order.type === "sell") source.omzet += total;
    sources.set(sourceName, source);

    if (order.type === "sell") {
      for (const item of order.order_items ?? []) {
        const name = item.brand?.trim() || item.item_name?.trim() || "Produk lainnya";
        const product = products.get(name) ?? { name, omzet: 0, items: 0, weight: 0 };
        product.omzet += Number(item.price_total) || 0;
        product.items += Number(item.qty) || 0;
        product.weight += Number(item.weight) || 0;
        products.set(name, product);
      }
    }
  }

  const orderCount = orders.length;
  return {
    metrics: {
      omzet,
      buyback,
      transactionNet: omzet - buyback,
      grossProfit,
      orderCount,
      sellOrderCount,
      buybackOrderCount,
      gpRecordedOrders,
      gpCoveragePercent: orderCount ? roundPercent((gpRecordedOrders / orderCount) * 100) : 0,
      gpMarginPercent: omzet ? roundPercent((grossProfit / omzet) * 100) : null,
      averageOrderValue: orderCount ? Math.round((omzet + buyback) / orderCount) : 0,
    },
    trend: [...trend.values()].sort((a, b) => a.key.localeCompare(b.key)),
    products: [...products.values()].sort((a, b) => b.omzet - a.omzet).slice(0, 8),
    sources: [...sources.values()].sort((a, b) => b.orders - a.orders).slice(0, 8),
  };
}
