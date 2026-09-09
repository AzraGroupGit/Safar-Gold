import { getPublicSettings } from "@/lib/gold-api";
import { createAdminClient } from "@/lib/supabase/admin";
import OrderInvoice, { type InvoiceOrder } from "@/components/OrderInvoice";
import { canAccessOrder, redactOrderForRole } from "@/lib/permissions";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");
  const role = getUserRole(user);
  const { id } = await params;
  const adm = createAdminClient();
  const { data: order } = await adm
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single<InvoiceOrder>();

  if (!order || !canAccessOrder(role, user.id, (order as InvoiceOrder & { created_by?: string | null }).created_by ?? null)) {
    redirect("/admin/orders");
  }

  const createdBy = (order as InvoiceOrder & { created_by?: string | null }).created_by;
  const [{ data: creator }, settings] = await Promise.all([
    createdBy
      ? adm.from("user_profiles").select("name, signature").eq("user_id", createdBy).maybeSingle()
      : Promise.resolve({ data: null }),
    getPublicSettings(),
  ]);

  const safeOrder = redactOrderForRole(order as unknown as Record<string, unknown>, role) as unknown as InvoiceOrder;
  return <OrderInvoice order={safeOrder} settings={settings} creator={creator ?? null} />;
}
