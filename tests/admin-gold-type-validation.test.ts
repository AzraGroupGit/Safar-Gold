import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  createGoldType: vi.fn(),
  deleteGoldType: vi.fn(),
  requireRole: vi.fn(),
  syncTodayPrices: vi.fn(),
  updateGoldType: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/server-user", () => ({ requireRole: mocks.requireRole }));
vi.mock("@/lib/gold-api", () => ({
  createGoldType: mocks.createGoldType,
  deleteGoldType: mocks.deleteGoldType,
  syncTodayPrices: mocks.syncTodayPrices,
  updateGoldType: mocks.updateGoldType,
}));

import { POST as createGoldType } from "../src/app/api/admin/create-gold-type/route";
import { DELETE as deleteGoldType } from "../src/app/api/admin/delete-gold-type/route";
import { PUT as updateGoldType } from "../src/app/api/admin/update-gold-type/route";
import { POST as updateGoldTypeModes } from "../src/app/api/admin/update-gold-types/route";

const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "admin-gold-type" },
};

describe("admin gold type validation", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.requireRole.mockResolvedValue(adminAuth);
  });

  it("rejects invalid numeric fields before creating a gold type", async () => {
    const response = await createGoldType(new Request("http://localhost/api/admin/create-gold-type", {
      method: "POST",
      body: JSON.stringify({
        id: "antam-invalid",
        name: "Antam Invalid",
        category: "lm",
        karat: 25,
        weight: "Infinity",
      }),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ code: "VALIDATION_ERROR" });
    expect(mocks.createGoldType).not.toHaveBeenCalled();
  });

  it("normalizes valid create data and applies the existing margin defaults", async () => {
    mocks.createGoldType.mockResolvedValue(undefined);

    const response = await createGoldType(new Request("http://localhost/api/admin/create-gold-type", {
      method: "POST",
      body: JSON.stringify({
        id: " antam-0.25 ",
        name: " Antam 0.25gr ",
        category: "lm",
        karat: 24,
        weight: 0.25,
      }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.createGoldType).toHaveBeenCalledWith({
      id: "antam-0.25",
      name: "Antam 0.25gr",
      category: "lm",
      karat: 24,
      weight: 0.25,
      margin_buy: 3,
      margin_sell: 2,
    });
  });

  it("rejects an invalid partial update before writing", async () => {
    const response = await updateGoldType(new Request("http://localhost/api/admin/update-gold-type", {
      method: "PUT",
      body: JSON.stringify({ id: "ph-k24", karat: -1 }),
    }));

    expect(response.status).toBe(400);
    expect(mocks.updateGoldType).not.toHaveBeenCalled();
  });

  it("returns a safe internal error when create storage fails", async () => {
    mocks.createGoldType.mockRejectedValue(new Error("private gold type detail"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await createGoldType(new Request("http://localhost/api/admin/create-gold-type", {
      method: "POST",
      body: JSON.stringify({ id: "antam-2.5", name: "Antam 2.5gr", category: "lm" }),
    }));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private gold type detail");
  });

  it("returns a stable conflict response when a used gold type is deleted", async () => {
    mocks.deleteGoldType.mockRejectedValue({ code: "23503", message: "private foreign key detail" });

    const response = await deleteGoldType(new Request("http://localhost/api/admin/delete-gold-type", {
      method: "DELETE",
      body: JSON.stringify({ id: "antam-1" }),
    }));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      success: false,
      code: "GOLD_TYPE_IN_USE",
      error: "Jenis emas tidak dapat dihapus karena masih digunakan",
    });
  });

  it("rejects invalid manual prices before a bulk update", async () => {
    const response = await updateGoldTypeModes(new Request("http://localhost/api/admin/update-gold-types", {
      method: "POST",
      body: JSON.stringify([{ id: "antam-1", isAuto: false, manualBuy: -1, manualSell: null }]),
    }));

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("stops bulk processing and hides database details when an update fails", async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: "private bulk update detail" } });
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => ({ update: vi.fn(() => ({ eq })) })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await updateGoldTypeModes(new Request("http://localhost/api/admin/update-gold-types", {
      method: "POST",
      body: JSON.stringify([{ id: "antam-1", isAuto: true, manualBuy: 0, manualSell: null }]),
    }));

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("private bulk update detail");
    expect(mocks.syncTodayPrices).not.toHaveBeenCalled();
  });
});
