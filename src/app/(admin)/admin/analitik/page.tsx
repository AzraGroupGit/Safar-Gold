import type { Metadata } from "next";
import { Suspense } from "react";
import AnalyticsClient from "./AnalyticsClient";
import { hasCapability } from "@/lib/permissions";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analitik — Safar Gold Admin" };

export default async function AnalyticsPage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");
  if (!hasCapability(getUserRole(user), "analytics:read")) redirect("/admin");
  return <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-white" aria-label="Memuat analitik" />}><AnalyticsClient /></Suspense>;
}
