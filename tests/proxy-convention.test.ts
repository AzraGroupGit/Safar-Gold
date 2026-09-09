import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = join(process.cwd(), "src");

describe("Next.js proxy convention", () => {
  it("uses proxy.ts instead of the deprecated middleware.ts convention", () => {
    const proxyPath = join(sourceRoot, "proxy.ts");

    expect(existsSync(join(sourceRoot, "middleware.ts"))).toBe(false);
    expect(existsSync(proxyPath)).toBe(true);

    const source = readFileSync(proxyPath, "utf8");
    expect(source).toMatch(/export async function proxy\s*\(/);
    expect(source).toContain('matcher: ["/admin/:path*", "/api/admin/:path*"]');
  });
});
