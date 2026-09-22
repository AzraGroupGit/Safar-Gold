import { NextResponse } from "next/server";
import { parseEodDate } from "@/lib/admin-input";
import { internalServerError, validationError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

type EodOrderItem = { gold_type_id: string | null; price_total: number; qty: number };
type EodOrder = { type: string; total: number; order_items: EodOrderItem[] | null };
type GoldTypeCat = { id: string; category: string };
type StockSnapshotRow = {
  gold_type_id: string;
  qty: number;
  min_qty: number;
  gold_types: { name: string } | null;
};

function wibDateStr(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export async function GET() {
  const auth = await requireCapability("eod:read");
  if (!auth.ok) return auth.response;
  try {
    const adm = createAdminClient();
    const { data, error } = await adm
      .from("eod_reports")
      .select("*")
      .order("date", { ascending: false });

    if (error) return internalServerError("reports.eod.list", error);

    return NextResponse.json({ eods: data ?? [] });
  } catch (error) {
    return internalServerError("reports.eod.list", error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireCapability("eod:generate");
    if (!auth.ok) return auth.response;
    const rawBody = await request.text();
    let body: unknown = {};
    if (rawBody.trim()) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        return validationError("Payload EOD tidak valid");
      }
    }
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return validationError("Payload EOD tidak valid");
    }
    const parsedDate = parseEodDate(
      (body as Record<string, unknown>).date ?? wibDateStr(),
    );
    if (!parsedDate.ok) return validationError(parsedDate.error);
    const date = parsedDate.value;

    const adm = createAdminClient();

    // Guard: EOD untuk tanggal ini sudah ada?
    const { data: existing, error: existingError } = await adm
      .from("eod_reports")
      .select("*")
      .eq("date", date)
      .maybeSingle();
    if (existingError) return internalServerError("reports.eod.lookup", existingError);
    if (existing && !existing.is_stale) return NextResponse.json({ exists: true, eod: existing });

    // Rentang WIB untuk tanggal tsb
    const start = new Date(`${date}T00:00:00+07:00`);
    const end = new Date(`${date}T23:59:59.999+07:00`);

    const { data: orders, error: ordersError } = await adm
      .from("orders")
      .select("*, order_items(*)")
      .eq("status", "completed")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());
    if (ordersError) return internalServerError("reports.eod.orders", ordersError);

    const allOrders = (orders ?? []) as EodOrder[];
    const jual = allOrders.filter((o) => o.type === "sell");
    const buyback = allOrders.filter((o) => o.type === "buyback");

    const totalJual = jual.reduce((s, o) => s + o.total, 0);
    const totalBuyback = buyback.reduce((s, o) => s + o.total, 0);
    const totalJualItems = jual.reduce((s, o) => s + (o.order_items ?? []).reduce((si, it) => si + it.qty, 0), 0);
    const totalBuybackItems = buyback.reduce((s, o) => s + (o.order_items ?? []).reduce((si, it) => si + it.qty, 0), 0);

    // Kategori per gold_type (untuk breakdown buyback)
    const { data: goldTypes, error: goldTypesError } = await adm
      .from("gold_types")
      .select("id, category");
    if (goldTypesError) return internalServerError("reports.eod.gold-types", goldTypesError);
    const catMap = new Map((goldTypes ?? ([] as GoldTypeCat[])).map((g) => [g.id, g.category]));

    const breakdown = {
      jualLM: { total: totalJual, items: totalJualItems },
      buybackLM: { total: 0, items: 0 },
      buybackPerhiasan: { total: 0, items: 0 },
      buybackLogam: { total: 0, items: 0 },
    };
    for (const o of buyback) {
      for (const it of o.order_items ?? []) {
        const cat = catMap.get(it.gold_type_id ?? "") ?? "";
        const key =
          cat === "bb-perhiasan" ? "buybackPerhiasan"
          : cat === "bb-logam" ? "buybackLogam"
          : "buybackLM";
        breakdown[key].total += it.price_total;
        breakdown[key].items += it.qty;
      }
    }

    // Snapshot stok
    const { data: stock, error: stockError } = await adm
      .from("stock")
      .select("gold_type_id, qty, min_qty, gold_types:gold_type_id(name)");
    if (stockError) return internalServerError("reports.eod.stock", stockError);
    const stockSnapshot = ((stock ?? []) as unknown as StockSnapshotRow[]).map((s) => ({
      gold_type_id: s.gold_type_id,
      name: s.gold_types?.name ?? s.gold_type_id,
      qty: s.qty,
      min_qty: s.min_qty,
    }));

    const report = {
      date,
      total_orders: allOrders.length,
      total_jual_orders: jual.length,
      total_buyback_orders: buyback.length,
      total_jual: totalJual,
      total_buyback: totalBuyback,
      total_jual_items: totalJualItems,
      total_buyback_items: totalBuybackItems,
      net: totalJual - totalBuyback,
      breakdown,
      stock_snapshot: stockSnapshot,
      generated_by: auth.user.id,
      generated_at: new Date().toISOString(),
      is_stale: false,
      stale_at: null,
    };
    const query = existing
      ? adm.from("eod_reports").update(report).eq("id", existing.id)
      : adm.from("eod_reports").insert(report);
    const { data: eod, error: insErr } = await query.select("*").single();

    if (insErr) return internalServerError("reports.eod.save", insErr);

    return NextResponse.json({ success: true, eod });
  } catch (err) {
    return internalServerError("reports.eod.generate", err);
  }
}
