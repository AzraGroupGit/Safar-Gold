import { NextResponse } from "next/server";
import { parseGoldTypeDeleteInput } from "@/lib/admin-input";
import { conflictError, internalServerError, validationError } from "@/lib/api-response";
import { deleteGoldType } from "@/lib/gold-api";
import { requireRole } from "@/lib/supabase/server-user";

export async function DELETE(request: Request) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json().catch(() => null);
    const parsed = parseGoldTypeDeleteInput(body);
    if (!parsed.ok) return validationError(parsed.error);
    await deleteGoldType(parsed.value);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "23503"
    ) {
      return conflictError(
        "GOLD_TYPE_IN_USE",
        "Jenis emas tidak dapat dihapus karena masih digunakan",
      );
    }
    return internalServerError("gold-types.delete", err);
  }
}
