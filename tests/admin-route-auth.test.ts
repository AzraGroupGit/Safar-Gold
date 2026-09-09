import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const apiRoot = join(process.cwd(), "src", "app", "api", "admin");

function routeFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? routeFiles(path) : entry.name === "route.ts" ? [path] : [];
  });
}

const handlerPattern = /export async function (GET|POST|PUT|PATCH|DELETE)\b/g;
const authorizationPattern = /\b(requireCapability|requireRole|requireUser|getServerUser|requireAdmin)\s*\(/;

describe("admin route authorization boundary", () => {
  it.each(routeFiles(apiRoot))("authorizes every handler in %s", (file) => {
    const source = readFileSync(file, "utf8");
    const handlers = [...source.matchAll(handlerPattern)];
    expect(handlers.length).toBeGreaterThan(0);

    handlers.forEach((handler, index) => {
      const start = handler.index ?? 0;
      const end = handlers[index + 1]?.index ?? source.length;
      expect(source.slice(start, end), `${file}: ${handler[1]} has no authorization check`).toMatch(
        authorizationPattern,
      );
    });
  });
});
