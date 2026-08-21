"use client";

import { formatRupiah } from "@/lib/gold-api";

export type InvoiceOrder = {
  id: string;
  order_number: string;
  type: "sell" | "buyback";
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  invoice_number: string | null;
  invoice_type: "jual" | "buyback" | null;
  created_at: string;
  source: string | null;
  nik: string | null;
  address: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kabupaten: string | null;
  provinsi: string | null;
  instagram: string | null;
  order_items: {
    id?: string;
    item_name: string;
    weight: number;
    karat: number | null;
    qty: number;
    price_per_gram: number;
    price_total: number;
  }[];
};

export type InvoiceSettings = {
  address: string;
  phone: string;
  email: string;
};

function buildAddress(o: InvoiceOrder) {
  const parts = [o.address, o.kelurahan, o.kecamatan, o.kabupaten, o.provinsi].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export default function OrderInvoice({ order, settings }: { order: InvoiceOrder; settings: InvoiceSettings }) {
  const isJual = order.type === "sell";
  const title = isJual ? "Nota Penjualan" : "Nota Pembelian";
  const address = buildAddress(order);

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-root, #invoice-root * { visibility: visible; }
          #invoice-root { position: fixed; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      <div className="mx-auto max-w-2xl px-4 py-10" id="invoice-root">
        {/* Header Toko */}
        <div className="text-center">
          <h1 className="font-serif text-xl font-bold tracking-wide text-text">SAFAR GOLD</h1>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">{settings.address}</p>
          <p className="text-xs text-text-muted">Telp: {settings.phone}</p>
          <hr className="mx-auto mt-4 w-24 border-t border-text/20" />
        </div>

        {/* Title */}
        <h2 className="mt-4 text-center font-serif text-lg font-bold uppercase tracking-widest text-text">
          {title}
        </h2>

        {/* Info */}
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <span className="text-xs text-text-muted">No. Nota</span>
            <p className="font-semibold text-text">{order.invoice_number ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-muted">Tanggal</span>
            <p className="font-semibold text-text">
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-xs text-text-muted">Nama Customer</span>
            <p className="font-semibold text-text">{order.customer_name}</p>
            <p className="text-xs text-text-muted">{order.customer_phone}</p>
            {address && <p className="mt-1 text-xs text-text-muted">{address}</p>}
            {order.nik && <p className="text-xs text-text-muted">NIK: {order.nik}</p>}
          </div>
        </div>

        {/* Tabel Item */}
        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-text/20 text-left text-xs uppercase tracking-wider text-text-muted">
              <th className="py-2">#</th>
              <th className="py-2">Nama Barang</th>
              {!isJual && <th className="py-2 text-center">Karat</th>}
              <th className="py-2 text-center">Berat</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Harga/g</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item, idx) => (
              <tr key={item.id ?? idx} className="border-b border-text/10">
                <td className="py-2.5 text-text-muted">{idx + 1}</td>
                <td className="py-2.5 font-medium text-text">{item.item_name}</td>
                {!isJual && (
                  <td className="py-2.5 text-center text-text-muted">
                    {item.karat ? `${item.karat}K` : "—"}
                  </td>
                )}
                <td className="py-2.5 text-center text-text-muted">{item.weight}g</td>
                <td className="py-2.5 text-center">{item.qty}</td>
                <td className="py-2.5 text-right tabular-nums">{formatRupiah(item.price_per_gram)}</td>
                <td className="py-2.5 text-right font-semibold tabular-nums text-text">
                  {formatRupiah(item.price_total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={isJual ? 5 : 6}
                className="py-3 text-right text-sm font-bold uppercase text-text"
              >
                Total
              </td>
              <td className="py-3 text-right text-base font-bold tabular-nums text-text">
                {formatRupiah(order.total)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-text-muted">Terima kasih telah bertransaksi di Safar Gold</p>
          <p className="mt-1 text-[11px] text-text-light">{settings.email}</p>
        </div>

        {/* Cetak Button — hidden on print */}
        <div className="mt-6 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-gold/40 px-6 py-2.5 text-sm font-semibold text-gold-dark transition-colors hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2"
          >
            Cetak / Download PDF
          </button>
          <p className="mt-2 text-[11px] text-text-light">
            Pilih &quot;Save as PDF&quot; di dialog cetak untuk menyimpan file
          </p>
        </div>
      </div>
    </>
  );
}
