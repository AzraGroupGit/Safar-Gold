import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  requireCapability: vi.fn(),
  requireRole: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/server-user", () => ({
  requireCapability: mocks.requireCapability,
  requireRole: mocks.requireRole,
}));

import { GET as getDailyReport } from "../src/app/api/admin/laporan/daily/route";
import { POST as generateEod } from "../src/app/api/admin/laporan/eod/route";
import { POST as saveContent } from "../src/app/api/admin/update-konten/route";

const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "admin-validation" },
};

const validHero = {
  badge: "Harga emas hari ini",
  headlineStart: "Emas Anda,",
  headlineGradient: "Investasi Masa Depan",
  headlineEnd: "Bersama Kami",
  subheadline: "Jual beli emas dengan harga transparan.",
  ctaText: "Lihat Harga",
};

describe("admin content and report validation", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.requireCapability.mockResolvedValue(adminAuth);
    mocks.requireRole.mockResolvedValue(adminAuth);
  });

  it("rejects invalid hero content before opening a database connection", async () => {
    const response = await saveContent(new Request("http://localhost/api/admin/update-konten", {
      method: "POST",
      body: JSON.stringify({ hero: { ...validHero, subheadline: "x".repeat(501) } }),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("saves a normalized hero payload using the existing setting keys", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    mocks.createAdminClient.mockReturnValue({ from: vi.fn(() => ({ upsert })) });

    const response = await saveContent(new Request("http://localhost/api/admin/update-konten", {
      method: "POST",
      body: JSON.stringify({ hero: { ...validHero, badge: `  ${validHero.badge}  ` } }),
    }));

    expect(response.status).toBe(200);
    expect(upsert).toHaveBeenCalledWith(expect.arrayContaining([
      { key: "hero_badge", value: validHero.badge },
      { key: "hero_cta", value: validHero.ctaText },
    ]));
  });

  it("does not expose database details when content storage fails", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: { message: "private content detail" } });
    mocks.createAdminClient.mockReturnValue({ from: vi.fn(() => ({ upsert })) });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await saveContent(new Request("http://localhost/api/admin/update-konten", {
      method: "POST",
      body: JSON.stringify({ hero: validHero }),
    }));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private content detail");
  });

  it("rejects an unsupported daily report range before querying", async () => {
    const response = await getDailyReport(
      new Request("http://localhost/api/admin/laporan/daily?range=all"),
    );

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("does not expose database details when a daily report query fails", async () => {
    const order = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "private daily report detail" },
    });
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ gte: vi.fn(() => ({ order })) })),
        })),
      })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await getDailyReport(
      new Request("http://localhost/api/admin/laporan/daily?range=week"),
    );

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("private daily report detail");
  });

  it.each([
    ["malformed JSON", "{"],
    ["invalid calendar date", JSON.stringify({ date: "2026-02-30" })],
  ])("rejects an EOD request with %s before querying", async (_label, body) => {
    const response = await generateEod(new Request("http://localhost/api/admin/laporan/eod", {
      method: "POST",
      body,
    }));

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("stops safely when the EOD existence query fails", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "private EOD lookup detail" },
    });
    mocks.createAdminClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle })) })),
      })),
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await generateEod(new Request("http://localhost/api/admin/laporan/eod", {
      method: "POST",
      body: JSON.stringify({ date: "2026-09-15" }),
    }));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(body)).not.toContain("private EOD lookup detail");
  });
});
