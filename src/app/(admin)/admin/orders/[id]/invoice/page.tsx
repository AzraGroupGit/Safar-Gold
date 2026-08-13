import { getPublicSettings } from "@/lib/gold-api";
import { createAdminClient } from "@/lib/supabase/admin";
import OrderInvoice, { type InvoiceOrder } from "@/components/OrderInvoice";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adm = createAdminClient();
  const { data: order } = await adm
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single<InvoiceOrder>();

  if (!order) {
    return <p className="p-8 text-center text-text-muted">Invoice tidak ditemukan.</p>;
  }

  const settings = await getPublicSettings();

  return <OrderInvoice order={order} settings={settings} />;
}
