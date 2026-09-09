import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/gold-api";
import { hasCapability, redactCustomerForRole } from "@/lib/permissions";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireCapability("customers:read-own");
  if (!auth.ok) return auth.response;
  const adm = createAdminClient();
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const canReadAny = hasCapability(auth.role, "customers:read-any");
  let ordersQuery = adm
    .from("orders")
    .select("customer_id, total, created_at")
    .not("customer_id", "is", null);
  if (!canReadAny) ordersQuery = ordersQuery.eq("created_by", auth.user.id);
  const ordersRes = await ordersQuery;
  if (ordersRes.error) {
    return NextResponse.json({ error: ordersRes.error.message }, { status: 500 });
  }

  const customerIds = Array.from(new Set((ordersRes.data ?? []).map((order) => order.customer_id)));
  const customersRes = canReadAny
    ? await adm.from("customers").select("*").order("created_at", { ascending: false })
    : customerIds.length > 0
      ? await adm.from("customers").select("*").in("id", customerIds).order("created_at", { ascending: false })
      : { data: [], error: null };

  if (customersRes.error) {
    return NextResponse.json({ error: customersRes.error.message }, { status: 500 });
  }

  // Aggregate orders by customer_id
  const agg = new Map<string, { count: number; total: number; last: string }>();
  for (const o of ordersRes.data ?? []) {
    const key = o.customer_id;
    if (!agg.has(key)) agg.set(key, { count: 0, total: 0, last: o.created_at });
    const a = agg.get(key)!;
    a.count += 1;
    a.total += o.total ?? 0;
    if (o.created_at > a.last) a.last = o.created_at;
  }

  let customers = (customersRes.data ?? []).map((c) => {
    const a = agg.get(c.id) ?? { count: 0, total: 0, last: null };
    const customer = {
      id: c.id,
      name: c.name,
      phone: c.phone,
      nik: c.nik,
      source: c.source,
      address: c.address,
      kelurahan: c.kelurahan,
      kecamatan: c.kecamatan,
      kabupaten: c.kabupaten,
      provinsi: c.provinsi,
      instagram: c.instagram,
      created_at: c.created_at,
      order_count: a.count,
      total_spent: a.total,
      last_order_at: a.last,
    };
    return redactCustomerForRole(customer, auth.role);
  });

  if (q) {
    customers = customers.filter((c) =>
      (c.name ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q) ||
      (c.nik ?? "").toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ customers, scope: canReadAny ? "all" : "own" });
}

// POST: buat/update customer langsung (opsional, dipakai via order flow)
export async function POST(request: Request) {
  const auth = await requireCapability("customers:manage");
  if (!auth.ok) return auth.response;
  const adm = createAdminClient();
  const body = await request.json();
  const phone = normalizePhone(body.phone ?? "");
  if (!phone) return NextResponse.json({ error: "Phone wajib" }, { status: 400 });

  const fields = {
    name: body.name ?? "",
    phone,
    nik: body.nik ?? null,
    source: body.source ?? null,
    address: body.address ?? null,
    kelurahan: body.kelurahan ?? null,
    kecamatan: body.kecamatan ?? null,
    kabupaten: body.kabupaten ?? null,
    provinsi: body.provinsi ?? null,
    instagram: body.instagram ?? null,
  };

  const { data: existing } = await adm.from("customers").select("id").eq("phone", phone).maybeSingle();
  if (existing) {
    await adm.from("customers").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", existing.id);
    return NextResponse.json({ success: true, customer: { id: existing.id, ...fields } });
  }

  const { data: created, error } = await adm.from("customers").insert(fields).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, customer: created });
}
