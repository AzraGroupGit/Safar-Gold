import { timingSafeEqual } from "node:crypto";
import { requireRole } from "@/lib/supabase/server-user";

function hasValidCronSecret(request: Request): boolean {
  const configuredSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  const prefix = "Bearer ";

  if (!configuredSecret || !authorization?.startsWith(prefix)) return false;

  const providedSecret = Buffer.from(authorization.slice(prefix.length));
  const expectedSecret = Buffer.from(configuredSecret);
  return providedSecret.length === expectedSecret.length
    && timingSafeEqual(providedSecret, expectedSecret);
}

export async function requireCronOrAdmin(request: Request) {
  if (hasValidCronSecret(request)) {
    return { ok: true as const, source: "cron" as const };
  }

  const authorization = await requireRole("admin");
  if (!authorization.ok) return authorization;

  return {
    ok: true as const,
    source: "admin" as const,
    user: authorization.user,
  };
}
