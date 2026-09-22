import { beforeEach, describe, expect, it, vi } from "vitest";

const createAdminClient = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient }));

import {
  createGoldType,
  deleteGoldType,
  setSetting,
  updateGoldType,
} from "../src/lib/gold-api";

describe("gold API database writes", () => {
  beforeEach(() => createAdminClient.mockReset());

  it("propagates a create database error to the route boundary", async () => {
    const databaseError = { code: "23505", message: "duplicate" };
    createAdminClient.mockReturnValue({
      from: vi.fn(() => ({ insert: vi.fn().mockResolvedValue({ error: databaseError }) })),
    });

    await expect(createGoldType({
      id: "antam-1",
      name: "Antam 1gr",
      category: "lm",
      karat: 24,
      weight: 1,
      margin_buy: 3,
      margin_sell: 2,
    })).rejects.toBe(databaseError);
  });

  it("propagates an update database error to the route boundary", async () => {
    const databaseError = { code: "PGRST", message: "update failed" };
    const eq = vi.fn().mockResolvedValue({ error: databaseError });
    createAdminClient.mockReturnValue({
      from: vi.fn(() => ({ update: vi.fn(() => ({ eq })) })),
    });

    await expect(updateGoldType("antam-1", { name: "Antam Baru" }))
      .rejects.toBe(databaseError);
  });

  it("propagates a delete database error to the route boundary", async () => {
    const databaseError = { code: "23503", message: "still referenced" };
    const eq = vi.fn().mockResolvedValue({ error: databaseError });
    createAdminClient.mockReturnValue({
      from: vi.fn(() => ({ delete: vi.fn(() => ({ eq })) })),
    });

    await expect(deleteGoldType("antam-1")).rejects.toBe(databaseError);
  });

  it("does not report a failed price setting write as successful", async () => {
    const databaseError = { code: "PGRST", message: "settings write failed" };
    createAdminClient.mockReturnValue({
      from: vi.fn(() => ({ upsert: vi.fn().mockResolvedValue({ error: databaseError }) })),
    });

    await expect(setSetting("last_cron_time", "2026-09-22T08:14:21.737Z"))
      .rejects.toBe(databaseError);
  });
});
