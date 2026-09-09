import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRole, requireRole } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const users = (data?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email,
      role: getUserRole(u) ?? "unassigned",
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
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;
    const { userId, role, email, password } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updates: Record<string, unknown> = {};

    if (email) updates.email = email;
    if (password && password.length >= 6) updates.password = password;
    if (role && ["admin", "cs"].includes(role)) {
      updates.app_metadata = { role };
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { error } = await supabase.auth.admin.updateUserById(userId, updates);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const validRole = role && ["admin", "cs"].includes(role) ? role : "cs";
    const supabase = createAdminClient();

    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: validRole },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
