"use client";

import { useState } from "react";

type Props = { elementId: string; invoiceNumber: string | null; orderNumber: string };

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "invoice";
}

export default function InvoiceDownloadButton({ elementId, invoiceNumber, orderNumber }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  async function downloadPdf() {
    const invoice = document.getElementById(elementId);
    if (!invoice || downloading) return;
    setDownloading(true);
    setError("");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const canvas = await html2canvas(invoice, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      const imageData = canvas.toDataURL("image/png");
      const printableHeight = pageHeight - margin * 2;

      let remainingHeight = imageHeight;
      let offsetY = margin;
      pdf.addImage(imageData, "PNG", margin, offsetY, imageWidth, imageHeight);
      remainingHeight -= printableHeight;
      while (remainingHeight > 0) {
        offsetY -= printableHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", margin, offsetY, imageWidth, imageHeight);
        remainingHeight -= printableHeight;
      }
      pdf.save(`${safeFilename(invoiceNumber || orderNumber)}.pdf`);
    } catch (downloadError) {
      console.error(downloadError);
      setError("PDF gagal dibuat. Gunakan Cetak / Simpan PDF.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={downloadPdf} disabled={downloading} className="rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:cursor-wait disabled:opacity-60">
        {downloading ? "Membuat PDF..." : "Unduh PDF"}
      </button>
      {error && <p className="max-w-56 text-right text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
