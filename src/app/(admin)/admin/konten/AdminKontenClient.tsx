"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HeroContent } from "@/lib/gold-api";

export default function AdminKontenClient({ initial }: { initial: HeroContent }) {
  const [hero, setHero] = useState<HeroContent>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field: keyof HeroContent, value: string) {
    setHero((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/update-konten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hero }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass =
    "w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Manajemen Konten</h1>
        <p className="mt-1 text-sm text-text-muted">Edit konten Hero halaman utama.</p>
      </div>

      <div className="mb-8 rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
        <h3 className="mb-6 font-serif text-lg font-semibold text-text">Hero Section</h3>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-text">Badge (teks kecil atas)</label>
            <input type="text" value={hero.badge} onChange={(e) => update("badge", e.target.value)} className={inputClass} />
          </div>
          <div className="rounded-xl border border-border/40 bg-surface/50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-dark">Judul Utama (3 bagian)</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-medium text-text-muted">Teks Awal (putih)</label>
                <input type="text" value={hero.headlineStart} onChange={(e) => update("headlineStart", e.target.value)} className={inputClass} placeholder="Emas Anda," />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-text-muted">Teks Gradient (emas)</label>
                <input type="text" value={hero.headlineGradient} onChange={(e) => update("headlineGradient", e.target.value)} className={inputClass} placeholder="Investasi Masa Depan" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-text-muted">Teks Akhir (putih, opsional)</label>
                <input type="text" value={hero.headlineEnd} onChange={(e) => update("headlineEnd", e.target.value)} className={inputClass} placeholder="Anda" />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-text">Subheadline</label>
            <textarea value={hero.subheadline} onChange={(e) => update("subheadline", e.target.value)} rows={3} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-text">CTA Text (tombol utama)</label>
            <input type="text" value={hero.ctaText} onChange={(e) => update("ctaText", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="gold-gradient-bg rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {saved && <span className="text-sm font-medium text-green-600">Tersimpan!</span>}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
        <h3 className="mb-6 font-serif text-lg font-semibold text-text">Preview Hero</h3>
        <div className="rounded-2xl border border-border/40 bg-footer p-6 text-center md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium text-gold">
            <span className="h-2 w-2 rounded-full bg-gold" />
            {hero.badge}
          </div>
          <h2 className="mt-5 font-serif text-2xl font-bold text-white md:text-4xl">
            {hero.headlineStart} <span className="gold-gradient-text">{hero.headlineGradient}</span>
            {hero.headlineEnd ? ` ${hero.headlineEnd}` : ""}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/70 md:text-base">{hero.subheadline}</p>
          <button className="mt-6 gold-gradient-bg rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gold/20 md:px-8">
            {hero.ctaText} →
          </button>
        </div>
      </div>
    </div>
  );
}
