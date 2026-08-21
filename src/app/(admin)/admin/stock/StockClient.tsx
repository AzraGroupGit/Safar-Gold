"use client";

import { useState, useEffect, useMemo } from "react";
import type { GoldTypeRow } from "@/lib/gold-api";
import { sortGoldTypes } from "@/lib/gold-api";

type StockRow = { gold_type_id: string; qty: number; min_qty: number; updated_at: string; gold_types: { name: string; weight: number | null; category: string } | null };
type Movement = { id: string; gold_type_id: string; type: string; qty: number; notes: string | null; created_at: string; gold_types: { name: string } | null };

const CATEGORY_ORDER = ["lm", "bb-lm", "bb-perhiasan", "bb-logam"];
const CATEGORY_LABELS: Record<string, string> = {
  lm: "LM (Jual)",
  "bb-lm": "Buyback LM",
  "bb-perhiasan": "Perhiasan",
  "bb-logam": "Logam Lain",
};

export default function StockClient({ goldTypes }: { goldTypes: GoldTypeRow[] }) {
  const [stock, setStock] = useState<StockRow[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moveFilter, setMoveFilter] = useState<"all" | "in" | "out">("all");
  const [reloadKey, setReloadKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"stock" | "movements">("stock");

  // Adjustment modal
  const [showModal, setShowModal] = useState(false);
  const [adjProduct, setAdjProduct] = useState("");
  const [adjType, setAdjType] = useState<"in" | "out">("in");
  const [adjQty, setAdjQty] = useState(1);
  const [adjNotes, setAdjNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Min qty modal
  const [showMinModal, setShowMinModal] = useState(false);
  const [minProduct, setMinProduct] = useState<StockRow | null>(null);
  const [minQty, setMinQty] = useState(1);

  const qtyMap = useMemo(() => new Map(stock.map((s) => [s.gold_type_id, s.qty])), [stock]);
  const goldTypeMap = useMemo(() => new Map(goldTypes.map((g) => [g.id, g])), [goldTypes]);

  const inOptions = useMemo(() => sortGoldTypes(goldTypes), [goldTypes]);
  const outOptions = useMemo(
    () => sortGoldTypes(goldTypes.filter((g) => g.category === "lm" && (qtyMap.get(g.id) ?? 0) > 0)),
    [goldTypes, qtyMap],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [s, m] = await Promise.all([
          fetch("/api/admin/stock").then(r => r.json()),
          fetch("/api/admin/stock/movements").then(r => r.json()),
        ]);
        if (!cancelled) {
          setStock(s.stock ?? []);
          setMovements(m.movements ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [reloadKey]);

  async function handleAdjust() {
    if (!adjProduct || adjQty <= 0) { setError("Pilih produk dan qty"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/admin/stock/adjust", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goldTypeId: adjProduct, type: adjType, qty: adjQty, notes: adjNotes }) });
    const data = await res.json();
    if (data.success) { setShowModal(false); setAdjProduct(""); setAdjQty(1); setAdjNotes(""); setReloadKey(k => k + 1); } else { setError(data.error ?? "Gagal"); }
    setSaving(false);
  }

  async function handleSaveMinQty() {
    if (!minProduct) return;
    setSaving(true); setError("");
    const res = await fetch("/api/admin/stock/min-qty", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goldTypeId: minProduct.gold_type_id, minQty }) });
    const data = await res.json();
    if (data.success) {
      setStock(prev => prev.map(s => s.gold_type_id === minProduct.gold_type_id ? { ...s, min_qty: minQty } : s));
      setShowMinModal(false);
    } else {
      setError(data.error ?? "Gagal menyimpan");
    }
    setSaving(false);
  }

  function openMinModal(s: StockRow) {
    setMinProduct(s);
    setMinQty(s.min_qty);
    setError("");
    setShowMinModal(true);
  }

  function switchType(t: "in" | "out") {
    setAdjType(t);
    const opts = t === "out" ? outOptions : inOptions;
    setAdjProduct(opts[0]?.id ?? "");
  }

  const filteredStock = useMemo(() => {
    if (!search) return stock;
    const q = search.toLowerCase();
    return stock.filter(s => (s.gold_types?.name ?? s.gold_type_id).toLowerCase().includes(q));
  }, [stock, search]);

  const filteredMovements = useMemo(() => {
    const byType = moveFilter === "all" ? movements : movements.filter(m => m.type === moveFilter);
    if (!search) return byType;
    const q = search.toLowerCase();
    return byType.filter(m => (m.gold_types?.name ?? m.gold_type_id).toLowerCase().includes(q) || (m.notes ?? "").toLowerCase().includes(q));
  }, [movements, moveFilter, search]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-serif text-2xl font-semibold text-text">Stok</h1><p className="mt-1 text-sm text-text-muted">Inventori Emas — LM (Jual) & Buyback</p></div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk atau catatan..." className="w-full max-w-xs rounded-lg border border-border/60 bg-white pl-10 pr-4 py-2.5 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" />
        </div>

        <div className="mx-auto flex gap-1 rounded-lg border border-border/60 bg-white p-1">
          <button onClick={() => setActiveTab("stock")} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab==="stock"?"bg-gold/10 text-gold-dark":"text-text-muted hover:text-text"}`}>
            Stok <span className="ml-1 text-xs text-text-light">{stock.length}</span>
          </button>
          <button onClick={() => setActiveTab("movements")} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab==="movements"?"bg-gold/10 text-gold-dark":"text-text-muted hover:text-text"}`}>
            Riwayat Pergerakan <span className="ml-1 text-xs text-text-light">{movements.length}</span>
          </button>
        </div>

        <div>
          {activeTab === "stock" ? (
            <button onClick={() => { setAdjType("in"); setAdjProduct(inOptions[0]?.id ?? ""); setAdjQty(1); setAdjNotes(""); setError(""); setShowModal(true); }} className="rounded-lg border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold-dark transition-colors hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2">Sesuaikan Stok</button>
          ) : (
            <div className="flex gap-1 rounded-lg border border-border/60 bg-white p-1">
              {[{ key: "all", label: "Semua" }, { key: "in", label: "Masuk" }, { key: "out", label: "Keluar" }].map(f => (
                <button key={f.key} onClick={() => setMoveFilter(f.key as "all" | "in" | "out")} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${moveFilter===f.key?"bg-gold/10 text-gold-dark":"text-text-muted hover:text-text"}`}>{f.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeTab === "stock" && (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-white">
            <table className="w-full min-w-[520px]">
              <thead><tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><th className="px-4 py-4 md:px-6">Produk</th><th className="hidden px-4 py-4 sm:table-cell md:px-6">Berat</th><th className="px-4 py-4 text-center md:px-6">Stok</th><th className="px-4 py-4 text-center md:px-6">Min</th><th className="px-4 py-4 text-center md:px-6">Status</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {filteredStock.map(s => (
                  <tr key={s.gold_type_id} className="hover:bg-surface/30">
                    <td className="px-4 py-3.5 md:px-6"><p className="text-sm font-medium text-text">{s.gold_types?.name ?? s.gold_type_id}</p><span className="text-[11px] uppercase tracking-wide text-text-muted">{CATEGORY_LABELS[goldTypeMap.get(s.gold_type_id)?.category ?? ""] ?? "-"}</span></td>
                    <td className="hidden px-4 py-3.5 text-sm text-text-muted sm:table-cell md:px-6">{s.gold_types?.weight ? `${s.gold_types.weight}g` : "-"}</td>
                    <td className="px-4 py-3.5 text-center"><span className={`text-sm font-bold tabular-nums ${s.qty <= s.min_qty ? "text-red-500" : "text-text"}`}>{s.qty}</span></td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => openMinModal(s)} className="text-sm text-text-muted underline underline-offset-2 hover:text-gold-dark">{s.min_qty}</button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {s.qty === 0 ? <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">Habis</span>
                      : s.qty <= s.min_qty ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Menipis</span>
                      : <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Tersedia</span>}
                    </td>
                  </tr>
                ))}
                {filteredStock.length===0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-text-muted">{search ? "Tidak ada produk yang cocok." : "Belum ada data stok."}</td></tr>}
              </tbody>
            </table>
          </div>
      )}

      {activeTab === "movements" && (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-white">
            <table className="w-full min-w-[640px]">
              <thead><tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><th className="px-4 py-3">Waktu</th><th className="px-4 py-3">Produk</th><th className="px-4 py-3 text-center">Tipe</th><th className="px-4 py-3 text-center">Qty</th><th className="px-4 py-3">Catatan</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {filteredMovements.map(m => (
                  <tr key={m.id}><td className="px-4 py-3 text-xs text-text-muted">{new Date(m.created_at).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</td><td className="px-4 py-3 text-sm text-text">{m.gold_types?.name ?? m.gold_type_id}<span className="ml-1 text-[10px] uppercase tracking-wide text-text-muted">{CATEGORY_LABELS[goldTypeMap.get(m.gold_type_id)?.category ?? ""] ?? ""}</span></td><td className="px-4 py-3 text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.type==="in"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>{m.type==="in"?"Masuk":"Keluar"}</span></td><td className="px-4 py-3 text-center text-sm font-semibold tabular-nums">{m.qty}</td><td className="px-4 py-3 text-xs text-text-muted">{m.notes??"-"}</td></tr>
                ))}
                {filteredMovements.length===0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-text-muted">Belum ada pergerakan stok.</td></tr>}
              </tbody>
            </table>
          </div>
      )}

      {/* Adjustment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[20vh]">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-sm rounded-xl border border-border/60 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-serif text-lg font-semibold text-text">Sesuaikan Stok</h3>
            {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
            <div className="space-y-4">
              <div><label className="mb-1 block text-xs font-medium text-text-muted">Produk</label><select value={adjProduct} onChange={e => setAdjProduct(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm">{adjType === "in" ? CATEGORY_ORDER.map(cat => { const items = inOptions.filter(g => g.category === cat); if (items.length === 0) return null; return (<optgroup key={cat} label={CATEGORY_LABELS[cat]}>{items.map(g => <option key={g.id} value={g.id}>{g.name} ({qtyMap.get(g.id) ?? 0})</option>)}</optgroup>); }) : outOptions.map(g => <option key={g.id} value={g.id}>{g.name} ({qtyMap.get(g.id) ?? 0})</option>)}</select></div>
              {adjType === "in" && adjProduct && (<p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs text-text-muted">Stok saat ini: <span className="font-semibold text-text">{qtyMap.get(adjProduct) ?? 0}</span>{adjQty > 0 && <> → setelah masuk menjadi <span className="font-semibold text-emerald-700">{(qtyMap.get(adjProduct) ?? 0) + adjQty}</span></>}</p>)}
              <div><label className="mb-1 block text-xs font-medium text-text-muted">Tipe</label><div className="flex gap-3"><button onClick={() => switchType("in")} className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium ${adjType==="in"?"border-emerald-400 bg-emerald-50 text-emerald-700":"border-border/60 text-text-muted"}`}>Masuk (+)</button><button onClick={() => switchType("out")} className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium ${adjType==="out"?"border-red-400 bg-red-50 text-red-600":"border-border/60 text-text-muted"}`}>Keluar (−)</button></div></div>
              <div><label className="mb-1 block text-xs font-medium text-text-muted">Qty</label><input type="number" min={1} value={adjQty} onChange={e => setAdjQty(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-xs font-medium text-text-muted">Catatan (opsional)</label><input type="text" value={adjNotes} onChange={e => setAdjNotes(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="Stock opname, koreksi, dll" /></div>
            </div>
            <div className="mt-6 flex gap-3"><button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2">Batal</button><button onClick={handleAdjust} disabled={saving} className="flex-1 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-60">{saving ? "..." : "Simpan"}</button></div>
          </div>
        </div>
      )}

      {/* Min Qty Modal */}
      {showMinModal && minProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[25vh]">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMinModal(false)} />
          <div className="relative w-full max-w-xs rounded-xl border border-border/60 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-serif text-lg font-semibold text-text">Edit Min Stok</h3>
            {error && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
            <p className="mb-3 text-sm text-text-muted">{minProduct.gold_types?.name ?? minProduct.gold_type_id}</p>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted">Minimal Stok (alert)</label>
              <input type="number" min={0} value={minQty} onChange={e => setMinQty(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" />
            </div>
            <div className="mt-6 flex gap-3"><button onClick={() => setShowMinModal(false)} className="flex-1 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2">Batal</button><button onClick={handleSaveMinQty} disabled={saving} className="flex-1 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-60">{saving ? "..." : "Simpan"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
