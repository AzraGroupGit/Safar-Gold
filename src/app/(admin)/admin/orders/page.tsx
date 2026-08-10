import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";
import { getFormattedTodayPrices, getAllGoldTypes } from "@/lib/gold-api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders — Safar Gold Admin" };

export default async function OrdersPage() {
  const [prices, goldTypes] = await Promise.all([getFormattedTodayPrices(), getAllGoldTypes()]);
  return <OrdersClient prices={prices} goldTypes={goldTypes} />;
}
