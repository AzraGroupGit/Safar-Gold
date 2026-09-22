import { NextResponse } from "next/server";
import { internalServerError, logInternalError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCapability } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireCapability("stock:manage");
  if (!auth.ok) return auth.response;
  const adm = createAdminClient();
  try {
    const { data, error } = await adm
      .from("stock_movements")
      .select("*, gold_types:gold_type_id(name)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) return internalServerError("stock.movements", error);

    const actorIds = Array.from(new Set((data ?? []).map(movement => movement.created_by).filter((id): id is string => Boolean(id))));
    const actorEntries = await Promise.all(actorIds.map(async id => {
      try {
        const { data: actor, error: actorError } = await adm.auth.admin.getUserById(id);
        if (actorError) logInternalError("stock.movements.actor", actorError);
        return [id, actor.user?.email ?? "Pengguna tidak aktif"] as const;
      } catch (error) {
        logInternalError("stock.movements.actor", error);
        return [id, "Pengguna tidak aktif"] as const;
      }
    }));
    const actorMap = new Map(actorEntries);
    return NextResponse.json({ movements: (data ?? []).map(movement => ({ ...movement, actor_email: movement.created_by ? actorMap.get(movement.created_by) ?? null : null })) });
  } catch (error) {
    return internalServerError("stock.movements", error);
  }
}
