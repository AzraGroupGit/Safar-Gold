"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0c0a06] px-6 text-[#f0e8d6]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,#241b0e_0%,#0c0a06_50%,#070502_100%)]" />
        <div className="absolute left-1/2 top-0 h-[72vh] w-[44rem] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(214,164,58,0.16)_0%,rgba(214,164,58,0.04)_55%,transparent_100%)] blur-[2px] [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]" />
        <div className="absolute left-1/2 top-[64%] h-40 w-[36rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="animate-fade-up relative w-full max-w-sm motion-reduce:animate-none">
        <div className="relative border border-gold/35 bg-[#121009]/85 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.06)_45%,transparent_55%)]" />
          <div className="glint-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 motion-reduce:animate-none" />
          <span className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-gold/70" />
          <span className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-gold/70" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b border-l border-gold/70" />
          <span className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b border-r border-gold/70" />

          <div className="relative px-8 py-10 sm:px-10">
            <header className="text-center">
              <img
                src="/logo-1.webp"
                alt="Safar Gold"
                className="mx-auto h-12 w-auto object-contain"
              />
              <h1 className="mt-7 font-serif text-3xl leading-tight tracking-tight text-[#f0e8d6] [text-shadow:0_1px_1px_rgba(0,0,0,0.6)]">
                Panel Safar Gold
              </h1>
              <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-[#a6957c]">
                Login untuk Admin &amp; CS
              </p>
              <div className="mx-auto mt-7 h-px w-12 bg-gold/60" />
            </header>

            <form onSubmit={handleSubmit} className="mt-10">
              <div className="space-y-7">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-[#b3a68e]"
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
                    className="w-full border border-white/15 bg-transparent px-4 py-3.5 text-sm text-[#f0e8d6] placeholder:text-[#a08f72] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
                    placeholder="admin@safargold.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-[#b3a68e]"
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
                      className="w-full border border-white/15 bg-transparent px-4 py-3.5 pr-11 text-sm text-[#f0e8d6] placeholder:text-[#a08f72] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
                      placeholder="Masukkan password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08f72] transition-colors hover:text-[#f0e8d6]"
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
                <div className="mt-6 flex items-start gap-2.5 border border-[#7f1d1d]/60 bg-[#180b0a] px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#e89187]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-[#f0b9b0]">{error}</p>
                    <Link
                      href="/admin/login"
                      onClick={(e) => { e.preventDefault(); setError(""); }}
                      className="mt-1 inline-block text-xs text-[#e8b4a9] underline underline-offset-4 hover:text-[#f0b9b0]"
                    >
                      Lupa password? Hubungi administrator
                    </Link>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-2 bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-[#0c0a06] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.25)] transition hover:bg-gold-light active:scale-[0.98] disabled:opacity-60"
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
        </div>
      </div>
    </div>
  );
}
