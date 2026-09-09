import { describe, expect, it } from "vitest";
import { summarizeCustomerPurchases } from "../src/lib/customer-purchase-summary";

describe("summarizeCustomerPurchases", () => {
  it("finds the first and latest purchase regardless of input order", () => {
    const summary = summarizeCustomerPurchases([
      { created_at: "2026-08-20T08:00:00.000Z", total: 1_250_000 },
      { created_at: "2026-07-01T08:00:00.000Z", total: 750_000 },
      { created_at: "2026-09-03T08:00:00.000Z", total: 2_000_000 },
    ]);

    expect(summary).toEqual({
      firstPurchaseAt: "2026-07-01T08:00:00.000Z",
      latestPurchaseAt: "2026-09-03T08:00:00.000Z",
      orderCount: 3,
      totalSpent: 4_000_000,
    });
  });

  it("returns an empty summary when the customer has no orders", () => {
    expect(summarizeCustomerPurchases([])).toEqual({
      firstPurchaseAt: null,
      latestPurchaseAt: null,
      orderCount: 0,
      totalSpent: 0,
    });
  });
});
