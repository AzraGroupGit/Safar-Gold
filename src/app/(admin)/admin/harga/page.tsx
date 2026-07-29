import { getAllGoldTypes, getFormattedTodayPrices } from "@/lib/gold-api";
import AdminHargaClient from "./AdminHargaClient";

export const dynamic = "force-dynamic";

export default async function AdminHargaPage() {
  const goldTypes = await getAllGoldTypes();
  const prices = await getFormattedTodayPrices();

  return <AdminHargaClient goldTypes={goldTypes} prices={prices} />;
}
