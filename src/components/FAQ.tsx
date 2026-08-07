"use client";

import { useState } from "react";

const faqs = [
  { q: "Apakah emas tanpa surat bisa dijual?", a: "Bisa. Emas tanpa surat tetap dapat dilakukan pengecekan untuk mengetahui kadar dan berat emas sebelum diberikan penawaran harga." },
  { q: "Apakah menerima perhiasan emas yang rusak atau patah?", a: "Ya. Perhiasan patah, rusak, penyok, putus, atau sudah tidak terpakai tetap dapat dinilai berdasarkan kandungan emasnya." },
  { q: "Apakah emas warisan bisa dijual?", a: "Bisa. Emas lama maupun emas warisan dapat dilakukan pengecekan kadar dan berat terlebih dahulu sebelum transaksi." },
  { q: "Apakah menerima emas dari toko atau brand lain?", a: "Bisa. Penilaian emas dilakukan berdasarkan hasil pengecekan kadar, berat, dan kondisi barang, bukan hanya berdasarkan tempat emas tersebut dibeli." },
  { q: "Apakah menerima semua kadar emas?", a: "Kami dapat melakukan pengecekan berbagai kadar emas. Nilai pembelian akan menyesuaikan kadar emas yang terdeteksi saat proses pengecekan." },
  { q: "Bagaimana proses pengecekan emas?", a: "Barang akan ditimbang dan diperiksa kadar emasnya menggunakan metode atau alat pengecekan yang tersedia. Hasil pengecekan kemudian digunakan sebagai dasar perhitungan harga." },
  { q: "Apakah pengecekan emas merusak perhiasan?", a: "Jika menggunakan metode pengecekan non-destruktif seperti XRF, kadar logam dapat dianalisis tanpa harus merusak bentuk utama perhiasan." },
  { q: "Apakah customer bisa melihat proses pengecekannya?", a: "Kami menyarankan proses pengecekan dilakukan secara transparan sehingga customer dapat mengetahui berat, kadar, dan dasar perhitungan harga barangnya." },
  { q: "Mengapa kadar hasil pengecekan bisa berbeda dengan tulisan di surat?", a: "Surat dapat memberikan informasi awal mengenai barang, tetapi kondisi aktual emas tetap perlu diverifikasi. Hasil pengecekan fisik digunakan untuk mengetahui kadar emas pada saat transaksi." },
  { q: "Apakah batu atau berlian ikut dihitung sebagai berat emas?", a: "Tidak. Untuk penilaian berdasarkan kandungan emas, komponen non-emas seperti batu biasanya dipisahkan dari perhitungan berat emas bersih." },
];

export default function FAQ({ phone }: { phone: string }) {
  const waNumber = phone.replace(/\D/g, "");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <span className="pointer-events-none absolute -right-8 -top-8 select-none font-serif text-[8rem] font-bold leading-none text-gold/[0.04] md:text-[14rem]">
        05
      </span>
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">FAQ</p>
          <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">
            Pertanyaan Umum
          </h2>
          <p className="mt-5 text-text-muted">
            Semua yang perlu Anda ketahui tentang jual beli emas di Safar Gold.
          </p>

          <div className="mt-8 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6">
            <p className="font-serif text-lg font-semibold text-text">Masih ada pertanyaan?</p>
            <p className="mt-1 text-sm text-text-muted">Tim kami siap membantu Anda langsung.</p>
            <a
              href={`https://wa.me/62${waNumber}?text=Halo%20Safar%20Gold%2C%20saya%20ingin%20bertanya`}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient-bg mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
              </svg>
              Chat WhatsApp
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="divide-y divide-border/60 border-y border-border/60">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-serif text-base font-semibold text-text md:text-lg">{faq.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                      open === i ? "gold-gradient-bg text-white" : "bg-surface text-text-muted"
                    }`}
                  >
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-10 text-sm leading-relaxed text-text-muted">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
