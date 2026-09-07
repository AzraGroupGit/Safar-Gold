"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { GoldTypeRow, FormattedPrice } from "@/lib/gold-api";
import { formatRupiah } from "@/lib/gold-api";
import { createClient } from "@/lib/supabase/client";
import OrderInvoice, { type InvoiceOrder, type InvoiceSettings } from "@/components/OrderInvoice";
import SignaturePad from "@/components/SignaturePad";
import { formatOrderAddress, getOrderItemDetails } from "@/lib/order-cart-presentation";

type Order = { id: string; order_number: string; type: string; customer_name: string; customer_phone: string; total: number; status: string; created_at: string; payment_method?: string | null; notes?: string | null; gp?: number | null; created_by?: string | null };
type OrderDetail = Order & { order_items: { id?: string; item_name: string; weight: number; karat: number | null; qty: number; price_per_gram: number; price_total: number; gold_type_id?: string | null; brand?: string | null }[]; source?: string | null; nik?: string | null; address?: string | null; instagram?: string | null; provinsi?: string | null; kabupaten?: string | null; kecamatan?: string | null; kelurahan?: string | null; province_id?: string | null; regency_id?: string | null; district_id?: string | null; village_id?: string | null };
type CustomerLookup = { name: string | null; source: string | null; nik: string | null; address: string | null; kelurahan: string | null; kecamatan: string | null; kabupaten: string | null; provinsi: string | null; instagram: string | null; province_id: string | null; regency_id: string | null; district_id: string | null; village_id: string | null; order_count: number };
type CartItem = { goldTypeId: string | null; itemName: string; weight: number; karat: number | null; qty: number; pricePerGram: number; priceTotal: number; brand?: string | null };

const LM_PRODUCTS = ["antam-0.5", "antam-1", "antam-2", "antam-3", "antam-5", "antam-10", "antam-25", "antam-50", "antam-100"];
const PER_PAGE = 20;
const SOURCE_OPTIONS = ["Instagram Bersponsor/Iklan", "Instagram KOL", "Tiktok Sponsor/Iklan", "Tiktok KOL", "Repeat Order", "Rekomendasi Teman", "Karyawan", "Baliho", "Google Maps", "CRM OPR", "CRM CS"];
const SELL_BRANDS = ["Antam Retro", "Antam", "UBS", "HRTA", "BSI", "G24", "Lainnya"];
const BUYBACK_CATEGORIES = ["Anting", "Kalung", "Cincin", "Liontin", "Gelang"];
type RegionOption = { id: string; name: string };

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^|[\s\-'\/()])([a-z])/g, (m) => m.toUpperCase());
}

export default function OrdersClient({ prices, goldTypes, settings }: { prices: FormattedPrice[]; goldTypes: GoldTypeRow[]; settings: InvoiceSettings }) {
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
  const [printOrder, setPrintOrder] = useState<OrderDetail | null>(null);
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
  const [sellType, setSellType] = useState<"emas" | "perak">("emas");
  const [sellBrand, setSellBrand] = useState("Antam");
  const [sellBrandCustom, setSellBrandCustom] = useState("");
  const [sellWeight, setSellWeight] = useState("");
  const [sellPricePerGram, setSellPricePerGram] = useState("");
  const [bbCategory, setBbCategory] = useState("bb-lm");
  const [bbGoldType, setBbGoldType] = useState("bb-certi-1-2");
  const [bbWeight, setBbWeight] = useState("");
  const [bbKarat, setBbKarat] = useState("24");
  const [bbItemName, setBbItemName] = useState("");
  const [bbCategoryName, setBbCategoryName] = useState("");
  const [bbCustomName, setBbCustomName] = useState("");

  // Customer baru
  const [source, setSource] = useState("");
  const [nik, setNik] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer">("cash");
  const [notes, setNotes] = useState("");
  const [gp, setGp] = useState("");
  const [role, setRole] = useState<string>("admin");
  const [printCreator, setPrintCreator] = useState<{ name: string | null; signature: string | null } | null>(null);

  // Region cascade
  const [provinces, setProvinces] = useState<RegionOption[]>([]);
  const [regencies, setRegencies] = useState<RegionOption[]>([]);
  const [districts, setDistricts] = useState<RegionOption[]>([]);
  const [villages, setVillages] = useState<RegionOption[]>([]);
  const [regionLoading, setRegionLoading] = useState({ regency: false, district: false, village: false });
  const [provinceId, setProvinceId] = useState("");
  const [regencyId, setRegencyId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [villageId, setVillageId] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kelurahan, setKelurahan] = useState("");

  // Customer lookup (repeat order autofill)
  const [lookup, setLookup] = useState<CustomerLookup | null>(null);
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const priceMap = new Map(prices.map(p => [p.goldTypeId, p]));
  const isAntamSell = sellType === "emas" && sellBrand === "Antam";
  const bbGoldTypes = goldTypes.filter(g => g.category === bbCategory || (bbCategory === "bb-perhiasan" && g.category === "bb-perhiasan") || (bbCategory === "bb-logam" && g.category === "bb-logam") || (bbCategory === "bb-lm" && g.category === "bb-lm"));

  function fetchOrders() { fetch("/api/admin/orders").then(r => r.json()).then(d => { setOrders(d.orders ?? []); setLoading(false); }); }
  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setRole(data.user.user_metadata?.role ?? "admin");
    });
  }, []);

  function resetForm() {
    setType("sell"); setCustomerName(""); setCustomerPhone(""); setItems([]); setEditingId(null);
    setError(""); setSellProduct("antam-1"); setSellQty(1);
    setSellType("emas"); setSellBrand("Antam"); setSellBrandCustom(""); setSellWeight(""); setSellPricePerGram("");
    setBbCategory("bb-lm"); setBbGoldType("bb-certi-1-2"); setBbWeight(""); setBbKarat("24"); setBbItemName(""); setBbCategoryName(""); setBbCustomName("");
    setSource(""); setNik(""); setAddress(""); setInstagram("");
    setPaymentMethod("cash"); setNotes("");
    setProvinsi(""); setProvinceId(""); setKabupaten(""); setRegencyId(""); setKecamatan(""); setDistrictId(""); setKelurahan(""); setVillageId("");
    setRegencies([]); setDistricts([]); setVillages([]);
    setLookup(null);
  }

  function handlePhoneChange(v: string) {
    setCustomerPhone(v);
    const digits = v.replace(/\D/g, "");
    if (lookupTimer.current) clearTimeout(lookupTimer.current);
    setLookup(null);
    if (digits.length >= 8) {
      lookupTimer.current = setTimeout(async () => {
        const res = await fetch(`/api/admin/customers/lookup?phone=${encodeURIComponent(digits)}`);
        const data = await res.json();
        setLookup(data.customer ?? null);
      }, 400);
    }
  }

  async function applyLookup() {
    if (!lookup) return;
    const c = lookup;
    setCustomerName(c.name ?? "");
    setSource(c.source ?? "");
    setNik(c.nik ?? "");
    setAddress(c.address ?? "");
    setKelurahan(titleCase(c.kelurahan ?? ""));
    setKecamatan(titleCase(c.kecamatan ?? ""));
    setKabupaten(titleCase(c.kabupaten ?? ""));
    setProvinsi(titleCase(c.provinsi ?? ""));
    setInstagram(c.instagram ?? "");
    setProvinceId(c.province_id ?? "");
    setRegencyId(c.regency_id ?? "");
    setDistrictId(c.district_id ?? "");
    setVillageId(c.village_id ?? "");
    setRegencies([]); setDistricts([]); setVillages([]);
    if (c.province_id) {
      const regs = await fetchRegion(`/api/regions?type=regency&parent=${c.province_id}`);
      setRegencies(regs);
    }
    if (c.regency_id) {
      const dists = await fetchRegion(`/api/regions?type=district&parent=${c.regency_id}`);
      setDistricts(dists);
    }
    if (c.district_id) {
      const vills = await fetchRegion(`/api/regions?type=village&parent=${c.district_id}`);
      setVillages(vills);
    }
  }

  const fetchRegion = useCallback(async (url: string) => {
    const res = await fetch(url); if (!res.ok) return [];
    const data = (await res.json()) as RegionOption[];
    return data.map((r) => ({ ...r, name: titleCase(r.name) }));
  }, []);

  const loadProvinces = useCallback(async () => {
    const data = await fetchRegion("/api/regions");
    setProvinces(data);
  }, [fetchRegion]);

  async function onProvinceChange(id: string, name: string) {
    setProvinsi(name); setProvinceId(id); setRegencyId(""); setDistrictId(""); setVillageId("");
    setKabupaten(""); setKecamatan(""); setKelurahan("");
    setRegencies([]); setDistricts([]); setVillages([]);
    if (!id) return;
    setRegionLoading(r => ({ ...r, regency: true }));
    const data = await fetchRegion(`/api/regions?type=regency&parent=${id}`);
    setRegencies(data); setRegionLoading(r => ({ ...r, regency: false }));
  }
  async function onRegencyChange(id: string, name: string) {
    setKabupaten(name); setRegencyId(id); setDistrictId(""); setVillageId("");
    setKecamatan(""); setKelurahan("");
    setDistricts([]); setVillages([]);
    if (!id) return;
    setRegionLoading(r => ({ ...r, district: true }));
    const data = await fetchRegion(`/api/regions?type=district&parent=${id}`);
    setDistricts(data); setRegionLoading(r => ({ ...r, district: false }));
  }
  async function onDistrictChange(id: string, name: string) {
    setKecamatan(name); setDistrictId(id); setVillageId("");
    setKelurahan("");
    setVillages([]);
    if (!id) return;
    setRegionLoading(r => ({ ...r, village: true }));
    const data = await fetchRegion(`/api/regions?type=village&parent=${id}`);
    setVillages(data); setRegionLoading(r => ({ ...r, village: false }));
  }

  async function openEdit(o: Order) {
    const res = await fetch(`/api/admin/orders/${o.id}`);
    const data = await res.json();
    const order: OrderDetail = data.order;
    if (!order) return;
    setEditingId(order.id);
    setType(order.type as "sell" | "buyback");
    setCustomerName(order.customer_name);
    setCustomerPhone(order.customer_phone);
    setItems(order.order_items.map(it => ({ goldTypeId: it.gold_type_id ?? null, itemName: it.item_name, weight: it.weight, karat: it.karat, qty: it.qty, pricePerGram: it.price_per_gram, priceTotal: it.price_total, brand: it.brand ?? null })));
    setSource(order.source ?? "");
    setNik(order.nik ?? "");
    setAddress(order.address ?? "");
    setInstagram(order.instagram ?? "");
    setPaymentMethod(order.payment_method === "transfer" ? "transfer" : "cash");
    setNotes(order.notes ?? "");
    setGp(order.gp != null ? String(order.gp) : "");
    setProvinsi(titleCase(order.provinsi ?? ""));
    setKabupaten(titleCase(order.kabupaten ?? ""));
    setKecamatan(titleCase(order.kecamatan ?? ""));
    setKelurahan(titleCase(order.kelurahan ?? ""));
    setProvinceId(order.province_id ?? "");
    setRegencyId(order.regency_id ?? "");
    setDistrictId(order.district_id ?? "");
    setVillageId(order.village_id ?? "");
    setRegencies([]); setDistricts([]); setVillages([]);
    if (provinces.length === 0) {
      const p = await fetchRegion("/api/regions");
      setProvinces(p);
    }
    if (order.province_id) {
      const regs = await fetchRegion(`/api/regions?type=regency&parent=${order.province_id}`);
      setRegencies(regs);
    }
    if (order.regency_id) {
      const dists = await fetchRegion(`/api/regions?type=district&parent=${order.regency_id}`);
      setDistricts(dists);
    }
    if (order.district_id) {
      const vills = await fetchRegion(`/api/regions?type=village&parent=${order.district_id}`);
      setVillages(vills);
    }
    setShowModal(true);
  }

  function openView(o: Order) {
    fetch(`/api/admin/orders/${o.id}`).then(r => r.json()).then(d => setViewOrder(d.order ?? null));
  }

  function openPrint(o: Order) {
    fetch(`/api/admin/orders/${o.id}`).then(r => r.json()).then(async d => {
      const order = d.order ?? null;
      setPrintOrder(order);
      setPrintCreator(null);
      if (order?.created_by) {
        const pr = await fetch(`/api/admin/user-profile?userId=${order.created_by}`).then(r => r.json());
        setPrintCreator(pr.profile ?? null);
      }
    });
  }

  function addSellItem() {
    const qty = sellQty || 1;
    const isEmas = sellType === "emas";
    const isAntam = isEmas && sellBrand === "Antam";

    if (isAntam) {
      const p = priceMap.get(sellProduct); if (!p || p.buyPrice <= 0) return;
      const gt = goldTypes.find(g => g.id === sellProduct);
      const weightPerPiece = gt?.weight ?? 1;
      const pricePerGram = p.isTotalPrice ? Math.round(p.buyPrice / weightPerPiece) : p.buyPrice;
      const priceTotal = p.isTotalPrice ? p.buyPrice * qty : Math.round(p.buyPrice * weightPerPiece * qty);
      setItems([...items, { goldTypeId: sellProduct, itemName: gt?.name ?? sellProduct, brand: "Antam", weight: qty * weightPerPiece, karat: 24, qty, pricePerGram, priceTotal }]);
      return;
    }

    const weightPerPiece = parseFloat(sellWeight);
    if (!weightPerPiece || weightPerPiece <= 0) { setError("Berat (g) wajib diisi"); return; }
    const pricePerGram = parseInt(sellPricePerGram) || 0;
    if (pricePerGram <= 0) { setError("Harga per gram wajib diisi"); return; }
    const brandName = sellBrand === "Lainnya" ? (sellBrandCustom.trim() || "Lainnya") : sellBrand;
    const jenisLabel = isEmas ? "Emas" : "Perak";
    const itemName = `${brandName} ${jenisLabel} ${weightPerPiece}g`;
    const priceTotal = Math.round(pricePerGram * weightPerPiece * qty);
    setItems([...items, { goldTypeId: null, itemName, brand: brandName, weight: qty * weightPerPiece, karat: isEmas ? 24 : null, qty, pricePerGram, priceTotal }]);
  }

  function addBuybackItem() {
    const w = parseFloat(bbWeight) || 0; if (w <= 0) return;
    const p = priceMap.get(bbGoldType); const ppg = p?.sellPrice ?? 0;
    const gt = bbGoldTypes.find(g => g.id === bbGoldType);
    let name = bbItemName || gt?.name || bbGoldType;
    const brand = "Antam"; // default for buyback
    if (bbCategory === "bb-perhiasan") {
      name = bbCategoryName === "Lainnya" ? bbCustomName : bbCategoryName;
      if (!name) name = gt?.name || bbGoldType;
    }
    if (bbCategory === "bb-lm") {
      // For buyback LM, brand could be from a dropdown - default to Antam
      // TODO: add brand selector UI for buyback if needed
    }
    const karatVal = bbCategory === "bb-perhiasan" ? parseInt(bbKarat) || null : bbCategory === "bb-lm" ? 24 : null;
    setItems([...items, { goldTypeId: bbGoldType, itemName: name, brand, weight: w, karat: karatVal, qty: 1, pricePerGram: ppg, priceTotal: Math.round(ppg * w) }]);
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
        body: JSON.stringify({ customerName, customerPhone, type, items, paymentMethod, notes: notes || null, gp: gp ? parseInt(gp) : null, source: source || null, nik: nik || null, address: address || null, kelurahan: kelurahan || null, kecamatan: kecamatan || null, kabupaten: kabupaten || null, provinsi: provinsi || null, instagram: instagram || null, provinceId: provinceId || null, regencyId: regencyId || null, districtId: districtId || null, villageId: villageId || null }),
      });
      const data = await res.json();
      if (data.success) { setShowModal(false); resetForm(); fetchOrders(); } else { setError(data.error ?? "Gagal"); setSaving(false); }
    } else {
      const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch("/api/admin/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, customerName, customerPhone, items, paymentMethod, notes: notes || null, createdBy: user?.id, source: source || null, nik: nik || null, address: address || null, kelurahan: kelurahan || null, kecamatan: kecamatan || null, kabupaten: kabupaten || null, provinsi: provinsi || null, instagram: instagram || null, provinceId: provinceId || null, regencyId: regencyId || null, districtId: districtId || null, villageId: villageId || null }) });
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
    const header = "Order Number,Tanggal,Tipe,Customer,Phone,Total,Metode Pembayaran,Status";
    const rows = filtered.map(o => `${o.order_number},${new Date(o.created_at).toLocaleDateString("id-ID")},${o.type==="sell"?"Jual":"Buyback"},${o.customer_name},${o.customer_phone},${o.total},${o.payment_method==="transfer"?"Transfer":"Cash"},${o.status==="completed"?"Selesai":"Batal"}`);
    const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  let filtered = orders;
  if (filterType !== "all") filtered = filtered.filter(o => o.type === filterType);
  if (filterStatus !== "all") filtered = filtered.filter(o => o.status === filterStatus);
  if (search) { const q = search.toLowerCase(); filtered = filtered.filter(o => o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_phone.includes(q)); }

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-serif text-2xl font-semibold text-text">Orders</h1><p className="mt-1 text-sm text-text-muted">{filtered.length} transaksi</p></div>
        <div className="flex gap-2">
          <button onClick={exportCSV} disabled={filtered.length===0} className="rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-gold/40 hover:text-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-40">Export CSV</button>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2">+ Buat Order</button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]"><svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg><input type="text" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Cari no. order atau customer..." className="w-full rounded-lg border border-border/60 bg-white pl-10 pr-4 py-2.5 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" /></div>
        <div className="flex gap-1 rounded-lg border border-border/60 bg-white p-1">{[{key:"all",label:"Semua"},{key:"sell",label:"Jual"},{key:"buyback",label:"Buyback"}].map(f=>(<button key={f.key} onClick={()=>{setFilterType(f.key as "all" | "sell" | "buyback");setPage(1);}} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filterType===f.key?"bg-gold/10 text-gold-dark":"text-text-muted hover:text-text"}`}>{f.label}</button>))}</div>
        <div className="flex gap-1 rounded-lg border border-border/60 bg-white p-1">{[{key:"all",label:"Semua"},{key:"completed",label:"Selesai"},{key:"cancelled",label:"Batal"}].map(f=>(<button key={f.key} onClick={()=>{setFilterStatus(f.key as "all" | "completed" | "cancelled");setPage(1);}} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filterStatus===f.key?"bg-gold/10 text-gold-dark":"text-text-muted hover:text-text"}`}>{f.label}</button>))}</div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-white">
        <table className="w-full min-w-[640px]">
          <thead><tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><th className="px-4 py-4 md:px-6">No. Order</th><th className="px-4 py-4 md:px-6">Customer</th><th className="hidden px-4 py-4 sm:table-cell md:px-6">Tipe</th><th className="hidden px-4 py-4 sm:table-cell md:px-6">Tanggal</th><th className="px-4 py-4 text-right md:px-6">Total</th><th className="px-4 py-4 text-center md:px-6">Status</th><th className="px-4 py-4 text-center md:px-6">Aksi</th></tr></thead>
          <tbody className="divide-y divide-border/30">
            {paged.map(o => (
              <tr key={o.id} className="hover:bg-surface/30">
                <td className="px-4 py-3.5 md:px-6"><span className="text-sm font-medium text-text">{o.order_number}</span></td>
                <td className="px-4 py-3.5 md:px-6"><p className="text-sm font-medium text-text">{o.customer_name}</p><p className="text-xs text-text-muted">{o.customer_phone}</p></td>
                <td className="hidden px-4 py-3.5 sm:table-cell md:px-6"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.type==='sell'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{o.type==='sell'?'Jual':'Buyback'}</span></td>
                <td className="hidden px-4 py-3.5 text-sm text-text-muted sm:table-cell md:px-6">{new Date(o.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</td>
                <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-text md:px-6">{formatRupiah(o.total)}</td>
                <td className="px-4 py-3.5 text-center md:px-6"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.status==='completed'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-600'}`}>{o.status==='completed'?'Selesai':'Batal'}</span></td>
                <td className="px-4 py-3.5 text-center md:px-6">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openView(o)} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-gold-dark" title="Lihat"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
                    <button onClick={() => openPrint(o)} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-gold-dark" title="Cetak"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg></button>
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

      {/* Detail Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-5">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setViewOrder(null)} />
          <div role="dialog" aria-modal="true" aria-labelledby="order-detail-title" className="relative flex max-h-[95dvh] w-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
              <div><h3 id="order-detail-title" className="font-serif text-xl font-semibold text-text">{viewOrder.order_number}</h3><p className="mt-0.5 text-xs text-text-muted">{new Date(viewOrder.created_at).toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}</p></div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${viewOrder.type==="sell"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>{viewOrder.type==="sell"?"Jual":"Buyback"}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${viewOrder.status==="completed"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>{viewOrder.status==="completed"?"Selesai":"Batal"}</span>
                <button type="button" aria-label="Tutup detail order" onClick={()=>setViewOrder(null)} className="rounded-lg p-2 text-xl leading-none text-text-muted hover:bg-surface hover:text-text">&times;</button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 xl:overflow-hidden xl:p-5">
              <div className="grid min-h-0 gap-4 xl:grid-cols-12">
                <div className="min-h-0 space-y-4 xl:col-span-7">
                  <section className="rounded-lg border border-border/40 bg-surface p-4" aria-labelledby="order-items-heading">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div><h4 id="order-items-heading" className="text-xs font-semibold uppercase tracking-wider text-text-muted">Detail Item</h4><p className="mt-0.5 text-[11px] text-text-light">Rincian item dalam transaksi ini.</p></div>
                      <span className="rounded-md bg-gold/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-gold-dark">{viewOrder.order_items.length} item</span>
                    </div>
                    <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                      {viewOrder.order_items.map((item, index) => (
                        <div key={item.id ?? `${item.item_name}-${index}`} className="flex items-start justify-between gap-3 rounded-lg border border-border/40 bg-white px-3 py-2.5">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-text">{item.item_name}</p>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-text-muted">
                              {getOrderItemDetails({ brand: item.brand, qty: item.qty, weight: item.weight, karat: item.karat, pricePerGram: item.price_per_gram }).map(detail => <span key={detail}>{detail}</span>)}
                            </div>
                          </div>
                          <p className="shrink-0 text-sm font-semibold tabular-nums text-gold-dark">{formatRupiah(item.price_total)}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-lg border border-border/40 bg-surface p-4" aria-labelledby="order-payment-heading">
                    <h4 id="order-payment-heading" className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Pembayaran & Catatan</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border/30 bg-white px-3 py-2.5"><p className="text-[11px] text-text-muted">Metode Pembayaran</p><p className="mt-0.5 text-sm font-semibold text-text">{viewOrder.payment_method === "transfer" ? "Transfer" : "Cash"}</p></div>
                      <div className="rounded-lg border border-border/30 bg-white px-3 py-2.5"><p className="text-[11px] text-text-muted">Catatan</p><p className="mt-0.5 text-sm text-text">{viewOrder.notes || "-"}</p></div>
                    </div>
                    {role === "admin" && viewOrder.gp != null && (
                      <div className="mt-3 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2.5">
                        <p className="text-[11px] text-text-muted">GP (Gross Profit)</p>
                        <p className="mt-0.5 text-sm font-bold text-emerald-600">{formatRupiah(viewOrder.gp)}</p>
                      </div>
                    )}
                  </section>
                </div>

                <section className="rounded-lg border border-border/40 bg-surface p-4 xl:col-span-5" aria-labelledby="order-customer-heading">
                  <h4 id="order-customer-heading" className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Data Customer</h4>
                  <dl className="grid gap-2.5 sm:grid-cols-2">
                    <div className="rounded-lg border border-border/30 bg-white px-3 py-2.5"><dt className="text-[11px] text-text-muted">Nama</dt><dd className="mt-0.5 text-sm font-semibold text-text">{viewOrder.customer_name}</dd></div>
                    <div className="rounded-lg border border-border/30 bg-white px-3 py-2.5"><dt className="text-[11px] text-text-muted">No. WhatsApp</dt><dd className="mt-0.5 text-sm font-medium text-text">{viewOrder.customer_phone}</dd></div>
                    <div className="rounded-lg border border-border/30 bg-white px-3 py-2.5"><dt className="text-[11px] text-text-muted">NIK</dt><dd className="mt-0.5 break-all text-sm text-text">{viewOrder.nik || "-"}</dd></div>
                    <div className="rounded-lg border border-border/30 bg-white px-3 py-2.5"><dt className="text-[11px] text-text-muted">Instagram</dt><dd className="mt-0.5 text-sm text-text">{viewOrder.instagram || "-"}</dd></div>
                    <div className="rounded-lg border border-border/30 bg-white px-3 py-2.5 sm:col-span-2"><dt className="text-[11px] text-text-muted">Sumber Pelanggan</dt><dd className="mt-0.5 text-sm text-text">{viewOrder.source || "-"}</dd></div>
                  </dl>
                  <div className="mt-3 border-t border-border/30 pt-3">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Alamat</h4>
                    <dl className="grid gap-2.5 sm:grid-cols-2">
                      <div><dt className="text-[11px] text-text-muted">Provinsi</dt><dd className="mt-0.5 text-sm text-text">{viewOrder.provinsi || "-"}</dd></div>
                      <div><dt className="text-[11px] text-text-muted">Kabupaten / Kota</dt><dd className="mt-0.5 text-sm text-text">{viewOrder.kabupaten || "-"}</dd></div>
                      <div><dt className="text-[11px] text-text-muted">Kecamatan</dt><dd className="mt-0.5 text-sm text-text">{viewOrder.kecamatan || "-"}</dd></div>
                      <div><dt className="text-[11px] text-text-muted">Kelurahan</dt><dd className="mt-0.5 text-sm text-text">{viewOrder.kelurahan || "-"}</dd></div>
                      <div className="sm:col-span-2"><dt className="text-[11px] text-text-muted">Alamat Lengkap</dt><dd className="mt-0.5 text-sm leading-relaxed text-text">{formatOrderAddress({ address: viewOrder.address, village: viewOrder.kelurahan, district: viewOrder.kecamatan, regency: viewOrder.kabupaten, province: viewOrder.provinsi })}</dd></div>
                    </dl>
                  </div>
                </section>
                </div>
              </div>
            <div className="flex items-center justify-between gap-4 rounded-b-xl border-t border-border/40 bg-surface/30 px-6 py-4">
              <div><p className="text-xs text-text-muted">Total</p><p className="text-xl font-bold text-gold-dark">{formatRupiah(viewOrder.total)}</p></div>
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={()=>setViewOrder(null)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white">Tutup</button>
                {viewOrder.status !== "cancelled" && <button type="button" onClick={()=>{const order=viewOrder;setViewOrder(null);void openEdit(order);}} className="rounded-lg border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold-dark transition-colors hover:bg-gold/5">Edit Order</button>}
                <button type="button" onClick={()=>{const order=viewOrder;setViewOrder(null);openPrint(order);}} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light">Cetak Nota</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {printOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-[8vh] pb-10">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setPrintOrder(null)} />
          <div className="relative w-full max-w-2xl rounded-xl border border-border/60 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
              <div><h3 className="font-serif text-lg font-semibold text-text">{printOrder.order_number}</h3><p className="text-xs text-text-muted">Preview Invoice</p></div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${printOrder.type==="sell"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>{printOrder.type==="sell"?"Jual":"Buyback"}</span>
                <button onClick={()=>setPrintOrder(null)} className="rounded-lg p-1 text-text-muted hover:bg-surface hover:text-text">&times;</button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {printCreator && !printCreator.signature && (
                <div className="border-b border-border/40 bg-surface/40 px-6 py-4">
                  <p className="mb-2 text-xs font-semibold text-text">
                    Tanda tangan pembuat order belum tersimpan. Gambar di bawah untuk mengisi manual:
                  </p>
                  <SignaturePad
                    onChange={(sig) => setPrintCreator((c) => (c ? { ...c, signature: sig } : c))}
                  />
                </div>
              )}
              <OrderInvoice order={printOrder as InvoiceOrder} settings={settings} creator={printCreator} />
            </div>
            <div className="flex justify-end gap-3 border-t border-border/40 bg-surface/30 px-6 py-4 rounded-b-xl">
              <button onClick={()=>setPrintOrder(null)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-border/60 bg-white p-6 shadow-lg text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50"><svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>
            <h4 className="font-serif text-lg font-semibold text-text">Cancel Order?</h4>
            <p className="mt-1 text-sm text-text-muted">{deleteConfirm.order_number} — {deleteConfirm.customer_name}</p>
            <div className="mt-5 flex gap-3"><button onClick={()=>setDeleteConfirm(null)} className="flex-1 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2">Batal</button><button onClick={handleDelete} className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 focus-visible:ring-offset-2">Ya, Cancel</button></div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-5">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>{setShowModal(false);resetForm();}} />
          <div role="dialog" aria-modal="true" aria-labelledby="order-form-title" className="relative flex max-h-[95dvh] w-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4"><div><h3 id="order-form-title" className="font-serif text-xl font-semibold text-text">{editingId?"Edit order":"Buat order baru"}</h3><p className="mt-0.5 text-xs text-text-muted">Transaksi, pelanggan, dan ringkasan dalam satu layar.</p></div><button aria-label="Tutup modal" onClick={()=>{setShowModal(false);resetForm();}} className="rounded-lg p-2 text-xl leading-none text-text-muted hover:bg-surface hover:text-text">&times;</button></div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 xl:overflow-hidden xl:p-5">
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
              <div className="flex gap-3">
                <button onClick={()=>setType("sell")} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${type==="sell"?"border-gold bg-gold/5 text-gold-dark":"border-border/60 text-text-muted hover:border-gold/30"}`}>Jual LM</button>
                <button onClick={()=>setType("buyback")} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${type==="buyback"?"border-gold bg-gold/5 text-gold-dark":"border-border/60 text-text-muted hover:border-gold/30"}`}>Buyback</button>
              </div>
              <div className="grid min-h-0 gap-4 xl:grid-cols-12">
              <div className="rounded-lg border border-border/40 bg-surface p-4 xl:col-span-7 xl:row-start-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Tambah Item</p>
                {type==="sell"?(
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="w-36">
                      <label className="mb-1 block text-xs text-text-muted">Jenis</label>
                      <div className="flex gap-2">
                        <button onClick={() => setSellType("emas")} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${sellType==="emas"?"border-gold bg-gold/5 text-gold-dark":"border-border/60 text-text-muted"}`}>Emas</button>
                        <button onClick={() => setSellType("perak")} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${sellType==="perak"?"border-gold bg-gold/5 text-gold-dark":"border-border/60 text-text-muted"}`}>Perak</button>
                      </div>
                    </div>
                    <div className="w-40">
                      <label className="mb-1 block text-xs text-text-muted">Merek</label>
                      <select value={sellBrand} onChange={e => setSellBrand(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm">{SELL_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    {sellBrand === "Lainnya" && (
                      <div className="w-40">
                        <label className="mb-1 block text-xs text-text-muted">Nama Merek</label>
                        <input type="text" value={sellBrandCustom} onChange={e => setSellBrandCustom(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="Contoh: Lotus Archi" />
                      </div>
                    )}
                    {isAntamSell ? (
                      <div className="flex-1 min-w-[180px]">
                        <label className="mb-1 block text-xs text-text-muted">Produk</label>
                        <select value={sellProduct} onChange={e=>setSellProduct(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm">{LM_PRODUCTS.map(id=>{const gt=goldTypes.find(g=>g.id===id);const p=priceMap.get(id);const ppg = p?.isTotalPrice && gt?.weight ? Math.round(p.buyPrice / gt.weight) : p?.buyPrice;return <option key={id} value={id}>{gt?.name??id} — {ppg?formatRupiah(ppg):"-"}/g</option>;})}</select>
                      </div>
                    ) : (
                      <>
                        <div className="w-32">
                          <label className="mb-1 block text-xs text-text-muted">Berat (g)</label>
                          <input type="number" step="0.01" min="0.01" value={sellWeight} onChange={e=>setSellWeight(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="0.00" />
                        </div>
                        <div className="w-40">
                          <label className="mb-1 block text-xs text-text-muted">Harga/g (Rp)</label>
                          <input type="number" min={0} value={sellPricePerGram} onChange={e=>setSellPricePerGram(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="0" />
                        </div>
                      </>
                    )}
                    <div className="w-24">
                      <label className="mb-1 block text-xs text-text-muted">Qty</label>
                      <input type="number" min={1} value={sellQty} onChange={e=>setSellQty(parseInt(e.target.value)||1)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" />
                    </div>
                    <button onClick={addSellItem} className="rounded-lg border border-gold/40 px-4 py-2.5 text-sm font-semibold text-gold-dark hover:bg-gold/5">+ Tambah</button>
                  </div>
                ):(
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3"><div className="w-40"><label className="mb-1 block text-xs text-text-muted">Kategori</label><select value={bbCategory} onChange={e=>{setBbCategory(e.target.value);const f=goldTypes.filter(g=>g.category===e.target.value)[0];if(f)setBbGoldType(f.id);}} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm"><option value="bb-lm">LM (Antam)</option><option value="bb-perhiasan">Perhiasan</option><option value="bb-logam">Logam Lain</option></select></div><div className="flex-1 min-w-[180px]"><label className="mb-1 block text-xs text-text-muted">Jenis</label><select value={bbGoldType} onChange={e=>setBbGoldType(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm">{bbGoldTypes.map(g=>{const p=priceMap.get(g.id);return <option key={g.id} value={g.id}>{g.name} {p?`— ${formatRupiah(p.sellPrice)}/g`:""}</option>;})}</select></div></div>
                    <div className="flex flex-wrap gap-3 items-end">{bbCategory==="bb-perhiasan"&&<div className="w-24"><label className="mb-1 block text-xs text-text-muted">Karat</label><select value={bbKarat} onChange={e=>setBbKarat(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm">{["24","23","22","21","20","19","18","17","16","15","14","13","12","11","10","9","8","7","6"].map(k=><option key={k} value={k}>{k}K</option>)}</select></div>}<div className="w-32"><label className="mb-1 block text-xs text-text-muted">Berat (g)</label><input type="number" step="0.01" min="0.01" value={bbWeight} onChange={e=>setBbWeight(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="0.00" /></div>
                    {bbCategory === "bb-perhiasan" ? (
                      <div className="flex-1 min-w-[180px]">
                        <label className="mb-1 block text-xs text-text-muted">Kategori</label>
                        <select
                          value={bbCategoryName}
                          onChange={e => {
                            setBbCategoryName(e.target.value);
                            if (e.target.value !== "Lainnya") setBbCustomName("");
                          }}
                          className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm"
                        >
                          <option value="">Pilih kategori...</option>
                          {BUYBACK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          <option value="Lainnya">Lainnya...</option>
                        </select>
                        {bbCategoryName === "Lainnya" && (
                          <input type="text" value={bbCustomName} onChange={e=>setBbCustomName(e.target.value)} className="mt-2 w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="Tulis nama item..." />
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 min-w-[150px]"><label className="mb-1 block text-xs text-text-muted">Nama (opsional)</label><input type="text" value={bbItemName} onChange={e=>setBbItemName(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="Contoh: Retro, Merek Lain" /></div>
                    )}<button onClick={addBuybackItem} className="rounded-lg border border-gold/40 px-4 py-2.5 text-sm font-semibold text-gold-dark hover:bg-gold/5">+ Tambah</button></div>
                  </div>
                )}
                <div className="mt-4 border-t border-border/40 pt-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div><p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Item ditambahkan</p><p className="mt-0.5 text-[11px] text-text-light">Detail lengkap item dalam order ini.</p></div>
                    <span className="rounded-md bg-gold/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-gold-dark">{items.length} item</span>
                  </div>
                  {items.length > 0 ? (
                    <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                      {items.map((it, i) => (
                        <div key={`${it.itemName}-${i}`} className="flex items-start justify-between gap-3 rounded-lg border border-border/40 bg-white px-3 py-2.5">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-text">{it.itemName}</p>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-text-muted">
                              {getOrderItemDetails(it).map(detail => <span key={detail}>{detail}</span>)}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <p className="text-sm font-semibold tabular-nums text-gold-dark">{formatRupiah(it.priceTotal)}</p>
                            <button type="button" aria-label={`Hapus ${it.itemName}`} onClick={()=>removeItem(i)} className="rounded-md px-2 py-1 text-lg leading-none text-red-400 hover:bg-red-50 hover:text-red-600">&times;</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border/60 bg-white/60 px-4 py-4 text-center text-xs text-text-muted">Belum ada item yang ditambahkan.</div>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-border/40 bg-surface p-4 xl:col-span-5 xl:col-start-8 xl:row-span-2 xl:row-start-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Data Customer</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div><label className="mb-1 block text-xs text-text-muted">Nama <span className="text-red-400">*</span></label><input type="text" value={customerName} onChange={e=>setCustomerName(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="Nama lengkap" /></div>
                  <div><label className="mb-1 block text-xs text-text-muted">No. WA <span className="text-red-400">*</span></label><input type="tel" value={customerPhone} onChange={e=>handlePhoneChange(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="0812-3456-7890" /></div>
                  {lookup && (
                    <div className="sm:col-span-2 -mt-2 flex items-center justify-between gap-3 rounded-lg border border-gold/40 bg-gold/5 px-3 py-2.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-text">{lookup.name}</span>
                        {lookup.order_count > 1 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Repeat · {lookup.order_count}x</span>}
                      </div>
                      <button type="button" onClick={applyLookup} className="shrink-0 rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold-dark transition-colors hover:bg-gold/10">Gunakan data ini</button>
                    </div>
                  )}
                  <div><label className="mb-1 block text-xs text-text-muted">Tau Safargold dari mana?</label><select value={source} onChange={e=>setSource(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm"><option value="">Pilih...</option>{SOURCE_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label className="mb-1 block text-xs text-text-muted">Instagram</label><input type="text" value={instagram} onChange={e=>setInstagram(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="@username" /></div>
                  <div className="sm:col-span-2"><label className="mb-1 block text-xs text-text-muted">NIK</label><input type="text" value={nik} onChange={e=>setNik(e.target.value)} maxLength={16} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm" placeholder="16 digit NIK KTP" /></div>
                </div>
                <div className="mt-3 border-t border-border/30 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Alamat</p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">Provinsi</label>
                      <select
                        value={provinceId}
                        onChange={e => {
                          const sel = e.target.selectedOptions[0];
                          onProvinceChange(e.target.value, sel?.textContent ?? "");
                        }}
                        onFocus={() => { if (provinces.length === 0) loadProvinces(); }}
                        className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm"
                      >
                        <option value="">Pilih provinsi...</option>
                        {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">Kabupaten / Kota</label>
                      <div className="relative">
                        <select
                          value={regencyId}
                          onChange={e => {
                            const sel = e.target.selectedOptions[0];
                            onRegencyChange(e.target.value, sel?.textContent ?? "");
                          }}
                          disabled={!provinceId || regionLoading.regency}
                          className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm disabled:bg-surface"
                        >
                          <option value="">Pilih kabupaten...</option>
                          {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        {regionLoading.regency && <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">Kecamatan</label>
                      <div className="relative">
                        <select
                          value={districtId}
                          onChange={e => {
                            const sel = e.target.selectedOptions[0];
                            onDistrictChange(e.target.value, sel?.textContent ?? "");
                          }}
                          disabled={!regencyId || regionLoading.district}
                          className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm disabled:bg-surface"
                        >
                          <option value="">Pilih...</option>
                          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        {regionLoading.district && <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />}
                      </div>
                    </div>
                    <div className="relative">
                      <label className="mb-1 block text-xs text-text-muted">Kelurahan</label>
                      <div className="relative">
                        <select
                          value={villageId}
                          onChange={e => {
                            const sel = e.target.selectedOptions[0];
                            setVillageId(e.target.value);
                            setKelurahan(sel?.textContent ?? "");
                          }}
                          disabled={!districtId || regionLoading.village}
                          className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm disabled:bg-surface"
                        >
                          <option value="">{villages.length === 0 && !regionLoading.village ? "Pilih kecamatan dulu" : "Pilih..."}</option>
                          {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                        {regionLoading.village && <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />}
                      </div>
                    </div>
                    <div className="sm:col-span-2"><label className="mb-1 block text-xs text-text-muted">Alamat (Jalan/RT/RW)</label><input type="text" value={address} onChange={e=>setAddress(e.target.value)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="Jl. Emas No. 1, RT 02/03" /></div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/40 bg-surface p-4 xl:col-span-7 xl:row-start-2">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Pembayaran & Catatan</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Metode Pembayaran</label>
                    <div className="flex gap-2">
                      <button onClick={() => setPaymentMethod("cash")} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${paymentMethod==="cash"?"border-gold bg-gold/5 text-gold-dark":"border-border/60 text-text-muted"}`}>Cash</button>
                      <button onClick={() => setPaymentMethod("transfer")} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${paymentMethod==="transfer"?"border-gold bg-gold/5 text-gold-dark":"border-border/60 text-text-muted"}`}>Transfer</button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Catatan (opsional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={1} className="w-full resize-none rounded-lg border border-border/60 bg-white px-3 py-2 text-sm" placeholder="Keterangan tambahan..." />
                  </div>
                </div>
                {role === "admin" && editingId && (
                  <div className="mt-3">
                    <label className="mb-1 block text-xs text-text-muted">GP (Gross Profit)</label>
                    <input type="number" min={0} value={gp} onChange={e => setGp(e.target.value)} className="w-full max-w-xs rounded-lg border border-border/60 bg-white px-3 py-2.5 text-sm" placeholder="0" />
                    <p className="mt-1 text-[10px] text-text-muted">Hanya admin yang bisa mengisi & melihat.</p>
                  </div>
                )}
              </div>
            </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 bg-surface/30 px-6 py-4 rounded-b-xl"><div><p className="text-xs text-text-muted">Total</p><p className="text-xl font-bold text-gold-dark">{formatRupiah(total)}</p></div><div className="flex gap-3"><button onClick={()=>{setShowModal(false);resetForm();}} className="rounded-xl border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted hover:bg-white">Batal</button><button onClick={handleSubmit} disabled={saving||items.length===0} className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-60">{saving?"Menyimpan...":editingId?"Update Order":"Simpan Order"}</button></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
