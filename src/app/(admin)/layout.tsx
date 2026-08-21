"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/client";

const pageMeta: Record<string, { title: string; group: string }> = {
  "/admin": { title: "Dashboard", group: "Utama" },
  "/admin/harga": { title: "Manajemen Harga", group: "Utama" },
  "/admin/orders": { title: "Orders", group: "Transaksi" },
  "/admin/pelanggan": { title: "Pelanggan", group: "Transaksi" },
  "/admin/stock": { title: "Stok", group: "Inventori" },
  "/admin/laporan": { title: "Laporan", group: "Inventori" },
  "/admin/jenis-emas": { title: "Jenis Emas", group: "Pengelolaan" },
  "/admin/konten": { title: "Konten", group: "Pengelolaan" },
  "/admin/users": { title: "Kelola User", group: "Pengelolaan" },
  "/admin/pengaturan": { title: "Pengaturan", group: "Pengelolaan" },
};

function getPageMeta(pathname: string): { title: string; group: string } {
  if (pathname === "/admin") return pageMeta["/admin"];
  const match = Object.keys(pageMeta)
    .filter((k) => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return match ? pageMeta[match] : pageMeta["/admin"];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();
        const { data: { user: u } } = await supabase.auth.getUser();
        if (u) {
          setUser({ email: u.email ?? "", role: u.user_metadata?.role ?? "admin" });
        }
      } catch {
        // keep null
      }
    }
    fetchUser();
  }, []);

  // Halaman login tampil penuh tanpa sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const { title, group } = getPageMeta(pathname);
  const name = user?.email ? user.email.split("@")[0] : "";
  const roleLabel = user?.role === "cs" ? "CS" : "Admin";
  const initial = (name.charAt(0) || "A").toUpperCase();

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-border/60 bg-white/85 px-4 backdrop-blur-md md:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-text-muted transition-colors hover:bg-surface lg:hidden"
            aria-label="Buka menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
            <span className="text-text-muted">{group}</span>
            <svg
              className="h-3.5 w-3.5 text-text-light"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-text">{title}</span>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden flex-col items-end sm:flex">
                  <p className="text-sm font-semibold leading-tight text-text">{name}</p>
                  <span className="mt-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                    {roleLabel}
                  </span>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold-dark ring-1 ring-gold/30">
                  {initial}
                </div>
              </>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold-dark ring-1 ring-gold/30">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
            )}
          </div>
        </header>

        <main className="min-h-screen p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}