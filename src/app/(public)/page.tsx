import type { Metadata } from "next";
import Hero from "@/components/Hero";
import LivePriceBand from "@/components/LivePriceBand";
import Keunggulan from "@/components/Keunggulan";
import CaraTransaksi from "@/components/CaraTransaksi";
import Testimoni from "@/components/Testimoni";
import KunjungiKami from "@/components/KunjungiKami";
import FAQ from "@/components/FAQ";
import GoldDivider from "@/components/GoldDivider";
import LegalitasSection from "@/components/LegalitasSection";
import { getPublicSettings } from "@/lib/gold-api";

export const metadata: Metadata = {
  title: {
    absolute: "Safar Gold — Jual Beli Emas Terpercaya, Harga Real-time",
  },
};

// Selalu render dinamis agar konten hero terbaru dari DB langsung tampil
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getPublicSettings();

  return (
    <main>
      <Hero />
      <LivePriceBand />
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
      <FAQ phone={settings.phone} />
    </main>
  );
}
