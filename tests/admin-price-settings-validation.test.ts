import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  calculatePrices: vi.fn(),
  computePrices: vi.fn(),
  convertToIdrPerGram: vi.fn(),
  createAdminClient: vi.fn(),
  fetchInternationalGoldPrice: vi.fn(),
  getAllGoldTypes: vi.fn(),
  getSetting: vi.fn(),
  insertPriceHistory: vi.fn(),
  requireRole: vi.fn(),
  setSetting: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/server-user", () => ({ requireRole: mocks.requireRole }));
vi.mock("@/lib/gold-api", () => ({
  calculatePrices: mocks.calculatePrices,
  computePrices: mocks.computePrices,
  convertToIdrPerGram: mocks.convertToIdrPerGram,
  fetchInternationalGoldPrice: mocks.fetchInternationalGoldPrice,
  getAllGoldTypes: mocks.getAllGoldTypes,
  getSetting: mocks.getSetting,
  insertPriceHistory: mocks.insertPriceHistory,
  setSetting: mocks.setSetting,
}));

import { POST as previewPrices } from "../src/app/api/admin/preview-prices/route";
import { POST as publishPrices } from "../src/app/api/admin/publish-prices/route";
import { POST as triggerUpdate } from "../src/app/api/admin/trigger-update/route";
import { POST as updateSettings } from "../src/app/api/admin/update-settings/route";
import { parsePriceInput } from "../src/lib/admin-input";

const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "admin-validation" },
};

describe("admin price and settings API validation", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.requireRole.mockResolvedValue(adminAuth);
  });

  it("keeps signed adjustments valid within their permitted range", () => {
    expect(parsePriceInput({
      hargaDasarJual: 2_100_000,
      acuanBuybackLM: 2_000_000,
      adjJual: -25_000,
      adjBeli: 10_000,
    })).toMatchObject({
      ok: true,
      value: { adjJual: -25_000, adjBeli: 10_000 },
    });
  });

  it.each(["NaN", "Infinity", -1, 0, 1_000_000_001])(
    "rejects invalid base selling price %s before changing settings",
    async (hargaDasarJual) => {
      const response = await publishPrices(new Request("http://localhost/api/admin/publish-prices", {
        method: "POST",
        body: JSON.stringify({ hargaDasarJual, acuanBuybackLM: 2_000_000 }),
      }));

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        success: false,
        code: "VALIDATION_ERROR",
      });
      expect(mocks.setSetting).not.toHaveBeenCalled();
    },
  );

  it("rejects an out-of-range buyback percentage before loading price data", async () => {
    const response = await previewPrices(new Request("http://localhost/api/admin/preview-prices", {
      method: "POST",
      body: JSON.stringify({
        hargaDasarJual: 2_100_000,
        acuanBuybackLM: 2_000_000,
        persenBuybackPerhiasan: 101,
      }),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
    expect(mocks.getAllGoldTypes).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed price JSON", async () => {
    const response = await publishPrices(new Request("http://localhost/api/admin/publish-prices", {
      method: "POST",
      body: "{invalid",
    }));

    expect(response.status).toBe(400);
    expect(mocks.setSetting).not.toHaveBeenCalled();
  });

  it("rejects unknown setting keys", async () => {
    const response = await updateSettings(new Request("http://localhost/api/admin/update-settings", {
      method: "POST",
      body: JSON.stringify({ settings: { unexpected_setting: "value" } }),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("rejects invalid numeric settings instead of saving them as text", async () => {
    const response = await updateSettings(new Request("http://localhost/api/admin/update-settings", {
      method: "POST",
      body: JSON.stringify({ settings: { usd_idr_rate: "Infinity" } }),
    }));

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("accepts the settings currently sent by the admin dashboard", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    mocks.createAdminClient.mockReturnValue({ from: vi.fn(() => ({ upsert })) });

    const response = await updateSettings(new Request("http://localhost/api/admin/update-settings", {
      method: "POST",
      body: JSON.stringify({
        settings: {
          api_key: "",
          usd_idr_rate: "16300",
          phone: "+62 812-3456-7890",
          email: "admin@safargold.com",
          address: "Kotagede, Yogyakarta",
          weekday_open: "09:00",
          weekday_close: "17:00",
          saturday_open: "09:00",
          saturday_close: "14:00",
          google_reviews_widget_id: "",
        },
      }),
    }));

    expect(response.status).toBe(200);
    expect(upsert).toHaveBeenCalledWith(expect.arrayContaining([
      { key: "usd_idr_rate", value: "16300" },
      { key: "email", value: "admin@safargold.com" },
    ]));
  });

  it("returns a safe error when publishing prices fails internally", async () => {
    mocks.setSetting.mockRejectedValue(new Error("database password leaked"));
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await publishPrices(new Request("http://localhost/api/admin/publish-prices", {
      method: "POST",
      body: JSON.stringify({ hargaDasarJual: 2_100_000, acuanBuybackLM: 2_000_000 }),
    }));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      code: "INTERNAL_ERROR",
      error: "Terjadi kesalahan pada server",
    });
    expect(JSON.stringify(body)).not.toContain("database password leaked");
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("database password leaked");
  });

  it("returns a safe error when saving settings fails internally", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: { message: "private database detail" } });
    mocks.createAdminClient.mockReturnValue({ from: vi.fn(() => ({ upsert })) });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await updateSettings(new Request("http://localhost/api/admin/update-settings", {
      method: "POST",
      body: JSON.stringify({ settings: { phone: "08123456789" } }),
    }));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private database detail");
  });

  it("returns a safe error when automatic price refresh fails internally", async () => {
    mocks.fetchInternationalGoldPrice.mockRejectedValue(new Error("provider secret"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await triggerUpdate();

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("provider secret");
  });
});
