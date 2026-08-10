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
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<UserRow | null>(null);
  const [saving, setSaving] = useState(false);

  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("cs");

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

  useEffect(() => { fetchUsers(); }, []);

  function resetForm() {
    setFormEmail("");
    setFormPassword("");
    setFormRole("cs");
    setEditUser(null);
  }

  function openEdit(u: UserRow) {
    setEditUser(u);
    setFormEmail(u.email);
    setFormPassword("");
    setFormRole(u.role);
    setShowModal(true);
  }

  function openAdd() {
    resetForm();
    setShowModal(true);
  }

  async function handleSave() {
    if (!formEmail) return;
    setSaving(true);
    setError("");

    try {
      if (editUser) {
        const body: Record<string, string> = { userId: editUser.id, email: formEmail, role: formRole };
        if (formPassword) body.password = formPassword;
        const res = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === editUser.id ? { ...u, email: formEmail, role: formRole } : u
            )
          );
          setShowModal(false);
          resetForm();
        } else {
          setError(data.error ?? "Gagal mengupdate user");
        }
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formEmail, password: formPassword, role: formRole }),
        });
        const data = await res.json();
        if (data.success) {
          await fetchUsers();
          setShowModal(false);
          resetForm();
        } else {
          setError(data.error ?? "Gagal membuat user");
        }
      }
    } catch {
      setError("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(userId: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setDeleteConfirm(null);
      } else {
        setError(data.error ?? "Gagal menghapus");
      }
    } catch {
      setError("Gagal menghapus");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRole(user: UserRow) {
    const newRole = user.role === "admin" ? "cs" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
      }
    } catch {
      // ignore
    }
  }

  function formatDate(d: string | null) {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Kelola User</h1>
          <p className="mt-1 text-sm text-text-muted">Tambah, edit, dan hapus user Admin & CS</p>
        </div>
        <button
          onClick={openAdd}
          className="gold-gradient-bg rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
        >
          + Tambah User
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
              <th className="px-4 py-4 md:px-6">Email</th>
              <th className="hidden px-4 py-4 sm:table-cell md:px-6">Terdaftar</th>
              <th className="hidden px-4 py-4 sm:table-cell md:px-6">Login Terakhir</th>
              <th className="px-4 py-4 text-center md:px-6">Role</th>
              <th className="px-4 py-4 text-center md:px-6">Aksi</th>
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
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      u.role === "admin"
                        ? "bg-gold/10 text-gold-dark hover:bg-gold/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {u.role}
                  </button>
                </td>
                <td className="px-4 py-3.5 text-center md:px-6">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => openEdit(u)}
                      className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-gold-dark"
                      title="Edit"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(u)}
                      className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Hapus"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-text-muted">
                  Belum ada user. Klik &quot;+ Tambah User&quot; untuk membuat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-[15vh]">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-white p-6 shadow-2xl">
            <h3 className="mb-4 font-serif text-lg font-semibold text-text">
              {editUser ? "Edit User" : "Tambah User"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text focus:border-gold focus:outline-none"
                  placeholder="user@safargold.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Password {editUser && "(biarkan kosong jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text focus:border-gold focus:outline-none"
                  placeholder={editUser ? "••••••" : "Minimal 6 karakter"}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted">Role</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormRole("admin")}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      formRole === "admin"
                        ? "border-gold bg-gold/5 text-gold-dark"
                        : "border-border/60 text-text-muted hover:border-gold/30"
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormRole("cs")}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      formRole === "cs"
                        ? "border-gold bg-gold/5 text-gold-dark"
                        : "border-border/60 text-text-muted hover:border-gold/30"
                    }`}
                  >
                    CS
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="gold-gradient-bg flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : editUser ? "Update" : "Buat User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h4 className="font-serif text-lg font-semibold text-text">Hapus User?</h4>
            <p className="mt-1 text-sm text-text-muted">
              {deleteConfirm.email} akan dihapus permanen. Semua sesi akan berakhir.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={saving}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-60"
              >
                {saving ? "..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
