import { getAllGoldTypes, getFormattedTodayPrices, formatRupiah } from "@/lib/gold-api";
import AdminHargaClient from "./AdminHargaClient";

export default function AdminHargaPage() {
  const goldTypes = getAllGoldTypes();
  const prices = getFormattedTodayPrices();

  return <AdminHargaClient goldTypes={goldTypes} prices={prices} />;
}
