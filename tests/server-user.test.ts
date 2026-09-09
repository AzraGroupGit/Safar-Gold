import { describe, expect, it } from "vitest";
import { getUserRole, isRoleAllowed } from "../src/lib/supabase/server-user";

describe("getUserRole", () => {
  it("does not trust an application role stored in user metadata", () => {
    expect(getUserRole({
      app_metadata: { role: "authenticated" },
      user_metadata: { role: "Admin" },
    })).toBeNull();
  });

  it("prefers a valid app metadata role", () => {
    expect(getUserRole({
      app_metadata: { role: "cs" },
      user_metadata: { role: "admin" },
    })).toBe("cs");
  });

  it("does not grant access when neither metadata source has an application role", () => {
    expect(getUserRole({
      app_metadata: { role: "authenticated" },
      user_metadata: {},
    })).toBeNull();
  });
});

describe("isRoleAllowed", () => {
  it("allows only roles included in the policy", () => {
    expect(isRoleAllowed("admin", ["admin"])).toBe(true);
    expect(isRoleAllowed("cs", ["admin", "cs"])).toBe(true);
    expect(isRoleAllowed("cs", ["admin"])).toBe(false);
  });

  it("fails closed for an account without an application role", () => {
    expect(isRoleAllowed(null, ["admin", "cs"])).toBe(false);
  });
});
