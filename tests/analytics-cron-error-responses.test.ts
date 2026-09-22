import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  createAnonClient: vi.fn(),
  fetchInternationalGoldPrice: vi.fn(),
  getServerUser: vi.fn(),
  getSetting: vi.fn(),
  getUserRole: vi.fn(),
  requireCapability: vi.fn(),
  requireRole: vi.fn(),
  setSetting: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/anon", () => ({ createAnonClient: mocks.createAnonClient }));
vi.mock("@/lib/supabase/server-user", () => ({
  getServerUser: mocks.getServerUser,
  getUserRole: mocks.getUserRole,
  requireCapability: mocks.requireCapability,
  requireRole: mocks.requireRole,
}));
vi.mock("@/lib/gold-api", () => ({
  fetchInternationalGoldPrice: mocks.fetchInternationalGoldPrice,
  getSetting: mocks.getSetting,
  setSetting: mocks.setSetting,
}));

import { GET as getFinancialAnalytics } from "../src/app/api/admin/analytics/route";
import { GET as getCustomerAnalytics } from "../src/app/api/admin/analytics/customers/route";
import { GET as getTeamPerformance } from "../src/app/api/admin/analytics/cs-performance/route";
import { GET as getStockAnalytics } from "../src/app/api/admin/analytics/stock/route";
import { GET as getOwnCsPerformance } from "../src/app/api/admin/cs-performance/route";
import { GET as updatePrices } from "../src/app/api/cron/update-prices/route";

const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "f9319552-6581-494b-bddf-bfbd3d44200c" },
};
const validAnalyticsUrl = "http://localhost/api/admin/analytics?from=2026-09-01&to=2026-09-15&grain=day";
const scopedAnalyticsUrl = (scope: string) =>
  `http://localhost/api/admin/analytics/${scope}?from=2026-09-01&to=2026-09-15&grain=day`;

async function expectSafeInternalError(responsePromise: Promise<Response>, secret: string) {
  const response = await responsePromise;
  const body = await response.json();

  expect(response.status).toBe(500);
  expect(body).toEqual({
    success: false,
    code: "INTERNAL_ERROR",
    error: "Terjadi kesalahan pada server",
  });
  expect(JSON.stringify(body)).not.toContain(secret);
}

function loggedText(errorLog: { mock: { calls: unknown[][] } }) {
  return errorLog.mock.calls.flat().map(String).join(" ");
}

describe("analytics and cron safe error responses", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.requireCapability.mockResolvedValue(adminAuth);
    mocks.requireRole.mockResolvedValue(adminAuth);
    mocks.getServerUser.mockResolvedValue(adminAuth.user);
    mocks.getUserRole.mockReturnValue("cs");
  });

  it.each([
    ["financial analytics", getFinancialAnalytics, validAnalyticsUrl],
    ["stock analytics", getStockAnalytics, scopedAnalyticsUrl("stock")],
    ["customer analytics", getCustomerAnalytics, scopedAnalyticsUrl("customers")],
    ["team performance", getTeamPerformance, scopedAnalyticsUrl("cs-performance")],
  ])("does not expose database details from %s", async (_label, handler, url) => {
    const secret = "private analytics database detail";
    mocks.createAdminClient.mockImplementation(() => {
      throw new Error(secret);
    });
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expectSafeInternalError(handler(new Request(url)), secret);
    expect(loggedText(errorLog)).not.toContain(secret);
  });

  it("does not expose database details from the CS personal dashboard", async () => {
    const secret = "private CS order database detail";
    mocks.createAdminClient.mockImplementation(() => {
      throw new Error(secret);
    });
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expectSafeInternalError(
      getOwnCsPerformance(new Request(validAnalyticsUrl.replace("analytics", "cs-performance"))),
      secret,
    );
    expect(loggedText(errorLog)).not.toContain(secret);
  });

  it("does not expose provider details when the price cron fails", async () => {
    const secret = "private market provider detail";
    mocks.fetchInternationalGoldPrice.mockRejectedValue(new Error(secret));
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expectSafeInternalError(
      updatePrices(new Request("http://localhost/api/cron/update-prices?force=true")),
      secret,
    );
    expect(loggedText(errorLog)).not.toContain(secret);
  });

  it("keeps existing analytics validation messages", async () => {
    const response = await getFinancialAnalytics(
      new Request("http://localhost/api/admin/analytics?from=invalid&to=2026-09-15&grain=day"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Rentang tanggal tidak valid" });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });
});
