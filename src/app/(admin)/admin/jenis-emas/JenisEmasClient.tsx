"use client";

import { useState } from "react";
import type { GoldTypeRow } from "@/lib/gold-api";
import ConfirmModal from "@/components/ConfirmModal";

const CATEGORIES = [
  { value: "lm", label: "Logam Mulia" },
  { value: "bb-lm", label: "Buyback LM" },
  { value: "bb-perhiasan", label: "Perhiasan" },
  { value: "bb-logam", label: "Logam Lain" },
];

function getCategoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function nameToSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface FormData {
  id: string;
  name: string;
  category: string;
  karat: string;
  weight: string;
}

const emptyForm: FormData = { id: "", name: "", category: "lm", karat: "", weight: "" };

function FormModal({
  open,
  onClose,
  initial,
  onSave,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  initial: FormData;
  onSave: (data: FormData) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const isEdit = !!initial.id;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-[10vh] pb-10">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-border/60 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
          <h2 className="font-serif text-lg font-semibold text-text">
            {isEdit ? "Edit Jenis Emas" : "Tambah Jenis Emas"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {!isEdit && (
            <div>
              <label className="mb-1 block text-sm font-medium text-text">ID (slug)</label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="antam-1"
                className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm({ ...form, name, id: isEdit ? form.id : nameToSlug(name) });
              }}
              placeholder="Antam 1gr"
              className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Karat</label>
              <input
                type="number"
                value={form.karat}
                onChange={(e) => setForm({ ...form, karat: e.target.value })}
                placeholder="24"
                className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Berat (gr)</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="1"
                step="0.1"
                className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border/40 px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-border/60 bg-white px-5 py-2.5 text-sm font-semibold text-text-muted transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2">
            Batal
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name || !form.category || (!isEdit && !form.id)}
            className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JenisEmasClient({ goldTypes: initialGoldTypes }: { goldTypes: GoldTypeRow[] }) {
  const [goldTypes] = useState(initialGoldTypes);
  const [formModal, setFormModal] = useState<{ open: boolean; data: FormData }>({ open: false, data: emptyForm });
  const [deleteTarget, setDeleteTarget] = useState<GoldTypeRow | null>(null);
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setFormModal({ open: true, data: emptyForm });
  }

  function openEdit(gt: GoldTypeRow) {
    setFormModal({
      open: true,
      data: {
        id: gt.id,
        name: gt.name,
        category: gt.category,
        karat: gt.karat?.toString() ?? "",
        weight: gt.weight?.toString() ?? "",
      },
    });
  }

  async function handleSave(form: FormData) {
    setSaving(true);
    const body = {
      id: form.id,
      name: form.name,
      category: form.category,
      karat: form.karat ? parseInt(form.karat) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
    };

    if (formModal.data.id && form.id) {
      await fetch("/api/admin/update-gold-type", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/create-gold-type", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }

    window.location.reload();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    await fetch("/api/admin/delete-gold-type", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteTarget.id }) });
    setDeleteTarget(null);
    window.location.reload();
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-text">Jenis Emas</h1>
          <p className="mt-1 text-sm text-text-muted">Kelola kategori & jenis emas</p>
        </div>
        <button onClick={openAdd} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2">
          + Tambah
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-4 py-4 md:px-6">Nama</th>
                <th className="px-4 py-4 md:px-6">Kategori</th>
                <th className="px-4 py-4 md:px-6">Karat</th>
                <th className="px-4 py-4 md:px-6">Berat</th>
                <th className="px-4 py-4 md:px-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {goldTypes.map((gt) => (
                <tr key={gt.id} className="transition-colors hover:bg-surface/50">
                  <td className="px-4 py-3 md:px-6"><p className="text-sm font-semibold text-text">{gt.name}</p></td>
                  <td className="px-4 py-3 md:px-6"><span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium uppercase text-text-muted">{getCategoryLabel(gt.category)}</span></td>
                  <td className="px-4 py-3 md:px-6"><span className="text-sm text-text">{gt.karat ?? "-"}</span></td>
                  <td className="px-4 py-3 md:px-6"><span className="text-sm text-text">{gt.weight ?? "-"}</span></td>
                  <td className="px-4 py-3 md:px-6">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(gt)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-gold-dark transition-colors hover:bg-gold/5">
                        Edit
                      </button>
                      <button onClick={() => setDeleteTarget(gt)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {goldTypes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-text-muted">Belum ada jenis emas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, data: emptyForm })}
        initial={formModal.data}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Jenis Emas?"
        message={`Yakin ingin menghapus "${deleteTarget?.name}"? Data harga terkait mungkin terpengaruh.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
