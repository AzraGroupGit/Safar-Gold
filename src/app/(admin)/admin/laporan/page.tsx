import type { Metadata } from "next";
import LaporanClient from "./LaporanClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Laporan — Safar Gold Admin" };

export default function LaporanPage() {
  return <LaporanClient />;
}
