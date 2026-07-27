"use client";

import { useState } from "react";

export default function AdminKonten() {
  const [hero, setHero] = useState({
    headline: "Emas Anda, Investasi Masa Depan Anda",
    subheadline: "Pantau harga emas real-time, hitung transaksi dengan kalkulator cerdas, dan dapatkan harga terbaik setiap hari.",
    ctaText: "Cek Harga Hari Ini",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Manajemen Konten</h1>
        <p className="mt-1 text-sm text-text-muted">Edit konten halaman landing page</p>
      </div>

      <div className="mb-8 rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
        <h3 className="mb-6 font-serif text-lg font-semibold text-text">Hero Section</h3>
        <div className="space-y-5">
          {[
            { label: "Headline", field: "headline", type: "text" as const },
            { label: "Subheadline", field: "subheadline", type: "textarea" as const },
            { label: "CTA Text", field: "ctaText", type: "text" as const },
          ].map((item) => (
            <div key={item.field}>
              <label className="mb-2 block text-sm font-semibold text-text">{item.label}</label>
              {item.type === "textarea" ? (
                <textarea
                  value={hero.subheadline}
                  onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10"
                />
              ) : (
                <input
                  type="text"
                  value={hero[item.field as keyof typeof hero]}
                  onChange={(e) => setHero({ ...hero, [item.field]: e.target.value })}
                  className="w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10"
                />
              )}
            </div>
          ))}
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
        <div className="rounded-2xl border border-border/40 bg-surface p-6 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2 text-xs font-medium text-gold-dark">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            Harga Real-time Hari Ini
          </div>
          <h2 className="mt-6 font-serif text-2xl font-bold text-text md:text-3xl">{hero.headline}</h2>
          <p className="mt-3 max-w-lg text-sm text-text-muted md:text-base">{hero.subheadline}</p>
          <button className="mt-6 gold-gradient-bg rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gold/20 md:px-8">
            {hero.ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}
