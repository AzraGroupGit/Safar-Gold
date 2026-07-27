"use client";

import { useState } from "react";

const faqs = [
  { q: "Apa itu harga buyback?", a: "Harga buyback adalah harga saat kami membeli emas dari Anda. Ini selalu lebih rendah dari harga jual karena kami perlu menutup biaya operasional dan margin. Selisih ini disebut spread." },
  { q: "Berapa spread untuk jual beli emas di Safar Gold?", a: "Spread kami berkisar 2-5% tergantung jenis emas. Antam dan UBS biasanya 2-3%, perhiasan 3-5%. Spread paling kompetitif di pasaran." },
  { q: "Apakah harga di website selalu ter-update?", a: "Ya, harga di-update otomatis setiap hari pukul 06:00 WIB dari harga emas internasional. Anda selalu mendapatkan harga terkini setiap harinya." },
  { q: "Bagaimana cara transaksi jual beli emas?", a: "Datang langsung ke toko kami di alamat yang tertera, atau hubungi via WhatsApp untuk konsultasi. Bawa KTP dan emas yang ingin dijual / uang untuk pembelian." },
  { q: "Apakah emas dijamin keasliannya?", a: "Ya, semua emas yang kami jual (Antam, UBS) bersertifikat resmi. Untuk buyback, kami melakukan pengecekan kadar karat di tempat dengan alat yang akurat." },
  { q: "Apa perbedaan Antam, UBS, dan perhiasan?", a: "Antam adalah emas batangan produksi PT Aneka Tambang (BUMN), paling likuid. UBS adalah produk swasta dengan harga lebih kompetitif. Perhiasan memiliki nilai seni tambahan dan biasanya kadar karat lebih rendah (18K-22K)." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-footer py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-diamond" />
      <span className="pointer-events-none absolute -right-8 -top-8 select-none font-serif text-[14rem] font-bold leading-none text-white/[0.03]">
        05
      </span>
      <div className="relative mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">FAQ</p>
          <h2 className="font-serif text-2xl font-bold text-white md:text-4xl lg:text-5xl">Pertanyaan Umum</h2>
          <p className="mx-auto mt-5 max-w-xl text-footer-text">Semua yang perlu Anda ketahui tentang jual beli emas di Safar Gold.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur transition-all">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                <span className="pr-4 font-serif text-base font-semibold text-white">{faq.q}</span>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${open === i ? "gold-gradient-bg text-white" : "bg-white/10 text-footer-text"}`}>
                  <svg className={`h-4 w-4 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-footer-text">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
