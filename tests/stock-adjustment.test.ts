import { describe, expect, it } from "vitest";
import { canManageStock, parseStockAdjustment, parseStockCorrection } from "../src/lib/stock-adjustment";

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

  it("rejects an unsupported movement type", () => {
    expect(() => parseStockAdjustment({ goldTypeId: "antam-1", type: "edit", qty: 1 })).toThrow("Tipe");
  });
});

describe("parseStockCorrection", () => {
  it("requires a positive integer replacement quantity and a reason", () => {
    expect(parseStockCorrection({ movementId: "movement-1", correctedQty: 6, reason: " Salah hitung " }))
      .toEqual({ movementId: "movement-1", correctedQty: 6, reason: "Salah hitung" });
    expect(() => parseStockCorrection({ movementId: "movement-1", correctedQty: 6, reason: "" })).toThrow("Alasan");
    expect(() => parseStockCorrection({ movementId: "movement-1", correctedQty: 0, reason: "Salah" })).toThrow();
  });
});
