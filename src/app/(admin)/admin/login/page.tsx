"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setError(
        authError.message === "Invalid login credentials"
          ? "Email atau password salah"
          : authError.message
      );
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#0c0a06]">
      {/* Brand panel (desktop) */}
      <aside className="relative hidden w-1/2 overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/safar-hero.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a06]/75 via-[#0c0a06]/55 to-[#0c0a06]" />
        <div className="bg-diamond absolute inset-0 opacity-[0.15]" />

        <div className="relative flex h-full flex-col justify-end p-12 xl:p-16">
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-[#f0e8d6] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] xl:text-6xl">
            Safar Gold
          </h1>
          <div className="mt-6 h-px w-16 bg-gold/70" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
            Login untuk mengelola harga, transaksi, dan stok.
          </p>
        </div>

        <div className="absolute right-0 top-0 h-full w-px bg-gold/30" />
      </aside>

      {/* Form panel (light) */}
      <main className="flex w-full flex-col items-center justify-center bg-surface px-8 py-24 sm:px-12 lg:w-1/2 lg:px-16 xl:px-20">
        <div className="animate-fade-up w-full max-w-sm motion-reduce:animate-none">
          <header className="text-center">
            <h1 className="font-serif text-2xl leading-tight tracking-tight text-text">
              Panel Safar Gold
            </h1>
          </header>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-text-muted"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  required
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-white px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                  placeholder="admin@safargold.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-text-muted"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border/60 bg-white px-4 py-3 pr-11 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light transition-colors hover:text-text"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div>
                  <p className="text-sm text-red-600">{error}</p>
                  <Link
                    href="/admin/login"
                    onClick={(e) => { e.preventDefault(); setError(""); }}
                    className="mt-1 inline-block text-xs text-red-500 underline underline-offset-4 hover:text-red-600"
                  >
                    Lupa password? Hubungi administrator
                  </Link>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </main>

      {/* Single logo on divider */}
      <div className="absolute left-1/2 top-10 z-10 -translate-x-1/2">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gold/40">
          <Image
            src="/logo-1.webp"
            alt="Safar Gold"
            fill
            sizes="64px"
            className="object-contain p-3"
          />
        </div>
      </div>
    </div>
  );
}
