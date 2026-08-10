import type { Metadata } from "next";
import StockClient from "./StockClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Stok — Safar Gold Admin" };

export default function StockPage() {
  return <StockClient />;
}
