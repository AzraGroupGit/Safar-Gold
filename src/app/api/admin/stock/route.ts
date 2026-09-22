import { NextResponse } from "next/server";
import { internalServerError, logInternalError, validationError } from "@/lib/api-response";
import { parseStockRange } from "@/lib/stock-adjustment";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireCapability("stock:read");
  if (!auth.ok) return auth.response;
  const { searchParams } = new URL(request.url);
  let range;
  try {
    range = parseStockRange(searchParams.get("range") ?? "all");
  } catch (error) {
    return validationError(error instanceof Error ? error.message : "Rentang stok tidak valid");
  }
  const adm = createAdminClient();

  try {
    const [stockRes, salesRes] = await Promise.all([
      adm
        .from("stock")
        .select("*, gold_types:gold_type_id(name, weight, category)")
        .order("gold_type_id"),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/admin/stock/sales-summary?range=${range}`, {
        headers: { "Content-Type": "application/json", cookie: request.headers.get("cookie") ?? "" },
        cache: "no-store",
      }).then((response) => {
        if (!response.ok) throw new Error("Stock sales summary request failed");
        return response.json();
      }).catch((error) => {
        logInternalError("stock.sales-summary-enrichment", error);
        return { summary: {} };
      }),
    ]);

    const { data: stock, error: stockErr } = stockRes;
    const salesSummary = salesRes.summary ?? {};

    if (stockErr) return internalServerError("stock.list", stockErr);

    const enrichedStock = (stock ?? []).map((s) => ({
      ...s,
      total_weight_sold: salesSummary[`${s.gold_type_id}|${s.brand ?? ""}`]?.total_weight_sold ??
        salesSummary[s.gold_type_id]?.total_weight_sold ??
        0,
      total_revenue: salesSummary[`${s.gold_type_id}|${s.brand ?? ""}`]?.total_revenue ??
        salesSummary[s.gold_type_id]?.total_revenue ??
        0,
    }));

    return NextResponse.json({ stock: enrichedStock, range });
  } catch (error) {
    return internalServerError("stock.list", error);
  }
}
