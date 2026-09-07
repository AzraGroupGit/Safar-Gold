import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerUser, getUserRole } from "@/lib/supabase/server-user";
import { canManageStock } from "@/lib/stock-adjustment";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageStock(getUserRole(user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const adm = createAdminClient();
  const { data, error } = await adm
    .from("stock_movements")
    .select("*, gold_types:gold_type_id(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const actorIds = Array.from(new Set((data ?? []).map(movement => movement.created_by).filter((id): id is string => Boolean(id))));
  const actorEntries = await Promise.all(actorIds.map(async id => {
    const { data: actor } = await adm.auth.admin.getUserById(id);
    return [id, actor.user?.email ?? "Pengguna tidak aktif"] as const;
  }));
  const actorMap = new Map(actorEntries);
  return NextResponse.json({ movements: (data ?? []).map(movement => ({ ...movement, actor_email: movement.created_by ? actorMap.get(movement.created_by) ?? null : null })) });
}
