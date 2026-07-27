import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Keunggulan from "@/components/Keunggulan";
import CaraTransaksi from "@/components/CaraTransaksi";
import Testimoni from "@/components/Testimoni";
import KunjungiKami from "@/components/KunjungiKami";
import FAQ from "@/components/FAQ";
import GoldDivider from "@/components/GoldDivider";

export const metadata: Metadata = { title: "Beranda" };

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
      <FAQ />
    </main>
  );
}
