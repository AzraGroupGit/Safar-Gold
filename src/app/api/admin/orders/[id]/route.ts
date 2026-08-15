import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertCustomerByPhone } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adm = createAdminClient();
  const { data, error } = await adm.from("orders").select("*, order_items(*)").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ order: data });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adm = createAdminClient();

  // Pastikan order ada & belum cancelled
  const { data: order } = await adm.from("orders").select("id, status").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "cancelled") return NextResponse.json({ success: true });

  // Reverse stock movements — kembalikan stok ke kondisi pra-order
  const { data: movements } = await adm.from("stock_movements").select("*").eq("order_id", id);
  for (const mv of movements ?? []) {
    const reverseType = mv.type === "in" ? "out" : "in";
    const { data: stockRow } = await adm.from("stock").select("qty").eq("gold_type_id", mv.gold_type_id).maybeSingle();
    const current = stockRow?.qty ?? 0;
    const newQty = reverseType === "in" ? current + mv.qty : Math.max(0, current - mv.qty);
    await adm.from("stock").upsert({ gold_type_id: mv.gold_type_id, qty: newQty, updated_at: new Date().toISOString() });
  }
  await adm.from("stock_movements").delete().eq("order_id", id);

  const { error } = await adm.from("orders").update({ status: "cancelled" }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { customerName, customerPhone, type, items, source, nik, address, kelurahan, kecamatan, kabupaten, provinsi, instagram } = await request.json();

  if (!customerName || !customerPhone || !items?.length) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const adm = createAdminClient();

  // Get existing order to find old items for stock reversal
  const { data: oldOrder } = await adm.from("orders").select("*, order_items(*)").eq("id", id).single();
  if (!oldOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Reverse old stock movements
  const oldMovements = await adm.from("stock_movements").select("*").eq("order_id", id);
  for (const mv of oldMovements.data ?? []) {
    const reverseType = mv.type === "in" ? "out" : "in";
    const { data: stockRow } = await adm.from("stock").select("qty").eq("gold_type_id", mv.gold_type_id).maybeSingle();
    const current = stockRow?.qty ?? 0;
    const newQty = reverseType === "in" ? current + mv.qty : Math.max(0, current - mv.qty);
    await adm.from("stock").upsert({ gold_type_id: mv.gold_type_id, qty: newQty, updated_at: new Date().toISOString() });
  }
  await adm.from("stock_movements").delete().eq("order_id", id);

  // Update order
  const subtotal = items.reduce((s: number, it: any) => s + (it.priceTotal ?? 0), 0);
  await adm.from("orders").update({
    customer_name: customerName,
    customer_phone: customerPhone,
    type,
    subtotal,
    total: subtotal,
    source: source ?? null,
    nik: nik ?? null,
    address: address ?? null,
    kelurahan: kelurahan ?? null,
    kecamatan: kecamatan ?? null,
    kabupaten: kabupaten ?? null,
    provinsi: provinsi ?? null,
    instagram: instagram ?? null,
  }).eq("id", id);

  // Replace items
  await adm.from("order_items").delete().eq("order_id", id);
  const newItems = items.map((it: any) => ({
    order_id: id,
    gold_type_id: it.goldTypeId ?? null,
    item_name: it.itemName,
    weight: it.weight ?? 0,
    karat: it.karat ?? null,
    qty: it.qty ?? 1,
    price_per_gram: it.pricePerGram ?? 0,
    price_total: it.priceTotal ?? 0,
  }));
  await adm.from("order_items").insert(newItems);

  // Apply new stock movements
  for (const item of items) {
    if (!item.goldTypeId) continue;
    const qty = item.qty ?? 1;
    const { data: stockRow } = await adm.from("stock").select("qty").eq("gold_type_id", item.goldTypeId).maybeSingle();
    const current = stockRow?.qty ?? 0;

    if (type === "sell") {
      await adm.from("stock").upsert({ gold_type_id: item.goldTypeId, qty: Math.max(0, current - qty), updated_at: new Date().toISOString() });
      await adm.from("stock_movements").insert({ gold_type_id: item.goldTypeId, order_id: id, type: "out", qty, notes: `Order #${id.slice(0,8)} — Jual (edited)` });
    } else {
      await adm.from("stock").upsert({ gold_type_id: item.goldTypeId, qty: current + qty, updated_at: new Date().toISOString() });
      await adm.from("stock_movements").insert({ gold_type_id: item.goldTypeId, order_id: id, type: "in", qty, notes: `Order #${id.slice(0,8)} — Buyback (edited)` });
    }
  }

  const { data: updated } = await adm.from("orders").select("*, order_items(*)").eq("id", id).single();

  // Upsert customer master + relink; bersihkan customer yatim jika phone berubah
  const customerId = await upsertCustomerByPhone({
    name: customerName,
    phone: customerPhone,
    nik, source, address, kelurahan, kecamatan, kabupaten, provinsi, instagram,
  });
  if (customerId) {
    const oldCustomerId = oldOrder.customer_id ?? null;
    if (oldCustomerId && oldCustomerId !== customerId) {
      const { count } = await adm.from("orders").select("*", { count: "exact", head: true }).eq("customer_id", oldCustomerId);
      if ((count ?? 0) === 0) {
        await adm.from("customers").delete().eq("id", oldCustomerId);
      }
    }
    await adm.from("orders").update({ customer_id: customerId }).eq("id", id);
  }

  // Pastikan invoice_number terisi (misalnya order lama sebelum fitur invoice ada)
  if (updated && !updated.invoice_number) {
    const today = new Date().toISOString().split("T")[0];
    const invPrefix = updated.type === "sell" ? "J" : "BB";
    const invPattern = `${invPrefix}-${today.replace(/-/g, "")}-%`;
    const { count: invCount } = await adm.from("orders").select("*", { count: "exact", head: true }).like("invoice_number", invPattern);
    const invSeq = String((invCount ?? 0) + 1).padStart(3, "0");
    const invoiceNumber = `${invPrefix}-${today.replace(/-/g, "")}-${invSeq}`;
    const invoiceType = updated.type === "sell" ? "jual" : "buyback";
    await adm.from("orders").update({ invoice_number: invoiceNumber, invoice_type: invoiceType }).eq("id", id);
    updated.invoice_number = invoiceNumber;
    updated.invoice_type = invoiceType;
  }

  return NextResponse.json({ success: true, order: updated });
}
