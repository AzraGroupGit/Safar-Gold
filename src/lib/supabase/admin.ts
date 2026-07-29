import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client dengan SERVICE ROLE key — melewati RLS.
 * HANYA gunakan di server (API routes / server actions) untuk operasi tulis admin.
 * JANGAN pernah diekspos ke client.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
