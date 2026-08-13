import type { Metadata } from "next";
import PelangganClient from "./PelangganClient";
import { getPublicSettings } from "@/lib/gold-api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pelanggan — Safar Gold Admin" };

export default async function PelangganPage() {
  const settings = await getPublicSettings();
  return <PelangganClient settings={settings} />;
}
