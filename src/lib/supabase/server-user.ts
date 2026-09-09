import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  hasCapability,
  normalizeAppRole,
  type AppRole,
  type Capability,
} from "../permissions";

export type { AppRole } from "../permissions";

export async function getServerUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // Route authorization only reads the existing session.
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  return error ? null : user;
}

export function getUserRole(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> }) {
  return normalizeAppRole(user.app_metadata?.role);
}

export function isRoleAllowed(role: AppRole | null, allowedRoles: readonly AppRole[]): boolean {
  return role !== null && allowedRoles.includes(role);
}

export async function requireUser() {
  const user = await getServerUser();
  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true as const, user };
}

export async function requireRole(...allowedRoles: AppRole[]) {
  const authenticated = await requireUser();
  if (!authenticated.ok) return authenticated;

  const role = getUserRole(authenticated.user);
  if (!isRoleAllowed(role, allowedRoles)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true as const, user: authenticated.user, role };
}

export async function requireCapability(capability: Capability) {
  const authenticated = await requireUser();
  if (!authenticated.ok) return authenticated;

  const role = getUserRole(authenticated.user);
  if (!hasCapability(role, capability)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true as const, user: authenticated.user, role };
}
