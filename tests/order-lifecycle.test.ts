import { describe, expect, it } from "vitest";
import {
  canGenerateEod,
  canManageOrders,
  parseOrderId,
  parseOrderMutation,
} from "../src/lib/order-lifecycle";

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

  it("limits the number of items in one order", () => {
    expect(() => parseOrderMutation({
      ...validOrder,
      items: Array.from({ length: 101 }, () => validOrder.items[0]),
    })).toThrow("maksimal 100");
  });

  it.each([
    { field: "qty", value: 1_000_001 },
    { field: "weight", value: 1_000_001 },
    { field: "pricePerGram", value: 1_000_000_001 },
    { field: "pricePerGram", value: 1.5 },
    { field: "karat", value: 0 },
    { field: "karat", value: 25 },
    { field: "karat", value: 18.5 },
  ])("rejects an out-of-range item $field=$value", ({ field, value }) => {
    const input = structuredClone(validOrder);
    Object.assign(input.items[0], { [field]: value });
    expect(() => parseOrderMutation(input)).toThrow();
  });

  it.each([
    { field: "itemName", value: "A".repeat(201) },
    { field: "brand", value: "A".repeat(101) },
    { field: "goldTypeId", value: "invalid/id" },
  ])("rejects an invalid item identity field $field", ({ field, value }) => {
    const input = structuredClone(validOrder);
    Object.assign(input.items[0], { [field]: value });
    expect(() => parseOrderMutation(input)).toThrow();
  });

  it.each(["NaN", Number.POSITIVE_INFINITY, 1_000_000_000_001, 1.5])(
    "rejects invalid GP %s",
    (gp) => expect(() => parseOrderMutation({ ...validOrder, gp })).toThrow(),
  );

  it("rejects unsupported payment methods", () => {
    expect(() => parseOrderMutation({ ...validOrder, paymentMethod: "crypto" })).toThrow(
      "Metode pembayaran",
    );
  });

  it.each([
    { field: "customerName", value: "A".repeat(101) },
    { field: "customerPhone", value: "1234567" },
    { field: "customerPhone", value: "1".repeat(16) },
    { field: "customerPhone", value: "0812abc345678" },
    { field: "nik", value: "123456789012345" },
    { field: "nik", value: "123456789012345A" },
    { field: "address", value: "A".repeat(501) },
    { field: "notes", value: "A".repeat(1001) },
    { field: "instagram", value: "instagram user" },
  ])("rejects invalid customer field $field", ({ field, value }) => {
    expect(() => parseOrderMutation({ ...validOrder, [field]: value })).toThrow();
  });

  it("accepts optional customer identity fields in their supported format", () => {
    expect(parseOrderMutation({
      ...validOrder,
      nik: "3401010101010001",
      instagram: "@safargold.customer",
    })).toMatchObject({
      nik: "3401010101010001",
      instagram: "@safargold.customer",
    });
  });

  it("normalizes an international Indonesian customer phone", () => {
    expect(parseOrderMutation({
      ...validOrder,
      customerPhone: "+62 812-3456-7890",
    }).customerPhone).toBe("081234567890");
  });
});

describe("parseOrderId", () => {
  it("accepts UUID order IDs and rejects malformed IDs", () => {
    expect(parseOrderId("11111111-1111-4111-8111-111111111111"))
      .toBe("11111111-1111-4111-8111-111111111111");
    expect(() => parseOrderId("order-1")).toThrow("ID order");
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
