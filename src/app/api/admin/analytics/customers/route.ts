import { NextResponse } from "next/server";
import { aggregateCustomerSources, type CustomerSourceOrder } from "@/lib/operational-analytics";
import type { AnalyticsGrain } from "@/lib/analytics";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const auth = await requireCapability("analytics:read");
  if (!auth.ok) return auth.response;
  const p = new URL(request.url).searchParams; const from = p.get("from") ?? ""; const to = p.get("to") ?? ""; const grain = (p.get("grain") ?? "day") as AnalyticsGrain;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || from > to || !["day", "week", "month"].includes(grain)) return NextResponse.json({ error: "Filter tidak valid" }, { status: 400 });
  const db = createAdminClient(); const { data, error } = await db.from("orders").select("customer_id, type, total, gp, source, created_at").eq("status", "completed").not("customer_id", "is", null).order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: aggregateCustomerSources(data as CustomerSourceOrder[], from, to, grain) });
}
