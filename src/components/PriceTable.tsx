import { getFormattedTodayPrices, formatRupiah, formatDate } from "@/lib/gold-api";

export default function PriceTable() {
  const prices = getFormattedTodayPrices();
  const hasData = prices.length > 0 && prices[0].buyPrice > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 px-8 py-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-text">Daftar Harga Emas</h3>
          <p className="mt-0.5 text-xs text-text-muted">
            {hasData ? `Update: ${formatDate(prices[0]?.date ?? "")}` : "Belum ada data"}
          </p>
        </div>
        {hasData && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/5 px-3 py-1.5 text-xs font-medium text-gold-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Live
          </span>
        )}
      </div>
      {!hasData ? (
        <div className="p-8 text-center md:p-16">
          <svg className="mx-auto mb-3 h-10 w-10 text-text-light md:mb-4 md:h-12 md:w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <p className="font-serif text-lg font-medium text-text">Belum ada data harga</p>
          <p className="mt-2 text-sm text-text-muted">
            Harga akan di-update otomatis setiap hari pukul <span className="font-semibold text-gold-dark">06:00 WIB</span>.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-surface/50 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-8 py-4">Jenis Emas</th>
                <th className="px-8 py-4">Karat</th>
                <th className="px-8 py-4">Harga Jual</th>
                <th className="px-8 py-4">Harga Buyback</th>
                <th className="px-8 py-4">Spread</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {prices.map((price) => (
                <tr key={price.id} className="transition-colors hover:bg-surface/50">
                  <td className="px-8 py-4">
                    <p className="text-sm font-semibold text-text">{price.goldName}</p>
                    <p className="text-xs text-text-muted">{price.category}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className="rounded-full bg-gold/5 px-2.5 py-1 text-xs font-medium text-gold-dark">
                      {price.karat}K
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm font-bold text-gold-dark">
                    {formatRupiah(price.buyPrice)}
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-text">
                    {formatRupiah(price.sellPrice)}
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm text-text-muted">{formatRupiah(price.spread)}</p>
                    <p className="text-xs text-text-light">{price.spreadPercent}%</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {hasData && prices[0]?.lastUpdated && (
        <div className="border-t border-border/40 bg-surface/30 px-8 py-3.5 text-xs text-text-light">
          Terakhir diperbarui: {new Date(prices[0].lastUpdated).toLocaleTimeString("id-ID")} WIB
          {" · "}Update otomatis setiap 06:00 WIB
        </div>
      )}
    </div>
  );
}
