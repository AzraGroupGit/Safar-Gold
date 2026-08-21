import type { Metadata } from "next";
import StockClient from "./StockClient";
import { getAllGoldTypes } from "@/lib/gold-api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Stok — Safar Gold Admin" };

export default async function StockPage() {
  const goldTypes = await getAllGoldTypes();
  return <StockClient goldTypes={goldTypes} />;
}
