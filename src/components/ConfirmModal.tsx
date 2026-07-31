"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-border/60 bg-white p-6 shadow-2xl animate-[fade-up_0.2s_ease-out]">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/5 text-gold">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </div>
        <h3 className="font-serif text-lg font-semibold text-text">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border/60 px-4 py-2.5 text-sm font-semibold text-text-muted transition-all hover:bg-surface hover:text-text"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="gold-gradient-bg flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
