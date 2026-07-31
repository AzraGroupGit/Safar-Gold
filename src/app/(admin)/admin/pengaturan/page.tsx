import { getAllGoldTypes } from "@/lib/gold-api";
import { createAnonClient } from "@/lib/supabase/anon";
import AdminPengaturanClient from "./AdminPengaturanClient";

export const dynamic = "force-dynamic";

export default async function AdminPengaturanPage() {
  const goldTypes = await getAllGoldTypes();
  const supabase = createAnonClient();
  const { data } = await supabase.from("app_settings").select("key, value");
  const settingsMap = Object.fromEntries(
    (data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
  );

  return <AdminPengaturanClient goldTypes={goldTypes} settings={settingsMap} />;
}
