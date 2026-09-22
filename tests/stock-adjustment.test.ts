import { describe, expect, it } from "vitest";
import {
  canManageStock,
  parseStockAdjustment,
  parseStockCorrection,
  parseStockMinimum,
} from "../src/lib/stock-adjustment";

const movementId = "11111111-1111-4111-8111-111111111111";

describe("stock adjustment authorization", () => {
  it("only permits normalized admin roles", () => {
    expect(canManageStock("admin")).toBe(true);
    expect(canManageStock(" Admin ")).toBe(true);
    expect(canManageStock("cs")).toBe(false);
    expect(canManageStock(undefined)).toBe(false);
  });
});

describe("parseStockAdjustment", () => {
  it("normalizes a valid adjustment and ignores a spoofed actor", () => {
    const parsed = parseStockAdjustment({
      goldTypeId: " antam-1 ", brand: " UBS ", type: "in", qty: 4,
      notes: " Stok opname ", createdBy: "spoofed",
    });
    expect(parsed).toEqual({ goldTypeId: "antam-1", brand: "UBS", type: "in", qty: 4, notes: "Stok opname" });
    expect(parsed).not.toHaveProperty("createdBy");
  });

  it.each([0, -1, 1.5, Number.NaN, "3"])("rejects invalid quantity %s", (qty) => {
    expect(() => parseStockAdjustment({ goldTypeId: "antam-1", type: "out", qty })).toThrow();
  });

  it("rejects quantities and text fields above their operational limits", () => {
    expect(() => parseStockAdjustment({ goldTypeId: "antam-1", type: "in", qty: 1_000_001 })).toThrow();
    expect(() => parseStockAdjustment({ goldTypeId: "antam-1", brand: "x".repeat(101), type: "in", qty: 1 })).toThrow();
    expect(() => parseStockAdjustment({ goldTypeId: "antam-1", type: "in", qty: 1, notes: "x".repeat(501) })).toThrow();
  });

  it("rejects an unsupported movement type", () => {
    expect(() => parseStockAdjustment({ goldTypeId: "antam-1", type: "edit", qty: 1 })).toThrow("Tipe");
  });
});

describe("parseStockCorrection", () => {
  it("requires a positive integer replacement quantity and a reason", () => {
    expect(parseStockCorrection({ movementId, correctedQty: 6, reason: " Salah hitung " }))
      .toEqual({ movementId, correctedQty: 6, reason: "Salah hitung" });
    expect(() => parseStockCorrection({ movementId, correctedQty: 6, reason: "" })).toThrow("Alasan");
    expect(() => parseStockCorrection({ movementId, correctedQty: 0, reason: "Salah" })).toThrow();
    expect(() => parseStockCorrection({ movementId: "movement-1", correctedQty: 1, reason: "Salah" })).toThrow();
    expect(() => parseStockCorrection({ movementId, correctedQty: 1_000_001, reason: "Salah" })).toThrow();
  });
});

describe("parseStockMinimum", () => {
  it("accepts zero and rejects values above the stock limit", () => {
    expect(parseStockMinimum({ goldTypeId: " antam-1 ", brand: " UBS ", minQty: 0 }))
      .toEqual({ goldTypeId: "antam-1", brand: "UBS", minQty: 0 });
    expect(() => parseStockMinimum({ goldTypeId: "antam-1", minQty: 1_000_001 })).toThrow();
  });
});
