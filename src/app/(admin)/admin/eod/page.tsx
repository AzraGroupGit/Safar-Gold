import type { Metadata } from "next";
import EODClient from "./EODClient";
import { hasCapability } from "@/lib/permissions";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "EOD — Safar Gold Admin" };

export default async function EODPage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");
  if (!hasCapability(getUserRole(user), "eod:read")) redirect("/admin");
  return <EODClient />;
}
