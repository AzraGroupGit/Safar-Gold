import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  requireCapability: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/server-user", () => ({ requireCapability: mocks.requireCapability }));

import { GET as getStock } from "../src/app/api/admin/stock/route";
import { GET as getStockMovements } from "../src/app/api/admin/stock/movements/route";
import { GET as getStockSalesSummary } from "../src/app/api/admin/stock/sales-summary/route";

const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "admin-stock-read" },
};

function stockQuery(result: { data: unknown[] | null; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result);
  return { from: vi.fn(() => ({ select: vi.fn(() => ({ order })) })) };
}

function salesSummaryQuery(result: { data: unknown[] | null; error: unknown }) {
  const secondEq = vi.fn().mockReturnValue(Promise.resolve(result));
  const firstEq = vi.fn(() => ({ eq: secondEq }));
  return { from: vi.fn(() => ({ select: vi.fn(() => ({ eq: firstEq })) })) };
}

function movementQuery(result: { data: unknown[] | null; error: unknown }, getUserById = vi.fn()) {
  const limit = vi.fn().mockResolvedValue(result);
  const order = vi.fn(() => ({ limit }));
  return {
    from: vi.fn(() => ({ select: vi.fn(() => ({ order })) })),
    auth: { admin: { getUserById } },
  };
}

describe("admin stock read endpoints", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.requireCapability.mockResolvedValue(adminAuth);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([
    ["stock", getStock],
    ["sales summary", getStockSalesSummary],
  ])("rejects an invalid range before querying %s data", async (_name, handler) => {
    const response = await handler(new Request("http://localhost/api/admin/stock?range=quarter"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Rentang stok tidak valid",
    });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("does not expose stock query details", async () => {
    mocks.createAdminClient.mockReturnValue(stockQuery({
      data: null,
      error: { message: "private stock query detail" },
    }));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ summary: {} }),
    }));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getStock(new Request("http://localhost/api/admin/stock"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private stock query detail");
  });

  it("keeps stock data available and records a failed sales enrichment", async () => {
    mocks.createAdminClient.mockReturnValue(stockQuery({
      data: [{ gold_type_id: "antam-1", brand: "Antam", qty: 3 }],
      error: null,
    }));
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("private fetch detail")));
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getStock(new Request("http://localhost/api/admin/stock"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.stock[0]).toMatchObject({ total_weight_sold: 0, total_revenue: 0 });
    expect(errorLog).toHaveBeenCalled();
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("private fetch detail");
  });

  it("does not expose sales-summary query details", async () => {
    mocks.createAdminClient.mockReturnValue(salesSummaryQuery({
      data: null,
      error: { message: "private sales query detail" },
    }));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getStockSalesSummary(
      new Request("http://localhost/api/admin/stock/sales-summary"),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private sales query detail");
  });

  it("does not expose movement query details", async () => {
    mocks.createAdminClient.mockReturnValue(movementQuery({
      data: null,
      error: { message: "private movement query detail" },
    }));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getStockMovements();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private movement query detail");
  });

  it("keeps movement data available when an actor lookup fails", async () => {
    const getUserById = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: "private actor lookup detail" },
    });
    mocks.createAdminClient.mockReturnValue(movementQuery({
      data: [{ id: "movement-1", created_by: "user-1" }],
      error: null,
    }, getUserById));
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getStockMovements();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.movements[0].actor_email).toBe("Pengguna tidak aktif");
    expect(errorLog).toHaveBeenCalled();
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("private actor lookup detail");
  });
});
