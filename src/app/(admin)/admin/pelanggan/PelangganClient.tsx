"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { formatRupiah } from "@/lib/gold-api";
import OrderInvoice, { type InvoiceOrder, type InvoiceSettings } from "@/components/OrderInvoice";

type Customer = {
  id: string;
  name: string;
  phone: string;
  nik: string | null;
  source: string | null;
  address: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kabupaten: string | null;
  provinsi: string | null;
  instagram: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
  last_order_at: string | null;
};

type CustomerOrder = {
  id: string;
  order_number: string;
  type: string;
  total: number;
  status: string;
  invoice_number: string | null;
  created_at: string;
};

export default function PelangganClient({ settings }: { settings: InvoiceSettings }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<{ customer: Customer; orders: CustomerOrder[] } | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<InvoiceOrder | null>(null);
  const detailRef = useRef<{ customer: Customer; orders: CustomerOrder[] } | null>(null);

  function fetchCustomers() {
    fetch("/api/admin/customers").then(r => r.json()).then(d => { setCustomers(d.customers ?? []); setLoading(false); });
  }
  useEffect(() => { fetchCustomers(); }, []);

  async function openDetail(c: Customer) {
    const res = await fetch(`/api/admin/customers/${c.id}`);
    const data = await res.json();
    setDetail(data);
    detailRef.current = data;
  }

  async function openInvoice(orderId: string) {
    detailRef.current = detail;
    setDetail(null);
    const res = await fetch(`/api/admin/orders/${orderId}`);
    const data = await res.json();
    setInvoiceOrder(data.order ?? null);
  }

  function backToDetail() {
    setInvoiceOrder(null);
    setDetail(detailRef.current);
  }

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.nik ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-serif text-2xl font-semibold text-text">Pelanggan</h1><p className="mt-1 text-sm text-text-muted">{filtered.length} pelanggan</p></div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, No WA, atau NIK..." className="w-full rounded-lg border border-border/60 bg-white pl-10 pr-4 py-2.5 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-white">
        <table className="w-full min-w-[640px]">
          <thead><tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted"><th className="px-4 py-4 md:px-6">Nama</th><th className="px-4 py-4 md:px-6">No WA</th><th className="hidden px-4 py-4 sm:table-cell md:px-6">Sumber</th><th className="px-4 py-4 text-center md:px-6">Order</th><th className="px-4 py-4 text-right md:px-6">Total Belanja</th><th className="hidden px-4 py-4 sm:table-cell md:px-6">Terakhir</th><th className="px-4 py-4 text-center md:px-6">Aksi</th></tr></thead>
          <tbody className="divide-y divide-border/30">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-surface/30">
                <td className="px-4 py-3.5 md:px-6"><p className="text-sm font-medium text-text">{c.name}</p>{c.nik && <p className="text-xs text-text-muted">NIK: {c.nik}</p>}</td>
                <td className="px-4 py-3.5 text-sm text-text-muted md:px-6">{c.phone}</td>
                <td className="hidden px-4 py-3.5 sm:table-cell md:px-6">{c.source ? <span className="rounded-full bg-gold/5 px-2 py-0.5 text-xs text-gold-dark">{c.source}</span> : <span className="text-xs text-text-muted">-</span>}</td>
                <td className="px-4 py-3.5 text-center md:px-6">{c.order_count > 1 ? <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Repeat · {c.order_count}x</span> : <span className="text-sm text-text-muted">{c.order_count}</span>}</td>
                <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-text md:px-6">{formatRupiah(c.total_spent)}</td>
                <td className="hidden px-4 py-3.5 text-sm text-text-muted sm:table-cell md:px-6">{c.last_order_at ? new Date(c.last_order_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}</td>
                <td className="px-4 py-3.5 text-center md:px-6"><button onClick={() => openDetail(c)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gold-dark transition-colors hover:bg-gold/5">Detail</button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-text-muted">Belum ada pelanggan{search ? " yang cocok" : ""}.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-[6vh] pb-10">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-2xl rounded-xl border border-border/60 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-text">{detail.customer.name}</h3>
                <p className="text-xs text-text-muted">{detail.customer.phone}</p>
              </div>
              <button onClick={() => setDetail(null)} className="rounded-lg p-1 text-text-muted hover:bg-surface hover:text-text">&times;</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {detail.customer.nik && <div className="rounded-lg border border-border/30 bg-surface p-3"><p className="text-[11px] uppercase tracking-wider text-text-muted">NIK</p><p className="mt-1 text-sm font-medium text-text">{detail.customer.nik}</p></div>}
                <div className="rounded-lg border border-border/30 bg-surface p-3"><p className="text-[11px] uppercase tracking-wider text-text-muted">Sumber</p><p className="mt-1 text-sm font-medium text-text">{detail.customer.source ?? "-"}</p></div>
                {detail.customer.instagram && <div className="rounded-lg border border-border/30 bg-surface p-3"><p className="text-[11px] uppercase tracking-wider text-text-muted">Instagram</p><p className="mt-1 text-sm font-medium text-text">{detail.customer.instagram}</p></div>}
                <div className="rounded-lg border border-border/30 bg-surface p-3 sm:col-span-2"><p className="text-[11px] uppercase tracking-wider text-text-muted">Alamat</p><p className="mt-1 text-sm text-text">{[detail.customer.address, detail.customer.kelurahan, detail.customer.kecamatan, detail.customer.kabupaten, detail.customer.provinsi].filter(Boolean).join(", ") || "-"}</p></div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Riwayat Order ({detail.orders.length})</p>
                {detail.orders.length === 0 ? (
                  <p className="py-6 text-center text-sm text-text-muted">Belum ada order.</p>
                ) : (
                  <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead><tr className="border-b border-border/30 text-left text-xs text-text-muted"><th className="py-2">No. Order</th><th className="py-2 text-center">Tipe</th><th className="py-2 text-right">Total</th><th className="py-2 text-center">Status</th><th className="py-2 text-center">Aksi</th></tr></thead>
                    <tbody className="divide-y divide-border/20">
                      {detail.orders.map(o => (
                        <tr key={o.id}>
                          <td className="py-2.5 font-medium text-text">{o.order_number}</td>
                          <td className="py-2.5 text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.type === "sell" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{o.type === "sell" ? "Jual" : "Buyback"}</span></td>
                          <td className="py-2.5 text-right font-semibold tabular-nums">{formatRupiah(o.total)}</td>
                          <td className="py-2.5 text-center">{o.status === "completed" ? "Selesai" : "Batal"}</td>
                          <td className="py-2.5 text-center"><button onClick={() => openInvoice(o.id)} className="text-xs font-semibold text-gold-dark hover:underline">Invoice</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end border-t border-border/40 bg-surface/30 px-6 py-4 rounded-b-xl">
              <button onClick={() => setDetail(null)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto px-4 pt-[6vh] pb-10">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setInvoiceOrder(null)} />
          <div className="relative w-full max-w-2xl rounded-xl border border-border/60 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <button onClick={backToDetail} className="rounded-lg p-1 text-text-muted transition-colors hover:bg-surface hover:text-text" title="Kembali">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                </button>
                <div><h3 className="font-serif text-lg font-semibold text-text">{invoiceOrder.order_number}</h3><p className="text-xs text-text-muted">Preview Invoice</p></div>
              </div>
              <button onClick={() => setInvoiceOrder(null)} className="rounded-lg p-1 text-text-muted hover:bg-surface hover:text-text">&times;</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <OrderInvoice order={invoiceOrder} settings={settings} />
            </div>
            <div className="flex items-center justify-between border-t border-border/40 bg-surface/30 px-6 py-4 rounded-b-xl">
              <button onClick={backToDetail} className="rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white">← Kembali</button>
              <button onClick={() => setInvoiceOrder(null)} className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
