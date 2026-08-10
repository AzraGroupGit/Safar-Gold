import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const users = (data?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email,
      role: u.user_metadata?.role ?? "admin",
      lastSignIn: u.last_sign_in_at,
      createdAt: u.created_at,
    }));

    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role || !["admin", "cs"].includes(role)) {
      return NextResponse.json({ error: "Invalid userId or role" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
