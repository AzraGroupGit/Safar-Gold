import { hasCapability, normalizeAppRole } from "./permissions";

export type StockAdjustmentInput = {
  goldTypeId: string;
  brand: string;
  type: "in" | "out";
  qty: number;
  notes: string | null;
};

export type StockCorrectionInput = {
  movementId: string;
  correctedQty: number;
  reason: string;
};

export type StockMinimumInput = {
  goldTypeId: string;
  brand: string;
  minQty: number;
};

export type StockRange = "all" | "today" | "week" | "month";

const MAX_STOCK_QUANTITY = 1_000_000;

function requiredText(value: unknown, label: string, maximum: number): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} wajib diisi`);
  const text = value.trim();
  if (text.length > maximum) throw new Error(`${label} terlalu panjang`);
  return text;
}

function integerInRange(value: unknown, label: string, minimum: number): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < minimum ||
    value > MAX_STOCK_QUANTITY
  ) {
    throw new Error(`${label} harus berupa bilangan bulat antara ${minimum} dan ${MAX_STOCK_QUANTITY}`);
  }
  return value;
}

function goldTypeId(value: unknown): string {
  const id = requiredText(value, "Produk", 64);
  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(id)) throw new Error("Produk tidak valid");
  return id;
}

function brandName(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Antam";
  return requiredText(value, "Merek", 100);
}

export function canManageStock(role: unknown): boolean {
  return hasCapability(normalizeAppRole(role), "stock:manage");
}

export function parseStockRange(value: unknown): StockRange {
  if (value === "all" || value === "today" || value === "week" || value === "month") {
    return value;
  }
  throw new Error("Rentang stok tidak valid");
}

export function parseStockAdjustment(input: unknown): StockAdjustmentInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Data penyesuaian tidak valid");
  const body = input as Record<string, unknown>;
  if (body.type !== "in" && body.type !== "out") throw new Error("Tipe pergerakan stok tidak valid");
  const notes = body.notes === null || body.notes === undefined || body.notes === ""
    ? ""
    : requiredText(body.notes, "Catatan", 500);
  return {
    goldTypeId: goldTypeId(body.goldTypeId),
    brand: brandName(body.brand),
    type: body.type,
    qty: integerInRange(body.qty, "Jumlah", 1),
    notes: notes || null,
  };
}

export function parseStockCorrection(input: unknown): StockCorrectionInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Data koreksi tidak valid");
  const body = input as Record<string, unknown>;
  const movementId = requiredText(body.movementId, "Movement", 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movementId)) {
    throw new Error("Movement tidak valid");
  }
  return {
    movementId,
    correctedQty: integerInRange(body.correctedQty, "Jumlah yang benar", 1),
    reason: requiredText(body.reason, "Alasan koreksi", 500),
  };
}

export function parseStockMinimum(input: unknown): StockMinimumInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Data minimum stok tidak valid");
  const body = input as Record<string, unknown>;
  return {
    goldTypeId: goldTypeId(body.goldTypeId),
    brand: brandName(body.brand),
    minQty: integerInRange(body.minQty, "Minimum stok", 0),
  };
}
