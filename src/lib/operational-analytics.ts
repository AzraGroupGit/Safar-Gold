import type { AnalyticsGrain } from "./analytics";

const dateFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" });
const dateKey = (value: string) => dateFormatter.format(new Date(value));
const bucket = (value: string, grain: AnalyticsGrain) => {
  const date = dateKey(value);
  if (grain === "month") return date.slice(0, 7);
  if (grain === "week") { const d = new Date(`${date}T00:00:00Z`); const day = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() - day + 1); return d.toISOString().slice(0, 10); }
  return date;
};
const inRange = (value: string, from: string, to: string) => { const date = dateKey(value); return date >= from && date <= to; };
const daysBetween = (from: string, to: string) => Math.max(1, Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000) + 1);

export type StockSnapshot = { gold_type_id: string; brand: string | null; qty: number; min_qty: number; gold_types: { name: string; category: string } | null };
export type StockMovementInput = { type: string; qty: number; created_at: string };
export type StockSale = { created_at: string; order_items: { gold_type_id: string | null; brand: string | null; qty: number; weight: number }[] | null };

export function aggregateStockAnalytics(stock: StockSnapshot[], movements: StockMovementInput[], sales: StockSale[], from: string, to: string, grain: AnalyticsGrain) {
  const periodDays = daysBetween(from, to);
  const stockIn = movements.filter(m => m.type === "in").reduce((sum, m) => sum + Math.abs(Number(m.qty) || 0), 0);
  const stockOut = movements.filter(m => m.type === "out").reduce((sum, m) => sum + Math.abs(Number(m.qty) || 0), 0);
  const movementTrend = new Map<string, { key: string; stockIn: number; stockOut: number }>();
  for (const movement of movements) { const key = bucket(movement.created_at, grain); const row = movementTrend.get(key) ?? { key, stockIn: 0, stockOut: 0 }; row[movement.type === "in" ? "stockIn" : "stockOut"] += Math.abs(Number(movement.qty) || 0); movementTrend.set(key, row); }
  const sold = new Map<string, { soldUnits: number; soldWeight: number }>();
  for (const order of sales) for (const item of order.order_items ?? []) { if (!item.gold_type_id) continue; const key = `${item.gold_type_id}|${item.brand ?? "Antam"}`; const row = sold.get(key) ?? { soldUnits: 0, soldWeight: 0 }; row.soldUnits += Number(item.qty) || 0; row.soldWeight += Number(item.weight) || 0; sold.set(key, row); }
  const velocity = stock.map(item => { const key = `${item.gold_type_id}|${item.brand ?? "Antam"}`; const movement = sold.get(key) ?? { soldUnits: 0, soldWeight: 0 }; const daily = movement.soldUnits / periodDays; return { name: item.gold_types?.name ?? item.gold_type_id, brand: item.brand ?? "Antam", qty: item.qty, minQty: item.min_qty, ...movement, dailySales: daily, daysCover: daily > 0 ? Math.round((item.qty / daily) * 10) / 10 : null }; }).sort((a, b) => b.soldUnits - a.soldUnits);
  const categories = new Map<string, number>(); const brands = new Map<string, number>();
  for (const item of stock) { categories.set(item.gold_types?.category ?? "lainnya", (categories.get(item.gold_types?.category ?? "lainnya") ?? 0) + item.qty); brands.set(item.brand ?? "Antam", (brands.get(item.brand ?? "Antam") ?? 0) + item.qty); }
  return { metrics: { totalUnits: stock.reduce((s, i) => s + i.qty, 0), activeSku: stock.filter(i => i.qty > 0).length, lowStock: stock.filter(i => i.qty > 0 && i.qty <= i.min_qty).length, outOfStock: stock.filter(i => i.qty <= 0).length, stockIn, stockOut, netMovement: stockIn - stockOut }, health: { safe: stock.filter(i => i.qty > i.min_qty).length, low: stock.filter(i => i.qty > 0 && i.qty <= i.min_qty).length, out: stock.filter(i => i.qty <= 0).length }, categories: [...categories].map(([name, value]) => ({ name, value })), brands: [...brands].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value), movementTrend: [...movementTrend.values()].sort((a, b) => a.key.localeCompare(b.key)), velocity };
}

export type StockAnalyticsResult = ReturnType<typeof aggregateStockAnalytics>;

export type CustomerSourceOrder = { customer_id: string | null; type: string; total: number; gp: number | null; source: string | null; created_at: string };
export function aggregateCustomerSources(allOrders: CustomerSourceOrder[], from: string, to: string, grain: AnalyticsGrain) {
  const byCustomer = new Map<string, CustomerSourceOrder[]>();
  for (const order of allOrders) if (order.customer_id && dateKey(order.created_at) <= to) { const rows = byCustomer.get(order.customer_id) ?? []; rows.push(order); byCustomer.set(order.customer_id, rows); }
  for (const rows of byCustomer.values()) rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
  const active = [...byCustomer.entries()].filter(([, rows]) => rows.some(o => inRange(o.created_at, from, to)));
  const sourceMap = new Map<string, { name: string; customers: number; newCustomers: number; repeatCustomers: number; orders: number; omzet: number; gp: number }>();
  const trendMap = new Map<string, { key: string; newCustomers: number; repeatOrders: number }>();
  let newCustomers = 0; let repeatCustomers = 0; let unknownCustomers = 0;
  for (const [, rows] of active) { const first = rows[0]; const periodOrders = rows.filter(o => inRange(o.created_at, from, to)); const name = first.source?.trim() || "Tidak diketahui"; const isNew = inRange(first.created_at, from, to); if (isNew) newCustomers++; if (rows.length > 1) repeatCustomers++; if (name === "Tidak diketahui") unknownCustomers++; const source = sourceMap.get(name) ?? { name, customers: 0, newCustomers: 0, repeatCustomers: 0, orders: 0, omzet: 0, gp: 0 }; source.customers++; if (isNew) source.newCustomers++; if (rows.length > 1) source.repeatCustomers++; source.orders += periodOrders.length; source.omzet += periodOrders.filter(o => o.type === "sell").reduce((s, o) => s + o.total, 0); source.gp += periodOrders.reduce((s, o) => s + (o.gp ?? 0), 0); sourceMap.set(name, source); for (const order of periodOrders) { const key = bucket(order.created_at, grain); const point = trendMap.get(key) ?? { key, newCustomers: 0, repeatOrders: 0 }; if (order === first) point.newCustomers++; else point.repeatOrders++; trendMap.set(key, point); } }
  const activeCustomers = active.length; const sources = [...sourceMap.values()].sort((a, b) => b.omzet - a.omzet);
  return { metrics: { activeCustomers, newCustomers, repeatCustomers, repeatRate: activeCustomers ? Math.round((repeatCustomers / activeCustomers) * 10000) / 100 : 0, unknownCustomers, topSource: sources[0]?.name ?? "-" }, sources, trend: [...trendMap.values()].sort((a, b) => a.key.localeCompare(b.key)) };
}

export type CustomerSourceAnalyticsResult = ReturnType<typeof aggregateCustomerSources>;
