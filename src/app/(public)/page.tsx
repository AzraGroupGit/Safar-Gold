import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Keunggulan from "@/components/Keunggulan";
import CaraTransaksi from "@/components/CaraTransaksi";
import Testimoni from "@/components/Testimoni";
import KunjungiKami from "@/components/KunjungiKami";
import FAQ from "@/components/FAQ";
import GoldDivider from "@/components/GoldDivider";
import LegalitasSection from "@/components/LegalitasSection";

export const metadata: Metadata = {
  title: {
    absolute: "Safar Gold — Jual Beli Emas Terpercaya, Harga Real-time",
  },
};

// Selalu render dinamis agar konten hero terbaru dari DB langsung tampil
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <GoldDivider />
      <Keunggulan />
      <GoldDivider />
      <CaraTransaksi />
      <GoldDivider />
      <Testimoni />
      <GoldDivider />
      <KunjungiKami />
      <GoldDivider />
      <LegalitasSection />
      <GoldDivider />
      <FAQ />
    </main>
  );
}
