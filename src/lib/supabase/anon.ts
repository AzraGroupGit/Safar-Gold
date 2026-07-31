import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client ANON — untuk READ data publik saja.
 * Tidak menangani session auth (tidak ada refresh token).
 * Aman dipakai di API routes & server components untuk baca data.
 */
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
