"use client";

interface PreviewItem {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: number | null;
  karat: number | null;
}

interface PricePreviewModalProps {
  open: boolean;
  onClose: () => void;
  items: PreviewItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  "lm": "Logam Mulia (Jual)",
  "bb-lm": "Buyback Logam Mulia",
  "bb-perhiasan": "Buyback Perhiasan",
  "bb-logam": "Logam Lain",
};

function formatRupiah(n: number): string {
  return n.toLocaleString("id-ID");
}

function roundToNearest(n: number): number {
  return Math.round(n / 1000) * 1000;
}

export default function PricePreviewModal({ open, onClose, items }: PricePreviewModalProps) {
  if (!open) return null;

  const grouped = items.reduce<Record<string, PreviewItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category]!.push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-[6vh] pb-10">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-3xl rounded-2xl border border-border/60 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-text">Preview Harga</h2>
            <p className="text-xs text-text-muted">Sebelum publikasi — semua kategori</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-dark">
                  {CATEGORY_LABELS[category] ?? category}
                </h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-border/40">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {category === "lm" ? (
                        <>
                          <th className="px-4 py-3 md:px-6">Jenis / Berat</th>
                          <th className="px-4 py-3 text-right md:px-6">Harga / Gram</th>
                          <th className="px-4 py-3 text-right md:px-6">Harga Total</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3 md:px-6">Jenis</th>
                          <th className="px-4 py-3 text-right md:px-6">Harga / Gram</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {catItems.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-surface/50">
                        <td className="px-4 py-3 text-sm text-text md:px-6">
                          <span className="font-medium">{item.name}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-gold-dark md:px-6">
                          {item.price > 0 ? `Rp ${formatRupiah(roundToNearest(item.price))}` : "-"}
                        </td>
                        {category === "lm" && (
                          <td className="px-4 py-3 text-right text-sm text-text-muted md:px-6">
                            {item.price > 0 && item.weight
                              ?                               `Rp ${formatRupiah(roundToNearest(item.price * item.weight))}`
                              : "-"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end border-t border-border/40 px-6 py-4">
          <button
            onClick={onClose}
            className="gold-gradient-bg rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
