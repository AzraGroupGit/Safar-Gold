import { describe, expect, it } from "vitest";
import { formatOrderAddress, getOrderItemDetails } from "../src/lib/order-cart-presentation";

describe("getOrderItemDetails", () => {
  it("shows every relevant detail for a gold item", () => {
    expect(getOrderItemDetails({
      brand: "Antam",
      qty: 2,
      weight: 10,
      karat: 24,
      pricePerGram: 1_500_000,
    })).toEqual([
      "Merek: Antam",
      "Qty: 2",
      "Berat total: 10 g",
      "Karat: 24K",
      "Harga/g: Rp\u00a01.500.000",
    ]);
  });

  it("omits unavailable optional details without hiding core values", () => {
    expect(getOrderItemDetails({
      brand: null,
      qty: 1,
      weight: 3.25,
      karat: null,
      pricePerGram: 250_000,
    })).toEqual([
      "Qty: 1",
      "Berat total: 3,25 g",
      "Harga/g: Rp\u00a0250.000",
    ]);
  });
});

describe("formatOrderAddress", () => {
  it("joins every available address level", () => {
    expect(formatOrderAddress({
      address: "Jl. Emas No. 1",
      village: "Purbayan",
      district: "Kotagede",
      regency: "Yogyakarta",
      province: "DI Yogyakarta",
    })).toBe("Jl. Emas No. 1, Purbayan, Kotagede, Yogyakarta, DI Yogyakarta");
  });

  it("returns a placeholder when address data is empty", () => {
    expect(formatOrderAddress({})).toBe("-");
  });
});
