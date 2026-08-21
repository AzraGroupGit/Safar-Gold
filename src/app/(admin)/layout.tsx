"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/harga": "Manajemen Harga",
  "/admin/jenis-emas": "Jenis Emas",
  "/admin/users": "Kelola User",
  "/admin/konten": "Konten",
  "/admin/laporan": "Laporan",
  "/admin/orders": "Orders",
  "/admin/pelanggan": "Pelanggan",
  "/admin/pengaturan": "Pengaturan",
  "/admin/stock": "Stok",
};

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  const match = Object.keys(pageTitles)
    .filter((k) => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return match ? pageTitles[match] : "Dashboard";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Halaman login tampil penuh tanpa sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const title = getPageTitle(pathname);

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
            <span className="text-text-muted">Admin</span>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold-dark ring-1 ring-gold/30">
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
          </div>
        </header>

        <main className="min-h-screen p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}