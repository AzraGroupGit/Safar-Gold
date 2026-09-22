import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMocks = vi.hoisted(() => ({
  settings: {} as Record<string, string>,
  adminSettings: {} as Record<string, string>,
  upsert: vi.fn(),
}));

vi.mock("../src/lib/supabase/anon", () => ({
  createAnonClient: () => ({
    from: () => ({
      select: () => ({
        eq: (_column: string, key: string) => ({
          maybeSingle: async () => ({
            data: { value: supabaseMocks.settings[key] ?? "0" },
          }),
        }),
      }),
    }),
  }),
}));

vi.mock("../src/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      upsert: supabaseMocks.upsert,
      select: () => ({
        eq: (_column: string, key: string) => ({
          maybeSingle: async () => ({
            data: { value: supabaseMocks.adminSettings[key] ?? null },
            error: null,
          }),
        }),
      }),
    }),
  }),
}));

import {
  fetchBiJisdorRate,
  fetchInternationalGoldPrice,
  parseBiJisdorRate,
} from "../src/lib/gold-api";

const JISDOR_XML = `<?xml version="1.0" encoding="utf-8"?>
<DataSet xmlns="http://tempuri.org/">
  <NewDataSet>
    <Table>
      <tgl_subkursasing>2026-09-11T00:00:00+07:00</tgl_subkursasing>
      <mts_subkursasing>USD</mts_subkursasing>
      <jual_subkursasing>17,611.00</jual_subkursasing>
    </Table>
  </NewDataSet>
</DataSet>`;

describe("Bank Indonesia JISDOR fallback", () => {
  beforeEach(() => {
    supabaseMocks.settings.api_key = "metalprice-key";
    supabaseMocks.adminSettings.api_key = "metalprice-key";
    supabaseMocks.settings.usd_idr_rate = "16300";
    supabaseMocks.upsert.mockReset().mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("parses the latest USD/IDR rate from the BI XML response", () => {
    expect(parseBiJisdorRate(JISDOR_XML)).toBe(17_611);
  });

  it("returns null when the BI XML has no valid JISDOR rate", () => {
    expect(parseBiJisdorRate("<DataSet><NewDataSet /></DataSet>")).toBeNull();
  });

  it("returns the parsed JISDOR rate from the BI web service", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JISDOR_XML, { status: 200 })),
    );

    await expect(fetchBiJisdorRate()).resolves.toBe(17_611);
  });

  it("returns null when the BI web service is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("unavailable", { status: 503 })),
    );

    await expect(fetchBiJisdorRate()).resolves.toBeNull();
  });

  it("uses and stores JISDOR when MetalpriceAPI omits USD/IDR", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (input: string | URL | Request) => {
        const url = input.toString();
        if (url.includes("coingecko.com")) {
          return new Response(JSON.stringify({
            gold: { usd: 2_400 },
            silver: { usd: 30 },
            palladium: { usd: 1_000 },
          }), { status: 200 });
        }
        if (url.includes("metalpriceapi.com")) {
          return new Response(JSON.stringify({
            success: true,
            rates: {
              XAU: 1 / 2_400,
              XAG: 1 / 30,
              XPD: 1 / 1_000,
            },
          }), { status: 200 });
        }
        if (url.includes("bi.go.id/biwebservice")) {
          return new Response(JISDOR_XML, { status: 200 });
        }
        return new Response("not found", { status: 404 });
      }),
    );

    const result = await fetchInternationalGoldPrice();

    expect(result.usdIdrRate).toBe(17_611);
    expect(supabaseMocks.upsert).toHaveBeenCalledWith({
      key: "usd_idr_rate",
      value: "17611",
    });
  });

  it("reads the private Metalprice key with admin access when anon cannot see it", async () => {
    delete supabaseMocks.settings.api_key;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (input: string | URL | Request) => {
        const url = input.toString();
        if (url.includes("coingecko.com")) return new Response("unavailable", { status: 503 });
        if (url.includes("metalpriceapi.com")) {
          return new Response(JSON.stringify({
            success: true,
            rates: { XAU: 1 / 4_324, XAG: 1 / 65, XPD: 1 / 1_298, IDR: 17_642 },
          }), { status: 200 });
        }
        return new Response("not found", { status: 404 });
      }),
    );

    const result = await fetchInternationalGoldPrice();

    expect(result.xauUsdPerOz).toBe(4_324);
    expect(result.xauSource).toBe("metalprice");
    expect(vi.mocked(fetch).mock.calls.some(([input]) =>
      input.toString().includes("metalpriceapi.com")
    )).toBe(true);
  });

  it("does not write provider error details to server logs", async () => {
    const secret = "request URL contains private provider credential";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error(secret)));
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await fetchInternationalGoldPrice();

    expect(result.xauUsdPerOz).toBe(2_400);
    expect(result.xauSource).toBe("static");
    expect(errorLog.mock.calls.flat().map(String).join(" ")).not.toContain(secret);
  });
});
