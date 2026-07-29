export default function LegalNotice() {
  return (
    <div className="flex gap-3 rounded-xl border border-gold/20 bg-gold/5 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-text">Komitmen Legalitas</p>
        <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
          Safar Gold hanya menerima emas yang bersumber legal dan dapat diverifikasi. Kami berhak menolak transaksi yang tidak memenuhi ketentuan legalitas.
        </p>
      </div>
    </div>
  );
}
