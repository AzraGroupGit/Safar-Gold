"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const current = window.scrollY;
      if (current > lastScrollY.current + 5) setVisible(false);
      else if (current < lastScrollY.current - 5) setVisible(true);
      lastScrollY.current = current;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed left-1/2 top-3 z-50 w-[96%] max-w-3xl -translate-x-1/2 transition-all duration-400 ease-out md:top-5 md:w-[95%] ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-[130px] opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-[20px] border border-border/60 bg-white/70 px-4 py-3 shadow-lg shadow-black/[0.03] backdrop-blur-md md:gap-6 md:rounded-[24px] md:px-8 md:py-4">
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src="/logo-1.webp"
              alt="Safar Gold"
              className="h-8 w-auto rounded-lg object-contain md:h-11"
            />
          </Link>

          <div className="hidden h-7 w-px bg-border/60 md:block" />
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/"
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-text-muted transition-all hover:bg-surface hover:text-text"
            >
              Beranda
            </Link>
            <Link
              href="/harga"
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-text-muted transition-all hover:bg-surface hover:text-text"
            >
              Harga
            </Link>
            <Link
              href="/tentang"
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-text-muted transition-all hover:bg-surface hover:text-text"
            >
              Tentang Kami
            </Link>
          </div>

          <div className="hidden flex-1 md:block" />
          <Link
            href="/kalkulator"
            className="gold-gradient-bg hidden shrink-0 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md shadow-gold/15 transition-all hover:shadow-lg hover:shadow-gold/20 md:block"
          >
            Kalkulator
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-surface text-text-muted transition-all hover:border-gold/30 hover:text-gold md:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute right-4 top-24 w-56 rounded-2xl border border-border/60 bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-surface"
            >
              Beranda
            </Link>
            <Link
              href="/harga"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-surface"
            >
              Harga
            </Link>
            <Link
              href="/tentang"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-surface"
            >
              Tentang Kami
            </Link>
            <div className="my-1 border-t border-border/40" />
            <Link
              href="/kalkulator"
              onClick={() => setMenuOpen(false)}
              className="gold-gradient-bg block rounded-xl px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-gold/15"
            >
              Kalkulator
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
