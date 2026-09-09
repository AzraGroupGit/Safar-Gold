import { describe, expect, it } from "vitest";
import { aggregateCsActivity, aggregateCsPerformance, aggregateCsTeamPerformance, canViewOwnCsPerformance } from "../src/lib/cs-performance";

describe("canViewOwnCsPerformance", () => {
  it("allows only a normalized CS role", () => {
    expect(canViewOwnCsPerformance(" cs ")).toBe(true);
    expect(canViewOwnCsPerformance("admin")).toBe(false);
    expect(canViewOwnCsPerformance(undefined)).toBe(false);
  });
});

describe("aggregateCsPerformance", () => {
  it("summarizes completed and cancelled orders without multiplying total item weight", () => {
    const result = aggregateCsPerformance([
      { id: "1", order_number: "SG-1", type: "sell", status: "completed", customer_name: "A", total: 2_000_000, created_at: "2026-09-01T01:00:00Z", order_items: [{ qty: 2, weight: 2 }] },
      { id: "2", order_number: "SG-2", type: "buyback", status: "completed", customer_name: "B", total: 1_000_000, created_at: "2026-09-01T02:00:00Z", order_items: [{ qty: 1, weight: 3 }] },
      { id: "3", order_number: "SG-3", type: "sell", status: "cancelled", customer_name: "C", total: 500_000, created_at: "2026-09-02T01:00:00Z", order_items: [{ qty: 1, weight: 1 }] },
    ], "day");

    expect(result.metrics).toMatchObject({ totalOrders: 3, completedOrders: 2, cancelledOrders: 1, sellOrders: 1, buybackOrders: 1, completedValue: 3_000_000, itemCount: 3, totalWeight: 5, completionRate: 66.67 });
    expect(result.trend).toEqual([
      { key: "2026-09-01", completed: 2, cancelled: 0, value: 3_000_000 },
      { key: "2026-09-02", completed: 0, cancelled: 1, value: 0 },
    ]);
  });

  it("returns recent orders newest first", () => {
    const result = aggregateCsPerformance([
      { id: "old", order_number: "SG-1", type: "sell", status: "completed", customer_name: "A", total: 1, created_at: "2026-09-01T01:00:00Z", order_items: [] },
      { id: "new", order_number: "SG-2", type: "sell", status: "completed", customer_name: "B", total: 2, created_at: "2026-09-03T01:00:00Z", order_items: [] },
    ], "day");
    expect(result.recentOrders.map(order => order.id)).toEqual(["new", "old"]);
  });
});

describe("aggregateCsActivity", () => {
  it("returns operational CS metrics without financial values", () => {
    const orders = [
      { id: "1", order_number: "SG-1", type: "sell", status: "completed", customer_name: "A", created_at: "2026-09-01T01:00:00Z", order_items: [{ qty: 2, weight: 2 }] },
      { id: "2", order_number: "SG-2", type: "buyback", status: "cancelled", customer_name: "B", total: 9_000_000, created_at: "2026-09-02T01:00:00Z", order_items: [] },
    ] as const;
    const result = aggregateCsActivity(orders.map(order => ({ ...order, order_items: [...order.order_items] })), "day");

    expect(result.metrics).toEqual({
      totalOrders: 2,
      completedOrders: 1,
      cancelledOrders: 1,
      sellOrders: 1,
      buybackOrders: 0,
      itemCount: 2,
      totalWeight: 2,
      completionRate: 50,
    });
    expect(result.trend).toEqual([
      { key: "2026-09-01", completed: 1, cancelled: 0 },
      { key: "2026-09-02", completed: 0, cancelled: 1 },
    ]);
    expect(JSON.stringify(result)).not.toMatch(/completedValue|"value"|"total"/);
  });
});

describe("aggregateCsTeamPerformance", () => {
  it("includes inactive CS, excludes admin orders, and reports orders without attribution", () => {
    const result = aggregateCsTeamPerformance([
      { id: "cs-1", email: "one@example.com" },
      { id: "cs-2", email: "two@example.com" },
    ], [
      { id: "1", created_by: "cs-1", order_number: "SG-1", type: "sell", status: "completed", customer_name: "A", total: 100, created_at: "2026-09-01T01:00:00Z", order_items: [{ qty: 1, weight: 2 }] },
      { id: "2", created_by: "cs-1", order_number: "SG-2", type: "buyback", status: "cancelled", customer_name: "B", total: 50, created_at: "2026-09-02T01:00:00Z", order_items: [] },
      { id: "3", created_by: "admin-1", order_number: "SG-3", type: "sell", status: "completed", customer_name: "C", total: 200, created_at: "2026-09-02T01:00:00Z", order_items: [] },
      { id: "4", created_by: null, order_number: "SG-4", type: "sell", status: "completed", customer_name: "D", total: 300, created_at: "2026-09-03T01:00:00Z", order_items: [] },
    ], "day");

    expect(result.metrics).toMatchObject({ totalCs: 2, activeCs: 1, completedOrders: 1, cancelledOrders: 1, averageCompletedPerActiveCs: 1, unattributedOrders: 1 });
    expect(result.members.map(member => ({ id: member.id, completed: member.performance.metrics.completedOrders }))).toEqual([{ id: "cs-1", completed: 1 }, { id: "cs-2", completed: 0 }]);
    expect(result.trend).toEqual([{ key: "2026-09-01", completed: 1, cancelled: 0, value: 100 }, { key: "2026-09-02", completed: 0, cancelled: 1, value: 0 }]);
  });
});
