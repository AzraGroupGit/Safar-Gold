import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  normalizePhone: vi.fn((value: string) => value.replace(/\D/g, "")),
  requireCapability: vi.fn(),
  requireRole: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/server-user", () => ({
  requireCapability: mocks.requireCapability,
  requireRole: mocks.requireRole,
}));
vi.mock("@/lib/gold-api", () => ({ normalizePhone: mocks.normalizePhone }));

import { GET as getCustomer } from "../src/app/api/admin/customers/[id]/route";
import { GET as lookupCustomer } from "../src/app/api/admin/customers/lookup/route";
import { GET as listCustomers, POST as saveCustomer } from "../src/app/api/admin/customers/route";
import { GET as getProfile, PUT as saveProfile } from "../src/app/api/admin/user-profile/route";

const userId = "f9319552-6581-494b-bddf-bfbd3d44200c";
const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: userId },
};

describe("customer and user profile API validation", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.normalizePhone.mockImplementation((value: string) => value.replace(/\D/g, ""));
    mocks.requireCapability.mockResolvedValue(adminAuth);
    mocks.requireRole.mockResolvedValue(adminAuth);
  });

  it.each([
    { name: "A".repeat(101), phone: "081234567890" },
    { name: "Ayu", phone: "1234567" },
    { name: "Ayu", phone: "081234567890", nik: "123456789012345A" },
    { name: "Ayu", phone: "081234567890", instagram: "instagram user" },
  ])("rejects invalid customer data before opening a database connection", async (body) => {
    const response = await saveCustomer(new Request("http://localhost/api/admin/customers", {
      method: "POST",
      body: JSON.stringify(body),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("does not expose database details when creating a customer fails", async () => {
    const customerTable = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "private customer database detail" },
          }),
        })),
      })),
    };
    mocks.createAdminClient.mockReturnValue({ from: vi.fn(() => customerTable) });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await saveCustomer(new Request("http://localhost/api/admin/customers", {
      method: "POST",
      body: JSON.stringify({ name: "Ayu", phone: "081234567890" }),
    }));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private customer database detail");
  });

  it("normalizes an international Indonesian phone before saving a customer", async () => {
    const insert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data: { id: "customer-1" }, error: null }),
      })),
    }));
    const customerTable = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
      insert,
    };
    mocks.createAdminClient.mockReturnValue({ from: vi.fn(() => customerTable) });

    const response = await saveCustomer(new Request("http://localhost/api/admin/customers", {
      method: "POST",
      body: JSON.stringify({ name: "Ayu", phone: "+62 812-3456-7890" }),
    }));

    expect(response.status).toBe(200);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ phone: "081234567890" }));
  });

  it("returns a safe error when listing customers fails", async () => {
    const not = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "private order summary detail" },
    });
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => ({ select: vi.fn(() => ({ not })) })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await listCustomers(new Request("http://localhost/api/admin/customers"));

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("private order summary detail");
  });

  it("rejects an invalid lookup phone before opening a database connection", async () => {
    const response = await lookupCustomer(
      new Request("http://localhost/api/admin/customers/lookup?phone=1234567"),
    );

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("returns a safe error when customer detail lookup fails", async () => {
    const order = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "private customer orders detail" },
    });
    const eq = vi.fn(() => ({ order }));
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => ({ select: vi.fn(() => ({ eq })) })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getCustomer(
      new Request("http://localhost/api/admin/customers/customer-1"),
      { params: Promise.resolve({ id: "customer-1" }) },
    );

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("private customer orders detail");
  });

  it("rejects an invalid signature payload before opening a database connection", async () => {
    const response = await saveProfile(new Request("http://localhost/api/admin/user-profile", {
      method: "PUT",
      body: JSON.stringify({ userId, name: "Admin", signature: "https://example.com/signature.png" }),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("does not expose database details when saving a profile fails", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: { message: "private profile detail" } });
    mocks.createAdminClient.mockReturnValue({ from: vi.fn(() => ({ upsert })) });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await saveProfile(new Request("http://localhost/api/admin/user-profile", {
      method: "PUT",
      body: JSON.stringify({
        userId,
        name: "Admin Safar Gold",
        signature: "data:image/png;base64,aGVsbG8=",
      }),
    }));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private profile detail");
  });

  it("does not expose database details when loading a profile fails", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "private profile load detail" },
    });
    const eq = vi.fn(() => ({ maybeSingle }));
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => ({ select: vi.fn(() => ({ eq })) })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getProfile(
      new Request(`http://localhost/api/admin/user-profile?userId=${userId}`),
    );

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("private profile load detail");
  });
});
