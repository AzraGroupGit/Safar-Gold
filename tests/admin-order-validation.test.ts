import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  requireCapability: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/server-user", () => ({ requireCapability: mocks.requireCapability }));

import { GET as listOrders, POST as createOrder } from "../src/app/api/admin/orders/route";
import {
  DELETE as cancelOrder,
  GET as getOrder,
  PUT as updateOrder,
} from "../src/app/api/admin/orders/[id]/route";

const orderId = "11111111-1111-4111-8111-111111111111";
const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "admin-order-validation" },
};
const validPayload = {
  type: "sell",
  customerName: "Siti",
  customerPhone: "081234567890",
  items: [{
    goldTypeId: "antam-1",
    itemName: "Antam 1g",
    brand: "Antam",
    weight: 1,
    karat: 24,
    qty: 1,
    pricePerGram: 1_500_000,
  }],
};

const context = { params: Promise.resolve({ id: orderId }) };

function orderLookup(result: { data: unknown; error: unknown }) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const single = vi.fn().mockResolvedValue(result);
  return { select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle, single })) })) };
}

describe("admin order API validation and safe errors", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.requireCapability.mockResolvedValue(adminAuth);
  });

  it("returns a structured validation error for malformed JSON", async () => {
    const response = await createOrder(new Request("http://localhost/api/admin/orders", {
      method: "POST",
      body: "{invalid",
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      code: "VALIDATION_ERROR",
      error: "Payload order tidak valid",
    });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("returns a stable stock conflict without exposing RPC details", async () => {
    mocks.createAdminClient.mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Insufficient stock for antam-1 / Antam" },
      }),
    });

    const response = await createOrder(new Request("http://localhost/api/admin/orders", {
      method: "POST",
      body: JSON.stringify(validPayload),
    }));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      success: false,
      code: "INSUFFICIENT_STOCK",
      error: "Stok tidak mencukupi",
    });
  });

  it("does not expose unexpected create-order errors", async () => {
    mocks.createAdminClient.mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "private create database detail" },
      }),
    });
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await createOrder(new Request("http://localhost/api/admin/orders", {
      method: "POST",
      body: JSON.stringify(validPayload),
    }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private create database detail");
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("private create database detail");
  });

  it("does not expose list-order query errors", async () => {
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "private list database detail" },
          }),
        })),
      })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await listOrders();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private list database detail");
  });

  it("distinguishes a detail query failure from an order that is not found", async () => {
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => orderLookup({
        data: null,
        error: { code: "XX001", message: "private detail database error" },
      })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getOrder(new Request(`http://localhost/api/admin/orders/${orderId}`), context);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private detail database error");
  });

  it("keeps order detail available when creator profile lookup fails", async () => {
    const from = vi.fn((table: string) => {
      if (table === "orders") {
        return orderLookup({ data: { id: orderId, created_by: adminAuth.user.id }, error: null });
      }
      return orderLookup({
        data: null,
        error: { message: "private creator profile error" },
      });
    });
    mocks.createAdminClient.mockReturnValue({ from });
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getOrder(new Request(`http://localhost/api/admin/orders/${orderId}`), context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.creator).toBeNull();
    expect(errorLog).toHaveBeenCalled();
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("private creator profile error");
  });

  it("rejects a malformed order ID before opening a database connection", async () => {
    const response = await getOrder(
      new Request("http://localhost/api/admin/orders/not-a-uuid"),
      { params: Promise.resolve({ id: "not-a-uuid" }) },
    );

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it.each([
    ["update", updateOrder],
    ["cancel", cancelOrder],
  ] as const)("does not report a %s lookup database failure as not found", async (_name, handler) => {
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => orderLookup({
        data: null,
        error: { message: "private lookup database detail" },
      })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const request = new Request(`http://localhost/api/admin/orders/${orderId}`, {
      method: handler === updateOrder ? "PUT" : "DELETE",
      ...(handler === updateOrder ? { body: JSON.stringify(validPayload) } : {}),
    });
    const response = await handler(request, context);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private lookup database detail");
  });

  it("does not expose an unexpected update-order RPC error", async () => {
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => orderLookup({
        data: { created_by: adminAuth.user.id, gp: 100_000 },
        error: null,
      })),
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "private update database detail" },
      }),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await updateOrder(new Request(`http://localhost/api/admin/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(validPayload),
    }), context);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private update database detail");
  });

  it("does not expose an unexpected cancel-order RPC error", async () => {
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => orderLookup({
        data: { created_by: adminAuth.user.id },
        error: null,
      })),
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "private cancel database detail" },
      }),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await cancelOrder(new Request(`http://localhost/api/admin/orders/${orderId}`, {
      method: "DELETE",
    }), context);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private cancel database detail");
  });
});
