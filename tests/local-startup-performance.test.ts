import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rootLayout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
const publicSiteData = readFileSync(new URL("../src/lib/public-site-data.ts", import.meta.url), "utf8");
const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { scripts?: Record<string, string> };

describe("local startup performance safeguards", () => {
  it("does not make route compilation wait for Google Fonts", () => {
    expect(rootLayout).not.toContain('next/font/google');
  });

  it("shares one public app-settings query across a server render", () => {
    expect(publicSiteData).toContain("const getSettingsMap = cache");
    expect(publicSiteData).toContain('from("app_settings").select("key, value")');
  });

  it("uses the standard Next.js development server with the matching SWC binary", () => {
    expect(packageJson.scripts?.dev).toBe("next dev");
  });
});
