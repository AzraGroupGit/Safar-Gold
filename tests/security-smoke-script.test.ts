import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  evaluateBlockedTable,
  evaluatePublicSettings,
  evaluateRoleOrders,
} from "../scripts/smoke-v17.mts";

describe("v17 smoke-test assertions", () => {
  it("uses the standard Next.js development server", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.dev).toBe("next dev");
  });

  it("fails closed when an anonymous sensitive-table query returns any row", () => {
    expect(evaluateBlockedTable([])).toEqual({ pass: true, detail: "0 rows" });
    expect(evaluateBlockedTable([{ id: "leaked" }])).toEqual({
      pass: false,
      detail: "1 exposed row",
    });
  });

  it("rejects public settings that expose api_key or an unknown setting", () => {
    expect(evaluatePublicSettings([
      { key: "harga_dasar_jual" },
      { key: "google_reviews_widget_id" },
    ]).pass).toBe(true);
    expect(evaluatePublicSettings([{ key: "api_key" }]).pass).toBe(false);
    expect(evaluatePublicSettings([{ key: "future_private_setting" }]).pass).toBe(false);
  });

  it("ensures a CS only receives owned orders without GP", () => {
    expect(evaluateRoleOrders("cs-1", [
      { id: "order-1", created_by: "cs-1", total: 100_000 },
    ])).toEqual({ pass: true, detail: "1 owned order" });

    expect(evaluateRoleOrders("cs-1", [
      { id: "order-2", created_by: "cs-2", total: 100_000 },
    ]).pass).toBe(false);
    expect(evaluateRoleOrders("cs-1", [
      { id: "order-3", created_by: "cs-1", gp: 50_000 },
    ]).pass).toBe(false);
  });
});
