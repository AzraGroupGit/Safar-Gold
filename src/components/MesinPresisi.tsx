import fs from "fs";
import path from "path";
import Image from "next/image";

type Machine = {
  src: string;
  name: string;
  role: string;
  badges: string[];
};

// Edit data di bawah ini — nama, fungsi, dan badge tiap alat
const MACHINES: Machine[] = [
  {
    src: "/mesin-1.webp",
    name: "Vanta GX — XRF Analyzer (Evident/Olympus)",
    role: "Cek kadar & komposisi emas dengan teknologi XRF non-destruktif",
    badges: ["Kadar 0–24K", "Deteksi 27 unsur", "Anti-palsu"],
  },
  {
    src: "/mesin-2.webp",
    name: "Glory GFB Series — Penghitung Uang",
    role: "Hitung cepat & deteksi uang palsu (UV + magnetik)",
    badges: ["1.800 lembar/menit", "Deteksi UV"],
  },
  {
    src: "/mesin-3.webp",
    name: "GKS-300 — Gold & Platinum Tester (Alfa Mirage)",
    role: "Uji kemurnian emas & platina metode berat jenis, tanpa asam",
    badges: ["K9–K24 · Pt600–1000", "Made in Japan"],
  },
];

function fileExists(src: string): boolean {
  return fs.existsSync(
    path.join(process.cwd(), "public", src.replace(/^\//, "")),
  );
}

function MachinePhoto({ src, alt }: { src: string; alt: string }) {
  if (fileExists(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-border/60 bg-surface">
      <svg
        className="h-8 w-8 text-gold/40"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a9 9 0 01-6.4-2.6L12 12V4m0 8h8"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6a3 3 0 100 6 3 3 0 000-6z"
        />
      </svg>
      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
        Foto alat menyusul
      </span>
    </div>
  );
}

export default function MesinPresisi() {
  return (
    <section className="relative overflow-hidden bg-surface-alt px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <span className="pointer-events-none absolute -right-8 -top-8 select-none font-serif text-[14rem] font-bold leading-none text-gold/[0.04]">
        02
      </span>
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Fasilitas Presisi
          </p>
          <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">
            Setiap Gram,{" "}
            <span className="gold-gradient-text">Tertimbang Akurat</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-text-muted">
            Setiap gram yang Anda bawa ditimbang presisi dan diuji kemurniannya
            dengan alat berstandar internasional — tanpa merusak, tanpa goresan.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MACHINES.map((m) => (
            <div
              key={m.src}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border/40">
                <MachinePhoto src={m.src} alt={m.name} />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-1.5">
                  {m.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-gold/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-dark"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 font-serif text-lg font-semibold text-text">
                  {m.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
