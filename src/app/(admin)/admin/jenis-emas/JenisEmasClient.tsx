"use client";

import { useState } from "react";
import type { GoldTypeRow } from "@/lib/gold-api";
import AdminModalShell from "@/components/admin/AdminModalShell";

const CATEGORIES = [
  { value: "lm", label: "Logam Mulia", description: "Produk jual dengan berat tetap" },
  { value: "bb-lm", label: "Buyback LM", description: "Pembelian kembali logam mulia" },
  { value: "bb-perhiasan", label: "Perhiasan", description: "Penilaian utama berdasarkan karat" },
  { value: "bb-logam", label: "Logam Lain", description: "Perak, palladium, dan logam lain" },
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
  const hasChanges = Object.keys(initial).some(key => form[key as keyof FormData] !== initial[key as keyof FormData]);
  const selectedCategory = CATEGORIES.find(category => category.value === form.category) ?? CATEGORIES[0];
  const weightRequired = form.category === "lm";
  const canSave = Boolean(form.name.trim() && form.category && form.id && (!weightRequired || Number(form.weight) > 0) && (!isEdit || hasChanges));

  if (!open) return null;

  return (
    <AdminModalShell eyebrow="Master produk" title={isEdit ? "Edit jenis emas" : "Tambah jenis emas"} description={isEdit ? "Perbarui atribut produk tanpa mengubah identitas sistemnya." : "Buat produk baru untuk digunakan pada harga, stok, dan order."} onClose={onClose} footer={<><p className="mr-auto hidden text-xs text-text-muted sm:block">{isEdit ? "ID produk tetap dipertahankan." : "ID dibuat otomatis dari nama produk."}</p><button type="button" onClick={onClose} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted hover:bg-white">Batal</button><button type="button" onClick={() => onSave(form)} disabled={saving || !canSave} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah produk"}</button></>}>
      <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-12">
        <section className="rounded-xl border border-border/50 bg-white p-4 lg:col-span-7"><p className="mb-4 text-[10px] font-semibold uppercase tracking-[.14em] text-text-muted">Detail produk</p><div><label htmlFor="gold-type-name" className="mb-1.5 block text-xs font-medium text-text-muted">Nama produk</label><input id="gold-type-name" type="text" value={form.name} onChange={event => { const name = event.target.value; setForm({ ...form, name, id: isEdit ? form.id : nameToSlug(name) }); }} placeholder="Contoh: Antam 1 gram" className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></div><fieldset className="mt-4"><legend className="mb-2 text-xs font-medium text-text-muted">Kategori</legend><div className="grid gap-2 sm:grid-cols-2" role="radiogroup">{CATEGORIES.map(category => <button key={category.value} type="button" role="radio" aria-checked={form.category === category.value} onClick={() => setForm({ ...form, category: category.value, karat: (category.value === "lm" || category.value === "bb-lm") && !form.karat ? "24" : form.karat })} className={`rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${form.category === category.value ? "border-gold/60 bg-gold/[.07]" : "border-border/50 bg-surface/30 hover:border-gold/30"}`}><span className={`text-sm font-semibold ${form.category === category.value ? "text-gold-dark" : "text-text"}`}>{category.label}</span><span className="mt-0.5 block text-[11px] leading-relaxed text-text-muted">{category.description}</span></button>)}</div></fieldset><div className="mt-4 grid grid-cols-2 gap-4"><div><label htmlFor="gold-type-karat" className="mb-1.5 block text-xs font-medium text-text-muted">Karat <span className="font-normal text-text-light">(opsional)</span></label><div className="relative"><input id="gold-type-karat" type="number" min={1} max={24} value={form.karat} onChange={event => setForm({ ...form, karat: event.target.value })} placeholder="24" className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 pr-9 text-sm tabular-nums focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-light">K</span></div></div><div><label htmlFor="gold-type-weight" className="mb-1.5 block text-xs font-medium text-text-muted">Berat {weightRequired ? <span className="text-red-600">*</span> : <span className="font-normal text-text-light">(opsional)</span>}</label><div className="relative"><input id="gold-type-weight" type="number" min="0.1" value={form.weight} onChange={event => setForm({ ...form, weight: event.target.value })} placeholder="1" step="0.1" className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 pr-9 text-sm tabular-nums focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-light">g</span></div></div></div></section>
        <aside className="relative overflow-hidden rounded-xl border border-gold/25 bg-surface/45 p-5 lg:col-span-5"><span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gold" /><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-gold-dark">Preview produk</p><div className="mt-5 rounded-xl border border-border/50 bg-white p-4"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-text-muted">{selectedCategory.label}</p><h3 className="mt-2 font-serif text-xl font-semibold text-text">{form.name.trim() || "Nama jenis emas"}</h3><div className="mt-4 flex flex-wrap gap-2">{form.karat && <span className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-dark">{form.karat}K</span>}{form.weight && <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-text-muted">{form.weight} gram</span>}</div></div><dl className="mt-5 space-y-3 text-xs"><div className="flex justify-between gap-4"><dt className="text-text-muted">ID sistem</dt><dd className="max-w-[65%] break-all text-right font-mono text-[11px] text-text">{form.id || "dibuat-dari-nama"}</dd></div><div className="flex justify-between gap-4"><dt className="text-text-muted">Harga</dt><dd className="text-right text-text">Mengikuti pengaturan</dd></div><div className="flex justify-between gap-4"><dt className="text-text-muted">Inventori</dt><dd className="text-right text-text">Tersedia setelah dibuat</dd></div></dl><p className="mt-5 border-t border-border/40 pt-4 text-[11px] leading-relaxed text-text-muted">{selectedCategory.description}. Produk ini akan muncul pada modul yang sesuai dengan kategorinya.</p>{isEdit && !hasChanges && <p className="mt-3 rounded-lg border border-border/50 bg-white px-3 py-2 text-[11px] text-text-muted">Belum ada perubahan pada produk.</p>}</aside>
      </div>
    </AdminModalShell>
  );
}

export default function JenisEmasClient({ goldTypes: initialGoldTypes }: { goldTypes: GoldTypeRow[] }) {
  const [goldTypes] = useState(initialGoldTypes);
  const [formModal, setFormModal] = useState<{ open: boolean; data: FormData }>({ open: false, data: emptyForm });
  const [deleteTarget, setDeleteTarget] = useState<GoldTypeRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
    setDeleteError("");
    const response = await fetch("/api/admin/delete-gold-type", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteTarget.id }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      setDeleteError(result.error ?? "Jenis emas tidak dapat dihapus karena masih digunakan.");
      setSaving(false);
      return;
    }
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
                      <button onClick={() => { setDeleteError(""); setDeleteTarget(gt); }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
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
        key={`${formModal.open}-${formModal.data.id}`}
        open={formModal.open}
        onClose={() => setFormModal({ open: false, data: emptyForm })}
        initial={formModal.data}
        onSave={handleSave}
        saving={saving}
      />

      {deleteTarget && <AdminModalShell size="compact" accent="danger" eyebrow="Tindakan permanen" title="Hapus jenis emas?" description="Pastikan produk tidak lagi digunakan pada stok, order, atau histori harga." onClose={() => setDeleteTarget(null)} footer={<><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted hover:bg-white">Batal</button><button type="button" onClick={handleDelete} disabled={saving} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menghapus..." : "Hapus produk"}</button></>}><div className="space-y-4 px-5 py-5 sm:px-6">{deleteError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{deleteError}</div>}<section className="rounded-xl border border-border/50 bg-surface/50 p-4"><p className="font-serif text-lg font-semibold text-text">{deleteTarget.name}</p><p className="mt-1 text-xs text-text-muted">{getCategoryLabel(deleteTarget.category)}{deleteTarget.karat ? ` · ${deleteTarget.karat}K` : ""}{deleteTarget.weight ? ` · ${deleteTarget.weight} gram` : ""}</p><p className="mt-4 border-t border-border/40 pt-3 font-mono text-[11px] text-text-muted">ID: {deleteTarget.id}</p></section><p className="text-xs leading-relaxed text-text-muted">Tindakan ini tidak dapat dibatalkan. Database akan menolak penghapusan apabila produk masih memiliki relasi aktif.</p></div></AdminModalShell>}
    </div>
  );
}
