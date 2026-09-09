import type { Metadata } from "next";
import PelangganClient from "./PelangganClient";
import { getPublicSettings } from "@/lib/gold-api";
import { hasCapability } from "@/lib/permissions";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pelanggan — Safar Gold Admin" };

export default async function PelangganPage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");
  if (!hasCapability(getUserRole(user), "customers:read-own")) redirect("/admin");
  const settings = await getPublicSettings();
  return <PelangganClient settings={settings} />;
}
