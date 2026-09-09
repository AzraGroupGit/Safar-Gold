import { NextRequest, NextResponse } from "next/server";
import { deleteGoldType } from "@/lib/gold-api";
import { requireRole } from "@/lib/supabase/server-user";

export async function DELETE(request: NextRequest) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    await deleteGoldType(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
