"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const progress = useRef<number>(0);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    progress.current = 0;

    // Simulasi progress 0 → 80% dalam 500ms
    timer.current = setInterval(() => {
      progress.current += (80 - progress.current) * 0.3;
      if (progress.current > 78) {
        progress.current = 80;
        if (timer.current) clearInterval(timer.current);
      }
      document.documentElement.style.setProperty("--nav-progress", `${progress.current}%`);
    }, 100);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    if (loading) {
      // Setelah komponen mount, animasi selesai → 100%
      const t = setTimeout(() => {
        document.documentElement.style.setProperty("--nav-progress", "100%");
        setTimeout(() => {
          document.documentElement.style.setProperty("--nav-progress", "0%");
          setLoading(false);
        }, 200);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] transition-opacity duration-200"
      style={{ opacity: loading ? 1 : 0 }}
    >
      <div
        className="h-full gold-shimmer transition-[width] duration-300 ease-out"
        style={{ width: "var(--nav-progress, 0%)" }}
      />
    </div>
  );
}
