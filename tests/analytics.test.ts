import { describe, expect, it } from "vitest";
import { aggregateAnalytics, calculateChangePercent, getPreviousRange } from "../src/lib/analytics";

describe("aggregateAnalytics", () => {
  it("separates omzet, buyback, transaction net, GP, and GP coverage", () => {
    const result = aggregateAnalytics([
      {
        id: "sell-1", type: "sell", total: 2_000_000, gp: 200_000, source: "Instagram",
        created_at: "2026-09-01T02:00:00.000Z",
        order_items: [{ item_name: "Antam 1g", brand: "Antam", qty: 1, weight: 1, price_total: 2_000_000 }],
      },
      {
        id: "sell-2", type: "sell", total: 1_000_000, gp: null, source: "Referral",
        created_at: "2026-09-01T10:00:00.000Z",
        order_items: [{ item_name: "UBS 1g", brand: "UBS", qty: 1, weight: 1, price_total: 1_000_000 }],
      },
      {
        id: "buyback-1", type: "buyback", total: 750_000, gp: 50_000, source: "Instagram",
        created_at: "2026-09-02T02:00:00.000Z", order_items: [],
      },
    ], "day");

    expect(result.metrics).toMatchObject({
      omzet: 3_000_000,
      buyback: 750_000,
      transactionNet: 2_250_000,
      grossProfit: 250_000,
      orderCount: 3,
      gpRecordedOrders: 2,
      gpCoveragePercent: 66.67,
      gpMarginPercent: 8.33,
    });
    expect(result.trend).toHaveLength(2);
    expect(result.products[0]).toMatchObject({ name: "Antam", omzet: 2_000_000 });
    expect(result.sources[0]).toMatchObject({ name: "Instagram", orders: 2 });
  });

  it("groups timestamps using Asia/Jakarta dates", () => {
    const result = aggregateAnalytics([
      { id: "1", type: "sell", total: 100, gp: 10, source: null, created_at: "2026-09-01T18:00:00.000Z", order_items: [] },
    ], "day");

    expect(result.trend[0].key).toBe("2026-09-02");
  });
});

describe("period comparison", () => {
  it("builds an equally-sized preceding date range", () => {
    expect(getPreviousRange("2026-09-01", "2026-09-07")).toEqual({ from: "2026-08-25", to: "2026-08-31" });
  });

  it("does not create a misleading percentage when the previous value is zero", () => {
    expect(calculateChangePercent(100, 0)).toBeNull();
    expect(calculateChangePercent(120, 100)).toBe(20);
  });
});
