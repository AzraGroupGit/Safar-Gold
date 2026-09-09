"use client";

import { useState, useEffect, useMemo } from "react";
import type { GoldTypeRow } from "@/lib/gold-api";
import { sortGoldTypes } from "@/lib/gold-api";
import StockModalShell from "@/components/admin/AdminModalShell";

type StockRow = { gold_type_id: string; brand: string | null; qty: number; min_qty: number; updated_at: string; gold_types: { name: string; weight: number | null; category: string } | null; total_weight_sold?: number; total_revenue?: number };
type Movement = { id: string; gold_type_id: string; brand: string | null; order_id: string | null; type: string; qty: number; notes: string | null; created_at: string; created_by: string | null; actor_email: string | null; reversed_at: string | null; reversal_of: string | null; correction_of: string | null; gold_types: { name: string } | null };

const CATEGORY_ORDER = ["lm", "bb-lm", "bb-perhiasan", "bb-logam"];
const CATEGORY_LABELS: Record<string, string> = {
  lm: "LM (Jual)",
  "bb-lm": "Buyback LM",
  "bb-perhiasan": "Perhiasan",
  "bb-logam": "Logam Lain",
};
const BRAND_OPTIONS = ["Antam", "Antam Retro", "UBS", "HRTA", "BSI", "G24", "Lainnya"];

export default function StockClient({ goldTypes, canManage }: { goldTypes: GoldTypeRow[]; canManage: boolean }) {
  const [stock, setStock] = useState<StockRow[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moveFilter, setMoveFilter] = useState<"all" | "in" | "out">("all");
  const [reloadKey, setReloadKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"stock" | "movements">("stock");
  const [range, setRange] = useState<"all" | "today" | "week" | "month">("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Adjustment modal
  const [showModal, setShowModal] = useState(false);
  const [adjProduct, setAdjProduct] = useState("");
  const [adjBrand, setAdjBrand] = useState("Antam");
  const [adjType, setAdjType] = useState<"in" | "out">("in");
  const [adjQty, setAdjQty] = useState(1);
  const [adjNotes, setAdjNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Min qty modal
  const [showMinModal, setShowMinModal] = useState(false);
  const [minProduct, setMinProduct] = useState<StockRow | null>(null);
  const [minQty, setMinQty] = useState(1);

  // Correction modal
  const [correctionMovement, setCorrectionMovement] = useState<Movement | null>(null);
  const [correctedQty, setCorrectedQty] = useState(1);
  const [correctionReason, setCorrectionReason] = useState("");

  const qtyMap = useMemo(() => new Map(stock.map((s) => [`${s.gold_type_id}|${s.brand ?? ""}`, s.qty])), [stock]);
  const goldTypeMap = useMemo(() => new Map(goldTypes.map((g) => [g.id, g])), [goldTypes]);
  const goldTypeOrder = useMemo(
    () => new Map(sortGoldTypes(goldTypes).map((goldType, index) => [goldType.id, index])),
    [goldTypes],
  );

  const inOptions = useMemo(() => sortGoldTypes(goldTypes), [goldTypes]);
  const availableBrands = useMemo(
    () => Array.from(new Set(stock.map((item) => item.brand ?? "Antam"))).sort((a, b) => a.localeCompare(b, "id")),
    [stock],
  );
  const outOptions = useMemo(
    () => sortGoldTypes(goldTypes.filter((g) => g.category === "lm" && (qtyMap.get(`${g.id}|`) ?? qtyMap.get(`${g.id}|Antam`) ?? 0) > 0)),
    [goldTypes, qtyMap],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [s, m] = await Promise.all([
          fetch(`/api/admin/stock?range=${range}`).then(r => r.json()),
          canManage
            ? fetch("/api/admin/stock/movements").then(r => r.json())
            : Promise.resolve({ movements: [] }),
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
  }, [canManage, reloadKey, range]);

  async function handleAdjust() {
    if (!adjProduct || adjQty <= 0) { setError("Pilih produk dan qty"); return; }
    setSaving(true); setError("");
    const brand = adjBrand ?? "Antam";
    const res = await fetch("/api/admin/stock/adjust", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goldTypeId: adjProduct, type: adjType, qty: adjQty, notes: adjNotes, brand }) });
    const data = await res.json();
    if (data.success) { setShowModal(false); setAdjProduct(""); setAdjQty(1); setAdjNotes(""); setAdjBrand("Antam"); setReloadKey(k => k + 1); } else { setError(data.error ?? "Gagal"); }
    setSaving(false);
  }

  async function handleSaveMinQty() {
    if (!minProduct) return;
    setSaving(true); setError("");
    const res = await fetch("/api/admin/stock/min-qty", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goldTypeId: minProduct.gold_type_id, minQty, brand: minProduct.brand ?? "Antam" }) });
    const data = await res.json();
    if (data.success) {
      setStock(prev => prev.map(s => s.gold_type_id === minProduct.gold_type_id && s.brand === minProduct.brand ? { ...s, min_qty: minQty } : s));
      setShowMinModal(false);
    } else {
      setError(data.error ?? "Gagal menyimpan");
    }
    setSaving(false);
  }

  async function handleCorrection() {
    if (!correctionMovement || correctedQty <= 0 || !correctionReason.trim()) {
      setError("Jumlah yang benar dan alasan koreksi wajib diisi");
      return;
    }
    setSaving(true); setError("");
    const res = await fetch("/api/admin/stock/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movementId: correctionMovement.id, correctedQty, reason: correctionReason }),
    });
    const data = await res.json();
    if (data.success) {
      setCorrectionMovement(null); setCorrectionReason(""); setReloadKey(key => key + 1);
    } else {
      setError(data.error ?? "Gagal mengoreksi stok");
    }
    setSaving(false);
  }

  function openCorrection(movement: Movement) {
    setCorrectionMovement(movement);
    setCorrectedQty(movement.qty);
    setCorrectionReason("");
    setError("");
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
    let result = stock;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => (s.gold_types?.name ?? s.gold_type_id).toLowerCase().includes(q));
    }
    if (brandFilter !== "all") {
      result = result.filter(s => (s.brand ?? "Antam") === brandFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter(s => goldTypeMap.get(s.gold_type_id)?.category === categoryFilter);
    }
    return [...result].sort((a, b) => {
      const productOrder = (goldTypeOrder.get(a.gold_type_id) ?? Number.MAX_SAFE_INTEGER)
        - (goldTypeOrder.get(b.gold_type_id) ?? Number.MAX_SAFE_INTEGER);
      if (productOrder !== 0) return productOrder;

      const brandA = a.brand ?? "Antam";
      const brandB = b.brand ?? "Antam";
      const brandRankA = BRAND_OPTIONS.indexOf(brandA);
      const brandRankB = BRAND_OPTIONS.indexOf(brandB);
      const brandOrder = (brandRankA === -1 ? Number.MAX_SAFE_INTEGER : brandRankA)
        - (brandRankB === -1 ? Number.MAX_SAFE_INTEGER : brandRankB);
      return brandOrder !== 0 ? brandOrder : brandA.localeCompare(brandB, "id");
    });
  }, [stock, search, brandFilter, categoryFilter, goldTypeMap, goldTypeOrder]);

  const selectedAdjustmentProduct = goldTypeMap.get(adjProduct);
  const currentAdjustmentStock = qtyMap.get(`${adjProduct}|${adjBrand}`) ?? 0;
  const adjustedStock = adjType === "in"
    ? currentAdjustmentStock + adjQty
    : currentAdjustmentStock - adjQty;
  const correctionCurrentStock = correctionMovement
    ? qtyMap.get(`${correctionMovement.gold_type_id}|${correctionMovement.brand ?? "Antam"}`) ?? 0
    : 0;
  const correctionFinalStock = correctionMovement
    ? correctionCurrentStock + (correctedQty - correctionMovement.qty) * (correctionMovement.type === "in" ? 1 : -1)
    : 0;

  const filteredMovements = useMemo(() => {
    const byType = moveFilter === "all" ? movements : movements.filter(m => m.type === moveFilter);
    if (!search) return byType;
    const q = search.toLowerCase();
    return byType.filter(m => (m.gold_types?.name ?? m.gold_type_id).toLowerCase().includes(q) || (m.notes ?? "").toLowerCase().includes(q));
  }, [movements, moveFilter, search]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="font-serif text-2xl font-semibold text-text">Stok</h1><p className="mt-1 text-sm text-text-muted">Inventori emas — LM jual dan buyback</p></div>
        {canManage && activeTab === "stock" ? (
          <button onClick={() => { setAdjType("in"); setAdjProduct(inOptions[0]?.id ?? ""); setAdjQty(1); setAdjNotes(""); setError(""); setShowModal(true); }} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2">Sesuaikan stok</button>
        ) : !canManage ? <span className="rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs font-semibold text-text-muted">Akses baca saja</span> : null}
      </div>

      <div className="mb-5 border-b border-border/50">
        <div className="flex gap-6" role="tablist" aria-label="Data stok">
          <button role="tab" aria-selected={activeTab === "stock"} onClick={() => setActiveTab("stock")} className={`relative pb-3 text-sm font-semibold transition-colors ${activeTab === "stock" ? "text-gold-dark" : "text-text-muted hover:text-text"}`}>
            Stok <span className="ml-1 text-xs font-normal text-text-light">{stock.length}</span>
            {activeTab === "stock" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold" />}
          </button>
          {canManage && <button role="tab" aria-selected={activeTab === "movements"} onClick={() => setActiveTab("movements")} className={`relative pb-3 text-sm font-semibold transition-colors ${activeTab === "movements" ? "text-gold-dark" : "text-text-muted hover:text-text"}`}>
            Riwayat pergerakan <span className="ml-1 text-xs font-normal text-text-light">{movements.length}</span>
            {activeTab === "movements" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold" />}
          </button>}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-border/50 bg-surface/40 p-4">
        <div className="min-w-64 flex-1">
          <label htmlFor="stock-search" className="mb-1.5 block text-xs font-medium text-text-muted">Pencarian</label>
          <div className="relative"><svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg><input id="stock-search" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk atau catatan" className="w-full rounded-lg border border-border/60 bg-white py-2.5 pl-10 pr-4 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></div>
        </div>

        {activeTab === "stock" && (
          <>
            <div className="min-w-44">
              <label htmlFor="stock-range" className="mb-1.5 block text-xs font-medium text-text-muted">Periode penjualan</label>
              <select id="stock-range" value={range} onChange={(e) => setRange(e.target.value as "all" | "today" | "week" | "month")} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30">
                <option value="all">Semua waktu</option><option value="today">Hari ini</option><option value="week">7 hari terakhir</option><option value="month">30 hari terakhir</option>
              </select>
            </div>
            <div className="min-w-44">
              <label htmlFor="stock-brand" className="mb-1.5 block text-xs font-medium text-text-muted">Merek</label>
              <select id="stock-brand" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30">
                <option value="all">Semua merek</option>{availableBrands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
            {(brandFilter !== "all" || range !== "all" || categoryFilter !== "all") && <button onClick={() => { setBrandFilter("all"); setRange("all"); setCategoryFilter("all"); }} className="mb-0.5 px-2 py-2 text-sm font-medium text-text-muted underline underline-offset-4 hover:text-gold-dark">Reset filter</button>}
          </>
        )}
        {activeTab === "movements" && <div className="flex gap-1 rounded-lg border border-border/60 bg-white p-1">{[{ key: "all", label: "Semua" }, { key: "in", label: "Masuk" }, { key: "out", label: "Keluar" }].map(f => <button key={f.key} onClick={() => setMoveFilter(f.key as "all" | "in" | "out")} className={`rounded-md px-3 py-2 text-sm font-medium ${moveFilter === f.key ? "bg-gold/10 text-gold-dark" : "text-text-muted hover:text-text"}`}>{f.label}</button>)}</div>}
      </div>

      {activeTab === "stock" && (
        <div>
          <div className="mb-3 flex gap-1 overflow-x-auto border-b border-border/40" role="tablist" aria-label="Kategori stok">
            {[{ key: "all", label: "Semua" }, ...CATEGORY_ORDER.map((key) => ({ key, label: CATEGORY_LABELS[key] }))].map((category) => <button key={category.key} role="tab" aria-selected={categoryFilter === category.key} onClick={() => setCategoryFilter(category.key)} className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${categoryFilter === category.key ? "border-gold text-gold-dark" : "border-transparent text-text-muted hover:text-text"}`}>{category.label}</button>)}
          </div>
          <p className="mb-3 text-xs text-text-muted">{filteredStock.length} produk{brandFilter !== "all" ? ` · ${brandFilter}` : ""}{range !== "all" ? ` · ${range === "today" ? "Hari ini" : range === "week" ? "7 hari" : "30 hari"}` : ""}</p>
          <div className="rounded-xl border border-border/60 bg-white">
            <table className="w-full table-fixed">
              <thead><tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><th className="w-[34%] px-4 py-4 md:px-5">Produk</th><th className="hidden w-[13%] px-3 py-4 lg:table-cell">Berat/unit</th><th className="hidden w-[22%] px-3 py-4 md:table-cell">Penjualan</th><th className="w-[10%] px-2 py-4 text-center">Stok</th><th className="w-[9%] px-2 py-4 text-center">Min</th><th className="w-[18%] px-2 py-4 text-center md:w-[12%]">Status</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {filteredStock.map(s => (
                  <tr key={`${s.gold_type_id}|${s.brand ?? ""}`} className="hover:bg-surface/30">
                    <td className="px-4 py-3.5 md:px-5"><p className="truncate text-sm font-semibold text-text">{s.gold_types?.name ?? s.gold_type_id}</p><p className="mt-0.5 truncate text-[11px] text-text-muted">{CATEGORY_LABELS[goldTypeMap.get(s.gold_type_id)?.category ?? ""] ?? "-"} · {s.brand ?? "Antam"}</p></td>
                    <td className="hidden px-3 py-3.5 text-sm text-text-muted lg:table-cell">{s.gold_types?.weight ? `${s.gold_types.weight} g` : "-"}</td>
                    <td className="hidden px-3 py-3.5 md:table-cell"><p className="text-sm font-medium tabular-nums text-text">{s.total_weight_sold ? `${s.total_weight_sold.toLocaleString("id-ID", { maximumFractionDigits: 3 })} g` : "-"}</p>{canManage && <p className="mt-0.5 truncate text-xs tabular-nums text-emerald-600">{s.total_revenue ? `Rp ${s.total_revenue.toLocaleString("id-ID")}` : "Belum ada penjualan"}</p>}</td>
                    <td className="px-2 py-3.5 text-center"><span className={`text-sm font-bold tabular-nums ${s.qty <= s.min_qty ? "text-red-500" : "text-text"}`}>{s.qty}</span></td>
                    <td className="px-2 py-3.5 text-center">
                      {canManage ? <button onClick={() => openMinModal(s)} className="text-sm text-text-muted underline underline-offset-2 hover:text-gold-dark">{s.min_qty}</button> : <span className="text-sm text-text-muted">{s.min_qty}</span>}
                    </td>
                    <td className="px-2 py-3.5 text-center">
                      {s.qty === 0 ? <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">Habis</span>
                      : s.qty <= s.min_qty ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Menipis</span>
                      : <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Tersedia</span>}
                    </td>
                  </tr>
                ))}
                {filteredStock.length===0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-text-muted">Tidak ada produk yang sesuai dengan filter.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

{canManage && activeTab === "movements" && (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-white">
            <table className="w-full min-w-[1080px]">
              <thead><tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><th className="px-4 py-3">Waktu</th><th className="px-4 py-3">Produk</th><th className="px-4 py-3">Sumber</th><th className="px-4 py-3 text-center">Tipe</th><th className="px-4 py-3 text-center">Qty</th><th className="px-4 py-3">Petugas</th><th className="px-4 py-3">Catatan</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
              <tbody className="divide-y divide-border/30">
                {filteredMovements.map(m => (
                  <tr key={m.id} className={m.reversed_at ? "bg-surface/30 text-text-muted" : ""}><td className="px-4 py-3 text-xs text-text-muted">{new Date(m.created_at).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</td><td className="px-4 py-3 text-sm"><span className="font-medium text-text">{m.gold_types?.name ?? m.gold_type_id}</span><br /><span className="text-[10px] text-text-muted">{m.brand ?? "Antam"} · {CATEGORY_LABELS[goldTypeMap.get(m.gold_type_id)?.category ?? ""] ?? ""}</span></td><td className="px-4 py-3 text-xs text-text-muted">{m.order_id ? "Order" : m.reversal_of ? "Pembalik" : m.correction_of ? "Koreksi" : "Manual"}</td><td className="px-4 py-3 text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.type==="in"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>{m.type==="in"?"Masuk":"Keluar"}</span></td><td className="px-4 py-3 text-center text-sm font-semibold tabular-nums">{m.qty}</td><td className="px-4 py-3 text-xs text-text-muted">{m.actor_email?.split("@")[0] ?? (m.order_id ? "Dari order" : "Data lama")}</td><td className="max-w-64 px-4 py-3 text-xs text-text-muted">{m.notes??"-"}</td><td className="px-4 py-3">{m.reversed_at ? <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-text-muted">Dikoreksi</span> : m.reversal_of ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Pembalik</span> : <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Aktif</span>}</td><td className="px-4 py-3 text-right">{!m.order_id && !m.reversal_of && !m.reversed_at ? <button type="button" onClick={() => openCorrection(m)} className="rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold-dark hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40">Koreksi</button> : <span className="text-xs text-text-light">—</span>}</td></tr>
                ))}
                {filteredMovements.length===0 && <tr><td colSpan={9} className="px-6 py-12 text-center text-sm text-text-muted">Belum ada pergerakan stok.</td></tr>}
              </tbody>
            </table>
          </div>
       )}

      {/* Adjustment Modal */}
      {canManage && showModal && (
        <StockModalShell eyebrow="Inventori" title="Sesuaikan stok" description="Catat penambahan atau pengurangan inventori dengan histori yang dapat diaudit." onClose={() => setShowModal(false)} footer={<><p className="mr-auto hidden text-xs text-text-muted sm:block">Perubahan akan tercatat di riwayat.</p><button onClick={() => setShowModal(false)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted hover:bg-white">Batal</button><button onClick={handleAdjust} disabled={saving || adjustedStock < 0} className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${adjType === "in" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}>{saving ? "Menyimpan..." : adjType === "in" ? "Tambahkan stok" : "Kurangi stok"}</button></>}>
            <div className="px-5 py-5 sm:px-6">
              <div className="mb-5 grid grid-cols-2 rounded-lg border border-border/60 bg-surface p-1" role="tablist" aria-label="Jenis penyesuaian stok">
                <button onClick={() => switchType("in")} className={`rounded-md px-4 py-2.5 text-sm font-semibold ${adjType === "in" ? "bg-white text-emerald-700 shadow-sm" : "text-text-muted hover:text-text"}`}>Stok masuk (+)</button>
                <button onClick={() => switchType("out")} className={`rounded-md px-4 py-2.5 text-sm font-semibold ${adjType === "out" ? "bg-white text-red-600 shadow-sm" : "text-text-muted hover:text-text"}`}>Stok keluar (−)</button>
              </div>
              {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
              <div className="grid gap-4 lg:grid-cols-12">
                <section className="rounded-xl border border-border/50 bg-white p-4 lg:col-span-7"><p className="mb-4 text-[10px] font-semibold uppercase tracking-[.14em] text-text-muted">Detail penyesuaian</p><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label htmlFor="stock-product" className="mb-1.5 block text-xs font-medium text-text-muted">Produk</label><select id="stock-product" value={adjProduct} onChange={e => setAdjProduct(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30">{adjType === "in" ? CATEGORY_ORDER.map(cat => { const items = inOptions.filter(g => g.category === cat); if (items.length === 0) return null; return (<optgroup key={cat} label={CATEGORY_LABELS[cat]}>{items.map(g => <option key={g.id} value={g.id}>{g.name} ({qtyMap.get(`${g.id}|`) ?? qtyMap.get(`${g.id}|Antam`) ?? 0})</option>)}</optgroup>); }) : outOptions.map(g => <option key={g.id} value={g.id}>{g.name} ({qtyMap.get(`${g.id}|`) ?? qtyMap.get(`${g.id}|Antam`) ?? 0})</option>)}</select></div><div><label htmlFor="stock-brand-adjust" className="mb-1.5 block text-xs font-medium text-text-muted">Merek</label><select id="stock-brand-adjust" value={adjBrand} onChange={e => setAdjBrand(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30">{BRAND_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}</select></div><div><label htmlFor="stock-adjust-qty" className="mb-1.5 block text-xs font-medium text-text-muted">Jumlah unit</label><input id="stock-adjust-qty" type="number" min={1} step={1} value={adjQty} onChange={e => setAdjQty(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></div><div className="sm:col-span-2"><label htmlFor="stock-adjust-note" className="mb-1.5 block text-xs font-medium text-text-muted">Catatan <span className="font-normal text-text-light">(opsional)</span></label><textarea id="stock-adjust-note" rows={3} value={adjNotes} onChange={e => setAdjNotes(e.target.value)} className="w-full resize-none rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" placeholder="Contoh: stok opname atau penerimaan barang" /><div className="mt-2 flex flex-wrap gap-1.5">{["Stok awal", "Stok opname", "Penerimaan barang", "Barang rusak"].map(note => <button key={note} type="button" onClick={() => setAdjNotes(note)} className="rounded-full border border-border/50 bg-surface/50 px-2.5 py-1 text-[11px] text-text-muted hover:border-gold/40 hover:text-gold-dark">{note}</button>)}</div></div></div></section>
                <aside className={`relative overflow-hidden rounded-xl border p-5 lg:col-span-5 ${adjType === "in" ? "border-emerald-200/70 bg-emerald-50/45" : "border-red-200/70 bg-red-50/40"}`}><span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${adjType === "in" ? "bg-emerald-500" : "bg-red-500"}`} /><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-text-muted">Ringkasan perubahan</p><h3 className="mt-2 font-serif text-lg font-semibold text-text">{selectedAdjustmentProduct?.name ?? "Pilih produk"}</h3><p className="mt-0.5 text-xs text-text-muted">{adjBrand} · {adjType === "in" ? "Stok masuk" : "Stok keluar"}</p><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><span className="text-text-muted">Stok awal</span><strong className="tabular-nums text-text">{currentAdjustmentStock}</strong></div><div className="flex justify-between"><span className="text-text-muted">Perubahan</span><strong className={`tabular-nums ${adjType === "in" ? "text-emerald-700" : "text-red-700"}`}>{adjType === "in" ? `+${adjQty}` : `−${adjQty}`}</strong></div><div className="border-t border-current/10 pt-3"><div className="flex items-end justify-between"><span className="font-medium text-text">Stok akhir</span><strong className={`font-serif text-3xl tabular-nums ${adjustedStock < 0 ? "text-red-600" : "text-gold-dark"}`}>{adjustedStock}</strong></div></div></div>{adjustedStock < 0 && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-white/70 px-3 py-2 text-xs text-red-700">Stok akhir tidak boleh negatif.</p>}<p className="mt-5 text-[11px] leading-relaxed text-text-muted">Movement akan mencatat produk, merek, jumlah, waktu, dan akun admin.</p></aside>
              </div>
            </div>
        </StockModalShell>
      )}

      {/* Stock Correction Modal */}
      {canManage && correctionMovement && (
        <StockModalShell eyebrow="Koreksi audit" title="Koreksi pergerakan stok" description="Histori asli tetap dipertahankan; sistem membuat movement pembalik dan pengganti." onClose={() => setCorrectionMovement(null)} footer={<><button type="button" onClick={() => setCorrectionMovement(null)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted hover:bg-white">Batal</button><button type="button" onClick={handleCorrection} disabled={saving || correctedQty <= 0 || correctedQty === correctionMovement.qty || correctionFinalStock < 0 || !correctionReason.trim()} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan koreksi"}</button></>}>
            <div className="space-y-4 px-5 py-5 sm:px-6">
              {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-border/50 bg-surface/55 p-5"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-text-muted">Movement asli</p><h3 className="mt-3 font-serif text-lg font-semibold text-text">{correctionMovement.gold_types?.name ?? correctionMovement.gold_type_id}</h3><p className="mt-0.5 text-xs text-text-muted">{correctionMovement.brand ?? "Antam"}</p><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-text-muted">Jenis</dt><dd className="font-medium text-text">{correctionMovement.type === "in" ? "Stok masuk" : "Stok keluar"}</dd></div><div className="flex justify-between gap-4"><dt className="text-text-muted">Jumlah awal</dt><dd className="font-serif text-lg font-semibold tabular-nums text-text">{correctionMovement.qty} unit</dd></div><div className="flex justify-between gap-4"><dt className="text-text-muted">Petugas</dt><dd className="text-right text-text">{correctionMovement.actor_email?.split("@")[0] ?? "Data lama"}</dd></div><div className="border-t border-border/40 pt-3"><dt className="text-xs text-text-muted">Catatan awal</dt><dd className="mt-1 text-xs leading-relaxed text-text">{correctionMovement.notes ?? "Tidak ada catatan"}</dd></div></dl></section>
                <section className="rounded-xl border border-gold/25 bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-gold-dark">Data yang benar</p><div className="mt-4"><label htmlFor="corrected-stock-qty" className="mb-1.5 block text-xs font-medium text-text-muted">Jumlah yang benar</label><input id="corrected-stock-qty" type="number" min={1} step={1} value={correctedQty} onChange={event => setCorrectedQty(Number(event.target.value))} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></div><div className="mt-4"><label htmlFor="stock-correction-reason" className="mb-1.5 block text-xs font-medium text-text-muted">Alasan koreksi</label><textarea id="stock-correction-reason" rows={4} required value={correctionReason} onChange={event => setCorrectionReason(event.target.value)} placeholder="Contoh: jumlah fisik seharusnya 6, bukan 10" className="w-full resize-none rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></div></section>
              </div>
              <section className={`grid items-center gap-3 rounded-xl border px-5 py-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] ${correctionFinalStock < 0 ? "border-red-200 bg-red-50" : "border-border/50 bg-surface/45"}`}><div><p className="text-[10px] uppercase tracking-wide text-text-muted">Stok saat ini</p><p className="mt-1 font-serif text-xl font-semibold tabular-nums text-text">{correctionCurrentStock}</p></div><span className="hidden text-text-light sm:block">→</span><div><p className="text-[10px] uppercase tracking-wide text-text-muted">Selisih koreksi</p><p className={`mt-1 font-serif text-xl font-semibold tabular-nums ${correctionFinalStock - correctionCurrentStock < 0 ? "text-red-700" : "text-emerald-700"}`}>{correctionFinalStock - correctionCurrentStock >= 0 ? "+" : ""}{correctionFinalStock - correctionCurrentStock}</p></div><span className="hidden text-text-light sm:block">→</span><div><p className="text-[10px] uppercase tracking-wide text-text-muted">Stok akhir</p><p className={`mt-1 font-serif text-xl font-semibold tabular-nums ${correctionFinalStock < 0 ? "text-red-700" : "text-gold-dark"}`}>{correctionFinalStock}</p></div></section>
            </div>
        </StockModalShell>
      )}

      {/* Min Qty Modal */}
      {canManage && showMinModal && minProduct && (
        <StockModalShell size="compact" eyebrow="Batas inventori" title="Edit minimum stok" description="Atur kapan produk ditandai menipis dan membutuhkan perhatian." onClose={() => setShowMinModal(false)} footer={<><button onClick={() => setShowMinModal(false)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted hover:bg-white">Batal</button><button onClick={handleSaveMinQty} disabled={saving} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] hover:bg-gold-light disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan minimum"}</button></>}>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            {error && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}
            <section className="rounded-xl border border-border/50 bg-surface/50 p-4"><p className="font-serif text-lg font-semibold text-text">{minProduct.gold_types?.name ?? minProduct.gold_type_id}</p><p className="mt-0.5 text-xs text-text-muted">{minProduct.brand ?? "Antam"}</p><div className="mt-4 grid grid-cols-2 gap-3"><div><p className="text-[10px] uppercase tracking-wide text-text-muted">Stok aktual</p><p className="mt-1 font-serif text-xl font-semibold tabular-nums text-text">{minProduct.qty}</p></div><div><p className="text-[10px] uppercase tracking-wide text-text-muted">Minimum lama</p><p className="mt-1 font-serif text-xl font-semibold tabular-nums text-text">{minProduct.min_qty}</p></div></div></section>
            <div><label htmlFor="minimum-stock-input" className="mb-1.5 block text-xs font-medium text-text-muted">Minimum stok baru</label><input id="minimum-stock-input" type="number" min={0} step={1} value={minQty} onChange={e => setMinQty(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></div>
            <div className={`flex items-center justify-between rounded-lg border px-4 py-3 ${minProduct.qty <= minQty ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}><div><p className="text-xs font-medium text-text">Status setelah disimpan</p><p className="mt-0.5 text-[11px] text-text-muted">Berdasarkan stok aktual {minProduct.qty} unit</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${minProduct.qty <= minQty ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{minProduct.qty <= minQty ? "Menipis" : "Tersedia"}</span></div>
          </div>
        </StockModalShell>
      )}
    </div>
  );
}
