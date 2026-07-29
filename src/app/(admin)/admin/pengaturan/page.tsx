import { getAllGoldTypes } from "@/lib/gold-api";
import { createClient } from "@/lib/supabase/server";
import AdminPengaturanClient from "./AdminPengaturanClient";

export const dynamic = "force-dynamic";

export default async function AdminPengaturanPage() {
  const goldTypes = await getAllGoldTypes();
  const supabase = await createClient();
  const { data } = await supabase.from("app_settings").select("key, value");
  const settingsMap = Object.fromEntries(
    (data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
  );

  return <AdminPengaturanClient goldTypes={goldTypes} settings={settingsMap} />;
}
