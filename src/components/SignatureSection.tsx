"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import SignaturePad from "@/components/SignaturePad";

export default function SignatureSection() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const id = data?.user?.id ?? "";
      setUserId(id);
      if (id) {
        const res = await fetch(`/api/admin/user-profile?userId=${id}`);
        const d = await res.json();
        if (d.profile) {
          setName(d.profile.name ?? "");
          setSignature(d.profile.signature ?? null);
        }
      }
    });
  }, []);

  async function save() {
    if (!userId) return;
    setSaving(true);
    await fetch("/api/admin/user-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, signature }),
    });
    setSaving(false);
    setStatus("Tersimpan");
    setTimeout(() => setStatus(""), 2000);
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
      <h3 className="mb-1 font-serif text-lg font-semibold text-text">Tanda Tangan</h3>
      <p className="mb-4 text-xs text-text-muted">
        Tanda tangan ini akan tampil otomatis pada nota/invoice saat Anda mencetak order.
      </p>
      <div className="mb-3 max-w-xs">
        <label className="mb-1 block text-xs font-medium text-text-muted">Nama</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text focus:border-gold focus:outline-none"
          placeholder="Nama lengkap"
        />
      </div>
      <SignaturePad value={signature} onChange={setSignature} />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Tanda Tangan"}
        </button>
        {status && <span className="text-sm font-medium text-green-600">{status} ✓</span>}
      </div>
    </div>
  );
}
