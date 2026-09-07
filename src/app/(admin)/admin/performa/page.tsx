import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canViewOwnCsPerformance } from "@/lib/cs-performance";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import CsPerformanceClient from "./CsPerformanceClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Performa Saya — Safar Gold Admin" };

export default async function CsPerformancePage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");
  if (!canViewOwnCsPerformance(getUserRole(user))) redirect("/admin");
  return <CsPerformanceClient />;
}

