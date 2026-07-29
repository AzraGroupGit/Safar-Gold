"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

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

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-text-muted"
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
          <img
            src="/logo-1.webp"
            alt="Safar Gold"
            className="h-7 w-auto rounded-lg object-contain"
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Admin Panel
          </span>
        </div>

        <main className="min-h-screen p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
