"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { GoldTypeRow, FormattedPrice } from "@/lib/gold-api";
import { formatRupiah } from "@/lib/gold-api";
import { createClient } from "@/lib/supabase/client";

type Order = { id: string; order_number: string; type: string; customer_name: string; customer_phone: string; total: number; status: string; created_at: string };
type OrderDetail = Order & { order_items: { id?: string; item_name: string; weight: number; karat: number | null; qty: number; price_per_gram: number; price_total: number; gold_type_id?: string | null }[] };
type CartItem = { goldTypeId: string | null; itemName: string; weight: number; karat: number | null; qty: number; pricePerGram: number; priceTotal: number };

const LM_PRODUCTS = ["antam-0.5", "antam-1", "antam-2", "antam-3", "antam-5", "antam-10", "antam-25", "antam-50", "antam-100"];
const PER_PAGE = 20;

export default function OrdersClient({ prices, goldTypes }: { prices: FormattedPrice[]; goldTypes: GoldTypeRow[] }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "sell" | "buyback">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "cancelled">("all");
  const [page, setPage] = useState(1);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewOrder, setViewOrder] = useState<OrderDetail | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Order | null>(null);

  // Form
  const [type, setType] = useState<"sell" | "buyback">("sell");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sellProduct, setSellProduct] = useState("antam-1");
  const [sellQty, setSellQty] = useState(1);
  const [bbCategory, setBbCategory] = useState("bb-lm");
  const [bbGoldType, setBbGoldType] = useState("bb-certi-1-2");
  const [bbWeight, setBbWeight] = useState("");
  const [bbKarat, setBbKarat] = useState("24");
  const [bbItemName, setBbItemName] = useState("");

  const priceMap = new Map(prices.map(p => [p.goldTypeId, p]));
  const bbGoldTypes = goldTypes.filter(g => g.category === bbCategory || (bbCategory === "bb-perhiasan" && g.category === "bb-perhiasan") || (bbCategory === "bb-logam" && g.category === "bb-logam") || (bbCategory === "bb-lm" && g.category === "bb-lm"));

  function fetchOrders() { fetch("/api/admin/orders").then(r => r.json()).then(d => { setOrders(d.orders ?? []); setLoading(false); }); }
  useEffect(() => { fetchOrders(); }, []);

  function resetForm() {
    setType("sell"); setCustomerName(""); setCustomerPhone(""); setItems([]); setEditingId(null);
    setError(""); setSellProduct("antam-1"); setSellQty(1);
    setBbCategory("bb-lm"); setBbGoldType("bb-certi-1-2"); setBbWeight(""); setBbKarat("24"); setBbItemName("");
  }

  async function openEdit(o: Order) {
    const res = await fetch(`/api/admin/orders/${o.id}`);
    const data = await res.json();
    const order: OrderDetail = data.order;
    if (!order) return;
    setEditingId(order.id);
    setType(order.type as any);
    setCustomerName(order.customer_name);
    setCustomerPhone(order.customer_phone);
    setItems(order.order_items.map(it => ({ goldTypeId: it.gold_type_id ?? null, itemName: it.item_name, weight: it.weight, karat: it.karat, qty: it.qty, pricePerGram: it.price_per_gram, priceTotal: it.price_total })));
    setShowModal(true);
  }

  function openView(o: Order) {
    fetch(`/api/admin/orders/${o.id}`).then(r => r.json()).then(d => setViewOrder(d.order ?? null));
  }

  function addSellItem() {
    const p = priceMap.get(sellProduct); if (!p || p.buyPrice <= 0) return;
    const gt = goldTypes.find(g => g.id === sellProduct);
    setItems([...items, { goldTypeId: sellProduct, itemName: gt?.name ?? sellProduct, weight: sellQty * (gt?.weight ?? 1), karat: 24, qty: sellQty, pricePerGram: p.buyPrice, priceTotal: p.buyPrice * sellQty }]);
  }

  function addBuybackItem() {
    const w = parseFloat(bbWeight) || 0; if (w <= 0) return;
    const p = priceMap.get(bbGoldType); const ppg = p?.sellPrice ?? 0;
    const gt = bbGoldTypes.find(g => g.id === bbGoldType);
    const name = bbItemName || gt?.name || bbGoldType;
    const karatVal = bbCategory === "bb-perhiasan" ? parseInt(bbKarat) || null : bbCategory === "bb-lm" ? 24 : null;
    setItems([...items, { goldTypeId: bbGoldType, itemName: name, weight: w, karat: karatVal, qty: 1, pricePerGram: ppg, priceTotal: Math.round(ppg * w) }]);
  }

  function removeItem(idx: number) { setItems(items.filter((_, i) => i !== idx)); }
  const total = items.reduce((s, it) => s + it.priceTotal, 0);

  async function handleSubmit() {
    if (!customerName || !customerPhone) { setError("Nama dan No. HP wajib diisi"); return; }
    if (items.length === 0) { setError("Minimal 1 item"); return; }
    setSaving(true); setError("");

    if (editingId) {
      const res = await fetch(`/api/admin/orders/${editingId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, customerPhone, type, items }),
      });
      const data = await res.json();
      if (data.success) { setShowModal(false); resetForm(); fetchOrders(); } else { setError(data.error ?? "Gagal"); setSaving(false); }
    } else {
      const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch("/api/admin/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, customerName, customerPhone, items, createdBy: user?.id }) });
      const data = await res.json();
      if (data.success) { setShowModal(false); resetForm(); fetchOrders(); } else { setError(data.error ?? "Gagal"); setSaving(false); }
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    await fetch(`/api/admin/orders/${deleteConfirm.id}`, { method: "DELETE" });
    setOrders(prev => prev.map(o => o.id === deleteConfirm.id ? { ...o, status: "cancelled" } : o));
    setDeleteConfirm(null);
  }

  function exportCSV() {
    const header = "Order Number,Tanggal,Tipe,Customer,Phone,Total,Status";
    const rows = filtered.map(o => `${o.order_number},${new Date(o.created_at).toLocaleDateString("id-ID")},${o.type==="sell"?"Jual":"Buyback"},${o.customer_name},${o.customer_phone},${o.total},${o.status==="completed"?"Selesai":"Batal"}`);
    const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    let list = orders;
    if (filterType !== "all") list = list.filter(o => o.type === filterType);
    if (filterStatus !== "all") list = list.filter(o => o.status === filterStatus);
    if (search) { const q = search.toLowerCase(); list = list.filter(o => o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_phone.includes(q)); }
    return list;
  }, [orders, search, filterType, filterStatus]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-serif text-2xl font-bold text-text">Orders</h1><p className="mt-1 text-sm text-text-muted">{filtered.length} transaksi</p></div>
        <div className="flex gap-2">
          <button onClick={exportCSV} disabled={filtered.length===0} className="rounded-xl border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-all hover:border-gold/30 hover:text-gold-dark disabled:opacity-40">Export CSV</button>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="gold-gradient-bg rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30">+ Buat Order</button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]"><svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg><input type="text" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Cari no. order atau customer..." className="w-full rounded-xl border border-border/60 bg-white pl-10 pr-4 py-2.5 text-sm text-text focus:border-gold focus:outline-none" /></div>
        <div className="flex gap-1 rounded-xl border border-border/60 bg-white p-1">{[{key:"all",label:"Semua"},{key:"sell",label:"Jual"},{key:"buyback",label:"Buyback"}].map(f=>(<button key={f.key} onClick={()=>{setFilterType(f.key as any);setPage(1);}} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filterType===f.key?"bg-gold/10 text-gold-dark":"text-text-muted hover:text-text"}`}>{f.label}</button>))}</div>
        <div className="flex gap-1 rounded-xl border border-border/60 bg-white p-1">{[{key:"all",label:"Semua"},{key:"completed",label:"Selesai"},{key:"cancelled",label:"Batal"}].map(f=>(<button key={f.key} onClick={()=>{setFilterStatus(f.key as any);setPage(1);}} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filterStatus===f.key?"bg-gold/10 text-gold-dark":"text-text-muted hover:text-text"}`}>{f.label}</button>))}</div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><th className="px-4 py-4 md:px-6">No. Order</th><th className="px-4 py-4 md:px-6">Customer</th><th className="hidden px-4 py-4 sm:table-cell md:px-6">Tipe</th><th className="hidden px-4 py-4 sm:table-cell md:px-6">Tanggal</th><th className="px-4 py-4 text-right md:px-6">Total</th><th className="px-4 py-4 text-center md:px-6">Status</th><th className="px-4 py-4 text-center md:px-6">Aksi</th></tr></thead>
          <tbody className="divide-y divide-border/30">
            {paged.map(o => (
              <tr key={o.id} className="hover:bg-surface/30">
                <td className="px-4 py-3.5 md:px-6"><span className="text-sm font-medium text-text">{o.order_number}</span></td>
                <td className="px-4 py-3.5 md:px-6"><p className="text-sm font-medium text-text">{o.customer_name}</p><p className="text-xs text-text-muted">{o.customer_phone}</p></td>
                <td className="hidden px-4 py-3.5 sm:table-cell md:px-6"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.type==='sell'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{o.type==='sell'?'Jual':'Buyback'}</span></td>
                <td className="hidden px-4 py-3.5 text-sm text-text-muted sm:table-cell md:px-6">{new Date(o.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</td>
                <td className="px-4 py-3.5 text-right text-sm font-semibold text-text md:px-6">{formatRupiah(o.total)}</td>
                <td className="px-4 py-3.5 text-center md:px-6"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.status==='completed'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-600'}`}>{o.status==='completed'?'Selesai':'Batal'}</span></td>
                <td className="px-4 py-3.5 text-center md:px-6">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openView(o)} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-gold-dark" title="Lihat"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
                    {o.status !== "cancelled" && (
                      <>
                        <button onClick={() => openEdit(o)} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-gold-dark" title="Edit"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                        <button onClick={() => setDeleteConfirm(o)} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500" title="Hapus"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-text-muted">{search||filterType!=="all"||filterStatus!=="all"?"Tidak ada order yang cocok.":"Belum ada order."}</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1} className="rounded-lg border border-border/60 px-3 py-1.5 text-sm text-text-muted hover:bg-surface disabled:opacity-40">Sebelumnya</button>
          <span className="text-sm text-text-muted">Hal {page} / {totalPages}</span>
          <button onClick={()=>setPage(Math.min(totalPages,page+1))} disabled={page===totalPages} className="rounded-lg border border-border/60 px-3 py-1.5 text-sm text-text-muted hover:bg-surface disabled:opacity-40">Berikutnya</button>
        </div>
      )}

      {/* View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-[8vh] pb-10">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setViewOrder(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-border/60 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
              <div><h3 className="font-serif text-lg font-semibold text-text">{viewOrder.order_number}</h3><p className="text-xs text-text-muted">{new Date(viewOrder.created_at).toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}</p></div>
              <div className="flex items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${viewOrder.type==="sell"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>{viewOrder.type==="sell"?"Jual":"Buyback"}</span><button onClick={()=>setViewOrder(null)} className="rounded-lg p-1 text-text-muted hover:bg-surface hover:text-text">&times;</button></div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/30 bg-surface p-3"><p className="text-[11px] uppercase tracking-wider text-text-muted">Customer</p><p className="mt-1 text-sm font-semibold text-text">{viewOrder.customer_name}</p><p className="text-xs text-text-muted">{viewOrder.customer_phone}</p></div>
                <div className="rounded-xl border border-border/30 bg-surface p-3"><p className="text-[11px] uppercase tracking-wider text-text-muted">Status</p><p className="mt-1 text-sm font-semibold text-text">{viewOrder.status==="completed"?"Selesai":"Batal"}</p></div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Item</p>
                <table className="w-full text-sm"><thead><tr className="border-b border-border/30 text-left text-xs text-text-muted"><th className="py-2">Item</th><th className="py-2 text-center">Berat</th><th className="py-2 text-center">Karat</th><th className="py-2 text-center">Qty</th><th className="py-2 text-right">Harga/g</th><th className="py-2 text-right">Total</th></tr></thead>
                  <tbody className="divide-y divide-border/20">{viewOrder.order_items.map(it=>(<tr key={it.id}><td className="py-2.5 font-medium text-text">{it.item_name}</td><td className="py-2.5 text-center text-text-muted">{it.weight}g</td><td className="py-2.5 text-center text-text-muted">{it.karat?`${it.karat}K`:"-"}</td><td className="py-2.5 text-center">{it.qty}</td><td className="py-2.5 text-right">{formatRupiah(it.price_per_gram)}</td><td className="py-2.5 text-right font-semibold">{formatRupiah(it.price_total)}</td></tr>))}</tbody>
                  <tfoot><tr className="border-t-2 border-border/40"><td colSpan={5} className="py-3 text-right text-sm font-bold text-text">Total</td><td className="py-3 text-right text-base font-bold text-gold-dark">{formatRupiah(viewOrder.total)}</td></tr></tfoot>
                </table>
              </div>
            </div>
            <div className="flex gap-3 border-t border-border/40 bg-surface/30 px-6 py-4 rounded-b-2xl">
              <button onClick={()=>window.print()} className="flex-1 rounded-xl border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white">Cetak</button>
              <button onClick={()=>setViewOrder(null)} className="gold-gradient-bg flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50"><svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>
            <h4 className="font-serif text-lg font-semibold text-text">Cancel Order?</h4>
            <p className="mt-1 text-sm text-text-muted">{deleteConfirm.order_number} — {deleteConfirm.customer_name}</p>
            <div className="mt-5 flex gap-3"><button onClick={()=>setDeleteConfirm(null)} className="flex-1 rounded-xl border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-surface">Batal</button><button onClick={handleDelete} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600">Ya, Cancel</button></div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-[5vh] pb-10">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>{setShowModal(false);resetForm();}} />
          <div className="relative w-full max-w-3xl rounded-2xl border border-border/60 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4"><h3 className="font-serif text-lg font-semibold text-text">{editingId?"Edit Order":"Buat Order Baru"}</h3><button onClick={()=>{setShowModal(false);resetForm();}} className="rounded-lg p-1 text-text-muted hover:bg-surface hover:text-text">&times;</button></div>
            <div className="p-6 space-y-6">
              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
              <div className="flex gap-3">
                <button onClick={()=>setType("sell")} className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${type==="sell"?"border-gold bg-gold/5 text-gold-dark":"border-border/60 text-text-muted hover:border-gold/30"}`}>Jual LM</button>
                <button onClick={()=>setType("buyback")} className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${type==="buyback"?"border-gold bg-gold/5 text-gold-dark":"border-border/60 text-text-muted hover:border-gold/30"}`}>Buyback</button>
              </div>
              <div className="rounded-xl border border-border/40 bg-surface p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Tambah Item</p>
                {type==="sell"?(
                  <div className="flex flex-wrap gap-3 items-end"><div className="flex-1 min-w-[180px]"><label className="mb-1 block text-xs text-text-muted">Produk</label><select value={sellProduct} onChange={e=>setSellProduct(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm">{LM_PRODUCTS.map(id=>{const gt=goldTypes.find(g=>g.id===id);const p=priceMap.get(id);return <option key={id} value={id}>{gt?.name??id} — {p?formatRupiah(p.buyPrice):"-"}/g</option>;})}</select></div><div className="w-24"><label className="mb-1 block text-xs text-text-muted">Qty</label><input type="number" min={1} value={sellQty} onChange={e=>setSellQty(parseInt(e.target.value)||1)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" /></div><button onClick={addSellItem} className="rounded-lg border border-gold/40 px-4 py-2.5 text-sm font-semibold text-gold-dark hover:bg-gold/5">+ Tambah</button></div>
                ):(
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3"><div className="w-40"><label className="mb-1 block text-xs text-text-muted">Kategori</label><select value={bbCategory} onChange={e=>{setBbCategory(e.target.value);const f=goldTypes.filter(g=>g.category===e.target.value)[0];if(f)setBbGoldType(f.id);}} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm"><option value="bb-lm">LM (Antam)</option><option value="bb-perhiasan">Perhiasan</option><option value="bb-logam">Logam Lain</option></select></div><div className="flex-1 min-w-[180px]"><label className="mb-1 block text-xs text-text-muted">Jenis</label><select value={bbGoldType} onChange={e=>setBbGoldType(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm">{bbGoldTypes.map(g=>{const p=priceMap.get(g.id);return <option key={g.id} value={g.id}>{g.name} {p?`— ${formatRupiah(p.sellPrice)}/g`:""}</option>;})}</select></div></div>
                    <div className="flex flex-wrap gap-3 items-end">{bbCategory==="bb-perhiasan"&&<div className="w-24"><label className="mb-1 block text-xs text-text-muted">Karat</label><select value={bbKarat} onChange={e=>setBbKarat(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm">{["24","23","22","21","20","19","18","17","16","15","14","13","12","11","10","9","8","7","6"].map(k=><option key={k} value={k}>{k}K</option>)}</select></div>}<div className="w-32"><label className="mb-1 block text-xs text-text-muted">Berat (g)</label><input type="number" step="0.01" min="0.01" value={bbWeight} onChange={e=>setBbWeight(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="0.00" /></div><div className="flex-1 min-w-[150px]"><label className="mb-1 block text-xs text-text-muted">Nama (opsional)</label><input type="text" value={bbItemName} onChange={e=>setBbItemName(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="Cincin, kalung, dll" /></div><button onClick={addBuybackItem} className="rounded-lg border border-gold/40 px-4 py-2.5 text-sm font-semibold text-gold-dark hover:bg-gold/5">+ Tambah</button></div>
                  </div>
                )}
              </div>
              {items.length>0&&(<div className="rounded-xl border border-border/40 bg-surface overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-border/30 text-left text-xs text-text-muted"><th className="px-4 py-2">Item</th><th className="px-4 py-2">Berat/Karat</th><th className="px-4 py-2">Qty</th><th className="px-4 py-2 text-right">Harga/g</th><th className="px-4 py-2 text-right">Total</th><th className="px-4 py-2"></th></tr></thead><tbody className="divide-y divide-border/20">{items.map((it,i)=>(<tr key={i}><td className="px-4 py-2.5 font-medium text-text">{it.itemName}</td><td className="px-4 py-2.5 text-text-muted">{it.weight}g{it.karat?` — ${it.karat}K`:""}</td><td className="px-4 py-2.5">{it.qty}</td><td className="px-4 py-2.5 text-right">{formatRupiah(it.pricePerGram)}</td><td className="px-4 py-2.5 text-right font-semibold">{formatRupiah(it.priceTotal)}</td><td className="px-4 py-2.5 text-center"><button onClick={()=>removeItem(i)} className="text-red-400 hover:text-red-600">&times;</button></td></tr>))}</tbody></table></div>)}
              <div className="rounded-xl border border-border/40 bg-surface p-4"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Data Customer</p><div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1 block text-xs text-text-muted">Nama <span className="text-red-400">*</span></label><input type="text" value={customerName} onChange={e=>setCustomerName(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="Nama lengkap" /></div><div><label className="mb-1 block text-xs text-text-muted">No. HP <span className="text-red-400">*</span></label><input type="tel" value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="0812-3456-7890" /></div></div></div>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 bg-surface/30 px-6 py-4 rounded-b-2xl"><div><p className="text-xs text-text-muted">Total</p><p className="text-xl font-bold text-gold-dark">{formatRupiah(total)}</p></div><div className="flex gap-3"><button onClick={()=>{setShowModal(false);resetForm();}} className="rounded-xl border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted hover:bg-white">Batal</button><button onClick={handleSubmit} disabled={saving||items.length===0} className="gold-gradient-bg rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-60">{saving?"Menyimpan...":editingId?"Update Order":"Simpan Order"}</button></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
