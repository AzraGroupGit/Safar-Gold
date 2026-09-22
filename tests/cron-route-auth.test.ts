import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAnonClient: vi.fn(),
  fetchInternationalGoldPrice: vi.fn(),
  getPrivateSetting: vi.fn(),
  getSetting: vi.fn(),
  requireRole: vi.fn(),
  scrapeAntamPrice: vi.fn(),
  setSetting: vi.fn(),
}));

vi.mock("@/lib/supabase/anon", () => ({ createAnonClient: mocks.createAnonClient }));
vi.mock("@/lib/supabase/server-user", () => ({ requireRole: mocks.requireRole }));
vi.mock("@/lib/gold-api", () => ({
  fetchInternationalGoldPrice: mocks.fetchInternationalGoldPrice,
  getPrivateSetting: mocks.getPrivateSetting,
  getSetting: mocks.getSetting,
  scrapeAntamPrice: mocks.scrapeAntamPrice,
  setSetting: mocks.setSetting,
}));

import { GET as scrapeAntamGet, POST as scrapeAntamPost } from "../src/app/api/cron/scrape-antam/route";
import { GET as updatePrices } from "../src/app/api/cron/update-prices/route";

const originalCronSecret = process.env.CRON_SECRET;
const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "f9319552-6581-494b-bddf-bfbd3d44200c" },
};

function unauthorized() {
  return {
    ok: false as const,
    response: Response.json({ error: "Unauthorized" }, { status: 401 }),
  };
}

describe("cron route authorization boundary", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    process.env.CRON_SECRET = "test-cron-secret";
    mocks.requireRole.mockResolvedValue(unauthorized());
    mocks.fetchInternationalGoldPrice.mockResolvedValue({
      xauUsdPerOz: 2500,
      xagUsdPerOz: 30,
      xpdUsdPerOz: 1000,
      usdIdrRate: 16300,
      xauSource: "metalprice",
      xagSource: "metalprice",
      xpdSource: "metalprice",
    });
    mocks.getSetting.mockResolvedValue("0");
    mocks.getPrivateSetting.mockResolvedValue("0");
    mocks.setSetting.mockResolvedValue(undefined);
    mocks.scrapeAntamPrice.mockResolvedValue({
      success: true,
      antamPrice: 2_700_000,
      previousPrice: 2_680_000,
    });
  });

  afterEach(() => {
    if (originalCronSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = originalCronSecret;
  });

  it.each([
    ["update prices", updatePrices, "GET", "http://localhost/api/cron/update-prices?force=true"],
    ["scrape Antam GET", scrapeAntamGet, "GET", "http://localhost/api/cron/scrape-antam"],
    ["scrape Antam POST", scrapeAntamPost, "POST", "http://localhost/api/cron/scrape-antam"],
  ])("rejects anonymous access to %s before calling a provider", async (_label, handler, method, url) => {
    const response = await handler(new Request(url, { method }));

    expect(response.status).toBe(401);
    expect(mocks.fetchInternationalGoldPrice).not.toHaveBeenCalled();
    expect(mocks.scrapeAntamPrice).not.toHaveBeenCalled();
  });

  it("rejects an invalid cron secret", async () => {
    const response = await updatePrices(new Request(
      "http://localhost/api/cron/update-prices?force=true",
      { headers: { Authorization: "Bearer wrong-secret" } },
    ));

    expect(response.status).toBe(401);
    expect(mocks.fetchInternationalGoldPrice).not.toHaveBeenCalled();
  });

  it("allows a valid cron secret without requiring an admin session", async () => {
    const response = await updatePrices(new Request(
      "http://localhost/api/cron/update-prices?force=true",
      { headers: { Authorization: "Bearer test-cron-secret" } },
    ));

    expect(response.status).toBe(200);
    expect(mocks.requireRole).not.toHaveBeenCalled();
    expect(mocks.fetchInternationalGoldPrice).toHaveBeenCalledOnce();
  });

  it("does not store a static fallback or mark the cron successful", async () => {
    mocks.fetchInternationalGoldPrice.mockResolvedValue({
      xauUsdPerOz: 2400,
      xagUsdPerOz: 30,
      xpdUsdPerOz: 1000,
      usdIdrRate: 17642,
      xauSource: "static",
      xagSource: "static",
      xpdSource: "static",
      error: "MetalpriceAPI unavailable",
    });

    const response = await updatePrices(new Request(
      "http://localhost/api/cron/update-prices?force=true",
      { headers: { Authorization: "Bearer test-cron-secret" } },
    ));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({ success: false });
    expect(mocks.setSetting).not.toHaveBeenCalled();
  });

  it("does not compare the first valid quote against the legacy placeholder", async () => {
    const previous: Record<string, string> = {
      global_gold_price: "0",
      last_cron_xau_usd: "2400",
      last_cron_xag_usd: "30",
      last_cron_xpd_usd: "1000",
      last_cron_usd_idr: "17642.0666666667",
    };
    mocks.getSetting.mockImplementation(async (key: string) => previous[key] ?? "0");

    const response = await updatePrices(new Request(
      "http://localhost/api/cron/update-prices?force=true",
      { headers: { Authorization: "Bearer test-cron-secret" } },
    ));

    expect(response.status).toBe(200);
    expect(mocks.setSetting).toHaveBeenCalledWith("global_gold_price_prev", "0");
    expect(mocks.setSetting).toHaveBeenCalledWith("last_cron_xau_usd", "2500");
  });

  it("reads the private cron timestamp when checking whether today was already fetched", async () => {
    const todayTime = new Date().toISOString();
    mocks.getPrivateSetting.mockResolvedValue(todayTime);

    const response = await updatePrices(new Request(
      "http://localhost/api/cron/update-prices",
      { headers: { Authorization: "Bearer test-cron-secret" } },
    ));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ skipped: true });
    expect(mocks.fetchInternationalGoldPrice).not.toHaveBeenCalled();
  });

  it("reads the private prior USD rate for a genuine previous quote", async () => {
    const previous: Record<string, string> = {
      global_gold_price: "0",
      last_cron_xau_usd: "2450",
      last_cron_xag_usd: "31",
      last_cron_xpd_usd: "1100",
    };
    mocks.getSetting.mockImplementation(async (key: string) => previous[key] ?? "0");
    mocks.getPrivateSetting.mockImplementation(async (key: string) =>
      key === "last_cron_usd_idr" ? "17642.0666666667" : "0"
    );

    const response = await updatePrices(new Request(
      "http://localhost/api/cron/update-prices?force=true",
      { headers: { Authorization: "Bearer test-cron-secret" } },
    ));

    expect(response.status).toBe(200);
    expect(mocks.setSetting).toHaveBeenCalledWith(
      "global_gold_price_prev",
      String(Math.round((2450 * 17642.0666666667) / 31.1034768)),
    );
  });

  it("keeps prior silver and palladium values when only static fallbacks are available", async () => {
    mocks.fetchInternationalGoldPrice.mockResolvedValue({
      xauUsdPerOz: 2500,
      xagUsdPerOz: 30,
      xpdUsdPerOz: 1000,
      usdIdrRate: 16300,
      xauSource: "metalprice",
      xagSource: "static",
      xpdSource: "static",
    });

    const response = await updatePrices(new Request(
      "http://localhost/api/cron/update-prices?force=true",
      { headers: { Authorization: "Bearer test-cron-secret" } },
    ));

    expect(response.status).toBe(200);
    expect(mocks.setSetting).toHaveBeenCalledWith("last_cron_xau_usd", "2500");
    expect(mocks.setSetting).not.toHaveBeenCalledWith("last_cron_xag_usd", "30");
    expect(mocks.setSetting).not.toHaveBeenCalledWith("last_cron_xpd_usd", "1000");
  });

  it("allows an authenticated admin to run both cron operations manually", async () => {
    mocks.requireRole.mockResolvedValue(adminAuth);

    const updateResponse = await updatePrices(
      new Request("http://localhost/api/cron/update-prices?force=true"),
    );
    const scrapeResponse = await scrapeAntamPost(
      new Request("http://localhost/api/cron/scrape-antam", { method: "POST" }),
    );

    expect(updateResponse.status).toBe(200);
    expect(scrapeResponse.status).toBe(200);
    expect(mocks.requireRole).toHaveBeenCalledWith("admin");
  });

  it("does not expose scrape provider errors or response details", async () => {
    const privateDetail = "private Firecrawl response body";
    mocks.requireRole.mockResolvedValue(adminAuth);
    mocks.scrapeAntamPrice.mockResolvedValue({
      success: false,
      error: "Firecrawl failed",
      detail: privateDetail,
    });
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await scrapeAntamPost(
      new Request("http://localhost/api/cron/scrape-antam", { method: "POST" }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      code: "INTERNAL_ERROR",
      error: "Terjadi kesalahan pada server",
    });
    expect(JSON.stringify(body)).not.toContain(privateDetail);
    expect(errorLog.mock.calls.flat().map(String).join(" ")).not.toContain(privateDetail);
  });
});
