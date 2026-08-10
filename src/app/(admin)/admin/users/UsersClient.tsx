"use client";

import { useState, useEffect } from "react";

type UserRow = {
  id: string;
  email: string;
  role: string;
  lastSignIn: string | null;
  createdAt: string | null;
};

export default function UsersClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.error) setError(data.error);
      else setUsers(data.users ?? []);
    } catch {
      setError("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function toggleRole(user: UserRow) {
    const newRole = user.role === "admin" ? "cs" : "admin";
    setUpdating(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      } else {
        setError(data.error ?? "Gagal");
      }
    } catch {
      setError("Gagal mengubah role");
    } finally {
      setUpdating(null);
    }
  }

  function formatDate(d: string | null) {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Kelola User</h1>
        <p className="mt-1 text-sm text-text-muted">Atur role Admin & CS. Login menggunakan email yang terdaftar.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
              <th className="px-4 py-4 md:px-6">Email</th>
              <th className="hidden px-4 py-4 sm:table-cell md:px-6">Terdaftar</th>
              <th className="hidden px-4 py-4 sm:table-cell md:px-6">Login Terakhir</th>
              <th className="px-4 py-4 text-center md:px-6">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface/30">
                <td className="px-4 py-3.5 md:px-6">
                  <p className="text-sm font-medium text-text">{u.email}</p>
                </td>
                <td className="hidden px-4 py-3.5 text-sm text-text-muted sm:table-cell md:px-6">
                  {formatDate(u.createdAt)}
                </td>
                <td className="hidden px-4 py-3.5 text-sm text-text-muted sm:table-cell md:px-6">
                  {formatDate(u.lastSignIn)}
                </td>
                <td className="px-4 py-3.5 text-center md:px-6">
                  <button
                    onClick={() => toggleRole(u)}
                    disabled={updating === u.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      u.role === "admin"
                        ? "bg-gold/10 text-gold-dark hover:bg-gold/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {updating === u.id ? "..." : u.role}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-text-muted">
                  Belum ada user terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
