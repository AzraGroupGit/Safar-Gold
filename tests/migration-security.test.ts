import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase", "migration.sql"), "utf8");
const v17 = migration.split("v17: Protect operational and customer data from anonymous access")[1] ?? "";

describe("migration v17 operational data policies", () => {
  it.each(["orders", "order_items", "customers", "stock_movements"])(
    "removes anonymous read access from %s",
    (table) => {
      expect(v17).toContain(`drop policy if exists "public read ${table}" on public.${table};`);
      expect(v17).toContain(`alter table public.${table} enable row level security;`);
    },
  );

  it("does not remove public pricing policies", () => {
    expect(v17).not.toContain('drop policy if exists "public read gold_types"');
    expect(v17).not.toContain('drop policy if exists "public read price_history"');
  });

  it("replaces unrestricted settings access with an explicit public allowlist", () => {
    expect(v17).toContain('drop policy if exists "public read app_settings"');
    expect(v17).toContain('create policy "public read safe app_settings"');
    expect(v17).toContain("'google_reviews_widget_id'");

    const policy = v17.split('create policy "public read safe app_settings"')[1] ?? "";
    expect(policy).not.toContain("'api_key'");
  });
});
