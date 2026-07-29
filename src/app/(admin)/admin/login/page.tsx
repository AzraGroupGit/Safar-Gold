"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "Email atau password salah"
        : authError.message);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-footer px-4">
      <div className="bg-diamond absolute inset-0 opacity-40" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/logo-1.webp"
            alt="Safar Gold"
            className="mx-auto h-12 w-auto rounded-lg object-contain"
          />
          <h1 className="mt-5 font-serif text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-footer-text">Masuk untuk mengelola Safar Gold</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur">
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Email</label>
              <input
                type="email" value={email} required autoFocus
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="admin@safargold.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Password</label>
              <input
                type="password" value={password} required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="Masukkan password"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="gold-gradient-bg mt-7 w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gold/25 transition-all hover:shadow-xl hover:shadow-gold/30 disabled:opacity-60">
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-footer-text/60">
          &copy; {new Date().getFullYear()} Safar Gold
        </p>
      </div>
    </div>
  );
}
