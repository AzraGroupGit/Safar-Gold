import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  requireRole: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.createAdminClient }));
vi.mock("@/lib/supabase/server-user", () => ({
  getUserRole: vi.fn(() => "cs"),
  requireRole: mocks.requireRole,
}));

import {
  DELETE as deleteUser,
  GET as listUsers,
  POST as createUser,
  PUT as updateUser,
} from "../src/app/api/admin/users/route";

const adminAuth = {
  ok: true as const,
  role: "admin" as const,
  user: { id: "f9319552-6581-494b-bddf-bfbd3d44200c" },
};
const userId = "7b4e42e2-3530-4f7b-a48a-fb224042a73b";

function jsonRequest(method: string, body: unknown) {
  return new Request("http://localhost/api/admin/users", {
    method,
    body: JSON.stringify(body),
  });
}

describe("admin user API validation and safe errors", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((mock) => mock.mockReset());
    mocks.requireRole.mockResolvedValue(adminAuth);
  });

  it("rejects malformed create JSON before creating an auth client", async () => {
    const response = await createUser(new Request("http://localhost/api/admin/users", {
      method: "POST",
      body: "{invalid",
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
    });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it.each([
    { email: "bukan-email", password: "rahasia", role: "cs" },
    { email: "cs@safargold.com", password: "12345", role: "cs" },
    { email: "cs@safargold.com", password: "rahasia", role: "owner" },
  ])("rejects an invalid create payload %#", async (payload) => {
    const response = await createUser(jsonRequest("POST", payload));

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("normalizes a valid email and defaults a missing role to CS", async () => {
    const create = vi.fn().mockResolvedValue({ error: null });
    mocks.createAdminClient.mockReturnValue({ auth: { admin: { createUser: create } } });

    const response = await createUser(jsonRequest("POST", {
      email: "  CS@SafarGold.com ",
      password: "rahasia",
    }));

    expect(response.status).toBe(200);
    expect(create).toHaveBeenCalledWith({
      email: "cs@safargold.com",
      password: "rahasia",
      email_confirm: true,
      app_metadata: { role: "cs" },
    });
  });

  it.each([
    { userId: "invalid", role: "cs" },
    { userId, email: "invalid" },
    { userId, password: "short" },
    { userId, role: "owner" },
    { userId },
  ])("rejects an invalid update payload %#", async (payload) => {
    const response = await updateUser(jsonRequest("PUT", payload));

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("updates only validated fields", async () => {
    const update = vi.fn().mockResolvedValue({ error: null });
    mocks.createAdminClient.mockReturnValue({ auth: { admin: { updateUserById: update } } });

    const response = await updateUser(jsonRequest("PUT", {
      userId,
      email: " ADMIN@SafarGold.com ",
      role: "admin",
      unexpected: "ignored",
    }));

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith(userId, {
      email: "admin@safargold.com",
      app_metadata: { role: "admin" },
    });
  });

  it("rejects an invalid delete user ID", async () => {
    const response = await deleteUser(jsonRequest("DELETE", { userId: "not-a-uuid" }));

    expect(response.status).toBe(400);
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  it("returns a stable conflict when an email already exists", async () => {
    const create = vi.fn().mockResolvedValue({
      error: { code: "email_exists", message: "provider detail: user exists" },
    });
    mocks.createAdminClient.mockReturnValue({ auth: { admin: { createUser: create } } });

    const response = await createUser(jsonRequest("POST", {
      email: "cs@safargold.com",
      password: "rahasia",
      role: "cs",
    }));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      success: false,
      code: "USER_ALREADY_EXISTS",
      error: "Email sudah digunakan",
    });
  });

  it("does not expose provider details when listing users fails", async () => {
    mocks.createAdminClient.mockReturnValue({
      auth: { admin: { listUsers: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "service role key leaked" },
      }) } },
    });
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await listUsers();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      code: "INTERNAL_ERROR",
      error: "Terjadi kesalahan pada server",
    });
    expect(JSON.stringify(body)).not.toContain("service role key leaked");
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("service role key leaked");
  });

  it("does not expose thrown provider details when deleting a user fails", async () => {
    mocks.createAdminClient.mockImplementation(() => {
      throw new Error("private auth configuration");
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await deleteUser(jsonRequest("DELETE", { userId }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(JSON.stringify(body)).not.toContain("private auth configuration");
    expect(body).toMatchObject({ success: false, code: "INTERNAL_ERROR" });
  });
});
