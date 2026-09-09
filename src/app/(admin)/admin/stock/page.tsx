import type { Metadata } from "next";
import StockClient from "./StockClient";
import { getAllGoldTypes } from "@/lib/gold-api";
import { hasCapability } from "@/lib/permissions";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Stok — Safar Gold Admin" };

export default async function StockPage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");
  const role = getUserRole(user);
  if (!hasCapability(role, "stock:read")) redirect("/admin");
  const goldTypes = await getAllGoldTypes();
  return <StockClient goldTypes={goldTypes} canManage={hasCapability(role, "stock:manage")} />;
}
