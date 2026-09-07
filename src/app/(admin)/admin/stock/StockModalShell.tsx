"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function StockModalShell({
  title,
  description,
  eyebrow,
  onClose,
  children,
  footer,
  size = "wide",
}: {
  title: string;
  description: string;
  eyebrow: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
  size?: "wide" | "compact";
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = `stock-modal-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      <button type="button" tabIndex={-1} aria-label="Tutup modal" className="fixed inset-0 cursor-default bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`relative my-auto flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-[0_24px_80px_rgba(34,28,16,.22)] ${size === "wide" ? "max-w-4xl" : "max-w-lg"}`}>
        <header className="relative flex shrink-0 items-start justify-between gap-5 border-b border-border/40 px-5 py-4 sm:px-6 sm:py-5">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gold" />
          <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-gold-dark">{eyebrow}</p><h2 id={titleId} className="mt-1 font-serif text-xl font-semibold text-text">{title}</h2><p className="mt-1 max-w-2xl text-xs leading-relaxed text-text-muted sm:text-sm">{description}</p></div>
          <button ref={closeRef} type="button" aria-label={`Tutup ${title}`} onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 text-lg text-text-muted transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40">×</button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-border/40 bg-surface/50 px-5 py-4 sm:px-6">{footer}</footer>
      </section>
    </div>
  );
}
