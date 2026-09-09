import { describe, expect, it } from "vitest";
import { aggregateCustomerSources, aggregateStockAnalytics } from "../src/lib/operational-analytics";

describe("aggregateStockAnalytics", () => {
  it("calculates stock health and uses item weight as total weight", () => {
    const result = aggregateStockAnalytics(
      [{ gold_type_id: "a1", brand: "Antam", qty: 3, min_qty: 5, gold_types: { name: "Antam 1g", category: "lm" } }],
      [{ type: "in", qty: 5, created_at: "2026-09-01T01:00:00Z" }, { type: "out", qty: 2, created_at: "2026-09-02T01:00:00Z" }],
      [{ created_at: "2026-09-02T01:00:00Z", order_items: [{ gold_type_id: "a1", brand: "Antam", qty: 2, weight: 2 }] }],
      "2026-09-01", "2026-09-07", "day",
    );
    expect(result.metrics).toMatchObject({ totalUnits: 3, lowStock: 1, stockIn: 5, stockOut: 2, netMovement: 3 });
    expect(result.velocity[0]).toMatchObject({ soldUnits: 2, soldWeight: 2 });
  });
});

describe("aggregateCustomerSources", () => {
  it("attributes acquisition to the first order and measures repeat customers", () => {
    const result = aggregateCustomerSources([
      { customer_id: "c1", type: "sell", total: 100, gp: 10, source: "Instagram", created_at: "2026-08-01T01:00:00Z" },
      { customer_id: "c1", type: "sell", total: 200, gp: 20, source: "Repeat Order", created_at: "2026-09-02T01:00:00Z" },
      { customer_id: "c2", type: "sell", total: 300, gp: null, source: "Google Maps", created_at: "2026-09-03T01:00:00Z" },
    ], "2026-09-01", "2026-09-30", "day");
    expect(result.metrics).toMatchObject({ activeCustomers: 2, newCustomers: 1, repeatCustomers: 1, repeatRate: 50 });
    expect(result.sources.find(source => source.name === "Instagram")).toMatchObject({ repeatCustomers: 1, orders: 1, omzet: 200 });
  });

  it("does not use future orders to classify an earlier period as repeat", () => {
    const result = aggregateCustomerSources([
      { customer_id: "c1", type: "sell", total: 100, gp: 10, source: "Instagram", created_at: "2026-09-02T01:00:00Z" },
      { customer_id: "c1", type: "sell", total: 200, gp: 20, source: "Repeat Order", created_at: "2026-10-02T01:00:00Z" },
    ], "2026-09-01", "2026-09-30", "day");
    expect(result.metrics).toMatchObject({ activeCustomers: 1, newCustomers: 1, repeatCustomers: 0, repeatRate: 0 });
  });
});
