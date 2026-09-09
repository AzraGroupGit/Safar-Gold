import type { Metadata } from "next";
import LaporanClient from "./LaporanClient";
import { hasCapability } from "@/lib/permissions";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Laporan — Safar Gold Admin" };

export default async function LaporanPage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");
  if (!hasCapability(getUserRole(user), "reports:read-all")) redirect("/admin");
  return <LaporanClient />;
}
