import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ profile: null });

  const adm = createAdminClient();
  const { data } = await adm
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return NextResponse.json({ profile: data ?? null });
}

export async function PUT(request: Request) {
  try {
    const { userId, name, signature } = await request.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const adm = createAdminClient();
    const { error } = await adm.from("user_profiles").upsert({
      user_id: userId,
      name: name ?? null,
      signature: signature ?? null,
      updated_at: new Date().toISOString(),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
