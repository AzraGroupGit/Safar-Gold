import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  calculatePrices: vi.fn(),
  convertToIdrPerGram: vi.fn(),
  createAdminClient: vi.fn(),
  fetchInternationalGoldPrice: vi.fn(),
  insertPriceHistory: vi.fn(),
  normalizePhone: vi.fn((value: string) => value.replace(/\D/g, "")),
  requireCapability: vi.fn(),
  requireRole: vi.fn(),
  setSetting: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/server-user", () => ({
  requireCapability: mocks.requireCapability,
  requireRole: mocks.requireRole,
}));
vi.mock("@/lib/gold-api", () => ({
  calculatePrices: mocks.calculatePrices,
  convertToIdrPerGram: mocks.convertToIdrPerGram,
  fetchInternationalGoldPrice: mocks.fetchInternationalGoldPrice,
  insertPriceHistory: mocks.insertPriceHistory,
  normalizePhone: mocks.normalizePhone,
  setSetting: mocks.setSetting,
}));

import { GET as listCustomers } from "../src/app/api/admin/customers/route";
import { POST as generateEod } from "../src/app/api/admin/laporan/eod/route";
import { POST as createOrder } from "../src/app/api/admin/orders/route";
import { POST as publishPrices } from "../src/app/api/admin/publish-prices/route";
import { POST as adjustStock } from "../src/app/api/admin/stock/adjust/route";

const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "admin-integration" },
};

describe("admin lifecycle integration", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.normalizePhone.mockImplementation((value: string) => value.replace(/\D/g, ""));
    mocks.requireCapability.mockResolvedValue(adminAuth);
    mocks.requireRole.mockResolvedValue(adminAuth);
  });

  it("parses an order and sends the authenticated actor to the atomic RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: { id: "order-1", created_by: adminAuth.user.id, total: 3_000_000 },
      error: null,
    });
    mocks.createAdminClient.mockReturnValue({ rpc });

    const response = await createOrder(new Request("http://localhost/api/admin/orders", {
      method: "POST",
      body: JSON.stringify({
        type: "sell",
        customerName: " Siti ",
        customerPhone: "0812-3456-7890",
        items: [{
          goldTypeId: "antam-1",
          itemName: "Antam 1g",
          brand: " Antam ",
          weight: 2,
          karat: 24,
          qty: 2,
          pricePerGram: 1_500_000,
        }],
      }),
    }));

    expect(response.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("create_order_atomic", {
      p_actor: adminAuth.user.id,
      p_payload: expect.objectContaining({
        customerName: "Siti",
        customerPhone: "081234567890",
        total: 3_000_000,
      }),
    });
    await expect(response.json()).resolves.toMatchObject({ success: true, order: { id: "order-1" } });
  });

  it("validates a stock adjustment and sends a session-derived actor", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: { new_qty: 8, movement_id: "movement-1" },
      error: null,
    });
    mocks.createAdminClient.mockReturnValue({ rpc });

    const response = await adjustStock(new Request("http://localhost/api/admin/stock/adjust", {
      method: "POST",
      body: JSON.stringify({
        goldTypeId: " antam-1 ",
        brand: " UBS ",
        type: "in",
        qty: 3,
        notes: " Stok opname ",
        createdBy: "spoofed-client",
      }),
    }));

    expect(response.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("adjust_stock_atomic", {
      p_gold_type_id: "antam-1",
      p_brand: "UBS",
      p_type: "in",
      p_qty: 3,
      p_notes: "Stok opname",
      p_actor: adminAuth.user.id,
    });
    await expect(response.json()).resolves.toEqual({ success: true, newQty: 8, movementId: "movement-1" });
  });

  it("generates an EOD snapshot from orders, categories, and current stock", async () => {
    let insertedReport: Record<string, unknown> | null = null;
    const from = vi.fn((table: string) => {
      if (table === "eod_reports") {
        return {
          select: () => ({
            eq: () => ({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) }),
          }),
          insert: (report: Record<string, unknown>) => {
            insertedReport = report;
            return {
              select: () => ({ single: vi.fn().mockResolvedValue({ data: { id: 1, ...report }, error: null }) }),
            };
          },
        };
      }
      if (table === "orders") {
        return {
          select: () => ({
            eq: () => ({
              gte: () => ({
                lte: vi.fn().mockResolvedValue({
                  data: [
                    { type: "sell", total: 2_000_000, order_items: [{ gold_type_id: "lm-1", price_total: 2_000_000, qty: 2 }] },
                    { type: "buyback", total: 500_000, order_items: [{ gold_type_id: "bb-p", price_total: 500_000, qty: 1 }] },
                  ],
                  error: null,
                }),
              }),
            }),
          }),
        };
      }
      if (table === "gold_types") {
        return { select: vi.fn().mockResolvedValue({ data: [{ id: "bb-p", category: "bb-perhiasan" }], error: null }) };
      }
      if (table === "stock") {
        return {
          select: vi.fn().mockResolvedValue({
            data: [{ gold_type_id: "lm-1", qty: 7, min_qty: 2, gold_types: { name: "Antam 1g" } }],
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table ${table}`);
    });
    mocks.createAdminClient.mockReturnValue({ from });

    const response = await generateEod(new Request("http://localhost/api/admin/laporan/eod", {
      method: "POST",
      body: JSON.stringify({ date: "2026-09-08" }),
    }));

    expect(response.status).toBe(200);
    expect(insertedReport).toMatchObject({
      date: "2026-09-08",
      total_orders: 2,
      total_jual: 2_000_000,
      total_buyback: 500_000,
      net: 1_500_000,
      generated_by: adminAuth.user.id,
      is_stale: false,
      breakdown: { buybackPerhiasan: { total: 500_000, items: 1 } },
      stock_snapshot: [{ gold_type_id: "lm-1", name: "Antam 1g", qty: 7, min_qty: 2 }],
    });
  });

  it("joins customers with their transaction summary", async () => {
    const from = vi.fn((table: string) => {
      if (table === "orders") {
        return {
          select: () => ({
            not: vi.fn().mockResolvedValue({
              data: [
                { customer_id: "customer-1", total: 100_000, created_at: "2026-09-01T00:00:00Z" },
                { customer_id: "customer-1", total: 250_000, created_at: "2026-09-05T00:00:00Z" },
              ],
              error: null,
            }),
          }),
        };
      }
      if (table === "customers") {
        return {
          select: () => ({
            order: vi.fn().mockResolvedValue({
              data: [{ id: "customer-1", name: "Ayu", phone: "0812", created_at: "2026-08-01T00:00:00Z" }],
              error: null,
            }),
          }),
        };
      }
      throw new Error(`Unexpected table ${table}`);
    });
    mocks.createAdminClient.mockReturnValue({ from });

    const response = await listCustomers(new Request("http://localhost/api/admin/customers"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.scope).toBe("all");
    expect(body.customers).toEqual([
      expect.objectContaining({
        id: "customer-1",
        order_count: 2,
        total_spent: 350_000,
        last_order_at: "2026-09-05T00:00:00Z",
      }),
    ]);
  });

  it("publishes calculated prices and records the publication timestamp", async () => {
    mocks.fetchInternationalGoldPrice.mockResolvedValue({
      xauUsdPerOz: 2_500,
      xagUsdPerOz: 30,
      xpdUsdPerOz: 1_000,
      usdIdrRate: 16_000,
      error: null,
      warning: null,
    });
    mocks.convertToIdrPerGram.mockImplementation((metal: number) => metal * 100);
    mocks.calculatePrices.mockResolvedValue([{
      gold_type: { id: "lm-1", name: "Antam 1g", is_auto: true },
      base_price: 250_000,
      buy_price: 240_000,
      sell_price: 260_000,
    }]);
    mocks.insertPriceHistory.mockResolvedValue(undefined);
    mocks.setSetting.mockResolvedValue(undefined);

    const response = await publishPrices(new Request("http://localhost/api/admin/publish-prices", {
      method: "POST",
      body: JSON.stringify({ hargaDasarJual: 250_000, acuanBuybackLM: 240_000 }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.insertPriceHistory).toHaveBeenCalledWith([
      expect.objectContaining({
        gold_type_id: "lm-1",
        base_price: 250_000,
        buy_price: 240_000,
        sell_price: 260_000,
      }),
    ]);
    expect(mocks.setSetting).toHaveBeenCalledWith("last_price_update", expect.any(String));
    await expect(response.json()).resolves.toMatchObject({ success: true, count: 1 });
  });
});
