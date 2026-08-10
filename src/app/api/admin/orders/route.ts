import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const today = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
  const adm = createAdminClient();

  const { data: orders, error } = await adm
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: orders ?? [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, customerName, customerPhone, items, notes, createdBy } = body;

    if (!type || !customerName || !customerPhone || !items?.length) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const adm = createAdminClient();

    const today = new Date().toISOString().split("T")[0];
    const { count } = await adm.from("orders").select("*", { count: "exact", head: true }).like("order_number", `SG-${today.replace(/-/g, "")}-%`);
    const seq = String((count ?? 0) + 1).padStart(3, "0");
    const orderNumber = `SG-${today.replace(/-/g, "")}-${seq}`;

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.priceTotal ?? 0;
    }

    const { data: order, error: orderErr } = await adm
      .from("orders")
      .insert({
        order_number: orderNumber,
        type,
        customer_name: customerName,
        customer_phone: customerPhone,
        subtotal,
        total: subtotal,
        notes: notes ?? null,
        created_by: createdBy,
      })
      .select("id")
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: orderErr?.message ?? "Gagal membuat order" }, { status: 500 });
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      gold_type_id: item.goldTypeId ?? null,
      item_name: item.itemName,
      weight: item.weight ?? 0,
      karat: item.karat ?? null,
      qty: item.qty ?? 1,
      price_per_gram: item.pricePerGram ?? 0,
      price_total: item.priceTotal ?? 0,
    }));

    const { error: itemsErr } = await adm.from("order_items").insert(orderItems);
    if (itemsErr) {
      await adm.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: itemsErr.message }, { status: 500 });
    }

    // Update stock
    for (const item of items) {
      if (!item.goldTypeId) continue;
      const qty = item.qty ?? 1;
      const { data: stockRow } = await adm.from("stock").select("qty").eq("gold_type_id", item.goldTypeId).maybeSingle();
      const current = stockRow?.qty ?? 0;

      if (type === "sell") {
        await adm.from("stock").upsert({ gold_type_id: item.goldTypeId, qty: Math.max(0, current - qty), updated_at: new Date().toISOString() });
        await adm.from("stock_movements").insert({ gold_type_id: item.goldTypeId, order_id: order.id, type: "out", qty, notes: `Order ${orderNumber} — Jual` });
      } else {
        await adm.from("stock").upsert({ gold_type_id: item.goldTypeId, qty: current + qty, updated_at: new Date().toISOString() });
        await adm.from("stock_movements").insert({ gold_type_id: item.goldTypeId, order_id: order.id, type: "in", qty, notes: `Order ${orderNumber} — Buyback` });
      }
    }

    const { data: fullOrder } = await adm.from("orders").select("*, order_items(*)").eq("id", order.id).single();

    return NextResponse.json({ success: true, order: fullOrder });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
