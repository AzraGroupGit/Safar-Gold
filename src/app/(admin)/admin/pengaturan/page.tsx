import { getAllGoldTypes, getDb } from "@/lib/gold-api";
import type { AppSettingRow } from "@/lib/gold-api";
import AdminPengaturanClient from "./AdminPengaturanClient";

export default function AdminPengaturanPage() {
  const goldTypes = getAllGoldTypes();
  const db = getDb();
  const settings = db.prepare("SELECT * FROM app_settings").all() as AppSettingRow[];
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return <AdminPengaturanClient goldTypes={goldTypes} settings={settingsMap} />;
}
