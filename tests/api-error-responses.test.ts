import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createAdminClientMock, requireCapabilityMock } = vi.hoisted(() => ({
  createAdminClientMock: vi.fn(),
  requireCapabilityMock: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: createAdminClientMock,
}));

vi.mock("@/lib/supabase/server-user", () => ({
  requireCapability: requireCapabilityMock,
}));

import { GET as getOrder } from "../src/app/api/admin/orders/[id]/route";
import { POST as createOrder } from "../src/app/api/admin/orders/route";
import { POST as adjustStock } from "../src/app/api/admin/stock/adjust/route";

const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "admin-test" },
};

function denied(status: 401 | 403) {
  return {
    ok: false as const,
    response: NextResponse.json(
      { error: status === 401 ? "Unauthorized" : "Forbidden" },
      { status },
    ),
  };
}

describe("admin API error responses", () => {
  beforeEach(() => {
    createAdminClientMock.mockReset();
    requireCapabilityMock.mockReset();
  });

  it("returns 401 when an order request has no authenticated session", async () => {
    requireCapabilityMock.mockResolvedValue(denied(401));

    const response = await createOrder(new Request("http://localhost/api/admin/orders", {
      method: "POST",
      body: JSON.stringify({}),
    }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(createAdminClientMock).not.toHaveBeenCalled();
  });

  it("returns 403 when the authenticated role lacks the required capability", async () => {
    requireCapabilityMock.mockResolvedValue(denied(403));

    const response = await adjustStock(new Request("http://localhost/api/admin/stock/adjust", {
      method: "POST",
      body: JSON.stringify({ goldTypeId: "antam-1", type: "in", qty: 1 }),
    }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
    expect(createAdminClientMock).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid order payload", async () => {
    requireCapabilityMock.mockResolvedValue(adminAuth);

    const response = await createOrder(new Request("http://localhost/api/admin/orders", {
      method: "POST",
      body: JSON.stringify({ type: "sell", customerName: "Ayu", items: [] }),
    }));

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe("Nama dan nomor HP wajib diisi");
    expect(createAdminClientMock).not.toHaveBeenCalled();
  });

  it("returns 404 when an order cannot be found", async () => {
    requireCapabilityMock.mockResolvedValue(adminAuth);
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "missing" } });
    const eq = vi.fn(() => ({ single }));
    const select = vi.fn(() => ({ eq }));
    createAdminClientMock.mockReturnValue({ from: vi.fn(() => ({ select })) });

    const response = await getOrder(
      new Request("http://localhost/api/admin/orders/missing"),
      { params: Promise.resolve({ id: "missing" }) },
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Order not found" });
  });

  it("returns 409 when a valid stock mutation conflicts with database state", async () => {
    requireCapabilityMock.mockResolvedValue(adminAuth);
    createAdminClientMock.mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Insufficient stock" },
      }),
    });

    const response = await adjustStock(new Request("http://localhost/api/admin/stock/adjust", {
      method: "POST",
      body: JSON.stringify({
        goldTypeId: "antam-1",
        brand: "Antam",
        type: "out",
        qty: 999,
        notes: "Konflik stok",
      }),
    }));

    expect(response.status).toBe(409);
    expect((await response.json()).error).toBe("Insufficient stock");
  });
});
