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

function requiredText(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} wajib diisi`);
  return value.trim();
}

function positiveInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} harus berupa bilangan bulat lebih dari nol`);
  }
  return value;
}

export function canManageStock(role: unknown): boolean {
  return hasCapability(normalizeAppRole(role), "stock:manage");
}

export function parseStockAdjustment(input: unknown): StockAdjustmentInput {
  if (!input || typeof input !== "object") throw new Error("Data penyesuaian tidak valid");
  const body = input as Record<string, unknown>;
  if (body.type !== "in" && body.type !== "out") throw new Error("Tipe pergerakan stok tidak valid");
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  return {
    goldTypeId: requiredText(body.goldTypeId, "Produk"),
    brand: typeof body.brand === "string" && body.brand.trim() ? body.brand.trim() : "Antam",
    type: body.type,
    qty: positiveInteger(body.qty, "Jumlah"),
    notes: notes || null,
  };
}

export function parseStockCorrection(input: unknown): StockCorrectionInput {
  if (!input || typeof input !== "object") throw new Error("Data koreksi tidak valid");
  const body = input as Record<string, unknown>;
  return {
    movementId: requiredText(body.movementId, "Movement"),
    correctedQty: positiveInteger(body.correctedQty, "Jumlah yang benar"),
    reason: requiredText(body.reason, "Alasan koreksi"),
  };
}
import { hasCapability, normalizeAppRole } from "./permissions";
