import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(
  new URL("../src/app/api/admin/cs-performance/route.ts", import.meta.url),
  "utf8",
);
const clientSource = readFileSync(
  new URL("../src/app/(admin)/admin/performa/CsPerformanceClient.tsx", import.meta.url),
  "utf8",
);

describe("CS performance financial privacy", () => {
  it("does not load order totals for the CS performance endpoint", () => {
    expect(routeSource).toContain("aggregateCsActivity");
    expect(routeSource).not.toContain("customer_name, total, created_at");
  });

  it("does not render financial values or income guidance for CS", () => {
    expect(clientSource).not.toContain("formatRupiah");
    expect(clientSource).not.toContain("Nilai transaksi");
    expect(clientSource).not.toContain("Catatan penghasilan");
  });
});
