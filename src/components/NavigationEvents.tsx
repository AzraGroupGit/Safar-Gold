"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-md">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-gold/30 border-t-gold" />
        <p className="text-sm font-medium text-gold-dark">Memuat...</p>
      </div>
    </div>
  );
}
