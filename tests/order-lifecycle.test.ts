import { describe, expect, it } from "vitest";
import { canGenerateEod, canManageOrders, parseOrderMutation } from "../src/lib/order-lifecycle";

const validOrder = {
  type: "sell",
  customerName: "Siti",
  customerPhone: "0812-3456-7890",
  createdBy: "spoofed-client-user",
  items: [{
    goldTypeId: "antam-1",
    itemName: "Antam 1g",
    brand: " Antam ",
    weight: 2,
    karat: 24,
    qty: 2,
    pricePerGram: 1_500_000,
    priceTotal: 1,
  }],
};

describe("parseOrderMutation", () => {
  it("derives totals, normalizes stock identity, and ignores client actor", () => {
    expect(parseOrderMutation(validOrder)).toMatchObject({
      type: "sell",
      customerName: "Siti",
      customerPhone: "081234567890",
      total: 3_000_000,
      items: [{ brand: "Antam", priceTotal: 3_000_000 }],
    });
    expect(parseOrderMutation(validOrder)).not.toHaveProperty("createdBy");
  });

  it.each([
    { field: "qty", value: 0 },
    { field: "qty", value: -1 },
    { field: "weight", value: Number.NaN },
    { field: "pricePerGram", value: Number.POSITIVE_INFINITY },
    { field: "pricePerGram", value: -1 },
  ])("rejects invalid item $field=$value", ({ field, value }) => {
    const input = structuredClone(validOrder);
    Object.assign(input.items[0], { [field]: value });
    expect(() => parseOrderMutation(input)).toThrow();
  });

  it("rejects unsupported order types", () => {
    expect(() => parseOrderMutation({ ...validOrder, type: "refund" })).toThrow(
      "Tipe order tidak valid",
    );
  });

  it("uses Antam as the stock brand when a catalog item has no brand", () => {
    const input = structuredClone(validOrder);
    input.items[0].brand = "";
    expect(parseOrderMutation(input).items[0].brand).toBe("Antam");
  });

  it("rejects fractional quantities", () => {
    const input = structuredClone(validOrder);
    input.items[0].qty = 1.5;
    expect(() => parseOrderMutation(input)).toThrow("bilangan bulat");
  });

  it("accepts the numeric GP string sent by the order form", () => {
    expect(parseOrderMutation({ ...validOrder, gp: "125000" }).gp).toBe(125_000);
  });
});

describe("canManageOrders", () => {
  it.each(["admin", "cs"])("allows %s", (role) => expect(canManageOrders(role)).toBe(true));
  it.each(["Admin", "CS", " admin "])("normalizes legacy role %s", (role) => expect(canManageOrders(role)).toBe(true));
  it.each([undefined, null, "", "viewer", "owner"])("rejects %s", (role) => {
    expect(canManageOrders(role)).toBe(false);
  });
});

describe("canGenerateEod", () => {
  it("only allows admins", () => {
    expect(canGenerateEod("admin")).toBe(true);
    expect(canGenerateEod("cs")).toBe(false);
    expect(canGenerateEod(undefined)).toBe(false);
  });
});
