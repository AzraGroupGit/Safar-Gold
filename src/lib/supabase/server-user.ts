import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
  for (const candidate of [user.app_metadata?.role, user.user_metadata?.role]) {
    if (typeof candidate !== "string") continue;
    const normalized = candidate.trim().toLowerCase();
    if (normalized === "admin" || normalized === "cs") return normalized;
  }
  return null;
}
