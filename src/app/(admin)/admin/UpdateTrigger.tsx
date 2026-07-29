"use client";

import { useState } from "react";

export default function UpdateTrigger() {
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "Siap update" });

  async function handleUpdate() {
    setStatus({ type: "loading", message: "Mengambil harga internasional..." });
    try {
      const res = await fetch("/api/cron/update-prices");
      const data = await res.json();
      if (data.success) {
        setStatus({
          type: "success",
          message: `Berhasil! ${data.goldTypes?.length ?? 0} jenis emas diperbarui. Refresh halaman.`,
        });
      } else {
        setStatus({ type: "error", message: data.error ?? "Gagal update" });
      }
    } catch {
      setStatus({ type: "error", message: "Gagal menghubungi server" });
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              status.type === "loading"
                ? "bg-amber-400 animate-pulse"
                : status.type === "success"
                  ? "bg-green-500"
                  : status.type === "error"
                    ? "bg-red-500"
                    : "bg-border"
            }`}
          />
          <span className="text-sm font-medium text-text">Update Harga</span>
        </div>
        <span className="text-sm text-text-muted">{status.message}</span>
      </div>
      <button
        onClick={handleUpdate}
        disabled={status.type === "loading"}
        className="gold-gradient-bg shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-gold/15 transition-all hover:shadow-lg hover:shadow-gold/25 disabled:opacity-60"
      >
        {status.type === "loading" ? "Memproses..." : "Update Harga Sekarang"}
      </button>
    </div>
  );
}
