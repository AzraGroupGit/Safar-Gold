import { NextResponse } from "next/server";
import {
  parseAdminUserCreateInput,
  parseAdminUserDeleteInput,
  parseAdminUserUpdateInput,
} from "@/lib/admin-input";
import { conflictError, internalServerError, validationError } from "@/lib/api-response";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRole, requireRole } from "@/lib/supabase/server-user";

export const dynamic = "force-dynamic";

function authErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  return typeof error.code === "string" ? error.code : null;
}

function authProviderError(context: string, error: unknown) {
  const code = authErrorCode(error);
  if (code === "email_exists" || code === "user_already_exists") {
    return conflictError("USER_ALREADY_EXISTS", "Email sudah digunakan");
  }
  if (code === "weak_password") {
    return validationError("Password tidak memenuhi kebijakan keamanan");
  }
  if (code === "user_not_found") {
    return NextResponse.json(
      { success: false, code: "USER_NOT_FOUND", error: "Pengguna tidak ditemukan" },
      { status: 404 },
    );
  }
  return internalServerError(context, error);
}

export async function GET() {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return authProviderError("users.list", error);
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
    return internalServerError("users.list", err);
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;
    const body = await request.json().catch(() => null);
    const parsed = parseAdminUserUpdateInput(body);
    if (!parsed.ok) return validationError(parsed.error);
    const { userId, role, email, password } = parsed.value;

    const supabase = createAdminClient();
    const updates: Record<string, unknown> = {};

    if (email !== undefined) updates.email = email;
    if (password !== undefined) updates.password = password;
    if (role !== undefined) updates.app_metadata = { role };

    const { error } = await supabase.auth.admin.updateUserById(userId, updates);

    if (error) {
      return authProviderError("users.update", error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("users.update", err);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;
    const body = await request.json().catch(() => null);
    const parsed = parseAdminUserCreateInput(body);
    if (!parsed.ok) return validationError(parsed.error);
    const { email, password, role } = parsed.value;
    const supabase = createAdminClient();

    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role },
    });

    if (error) {
      return authProviderError("users.create", error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("users.create", err);
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireRole("admin");
    if (!auth.ok) return auth.response;
    const body = await request.json().catch(() => null);
    const parsed = parseAdminUserDeleteInput(body);
    if (!parsed.ok) return validationError(parsed.error);
    const userId = parsed.value;

    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return authProviderError("users.delete", error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalServerError("users.delete", err);
  }
}
