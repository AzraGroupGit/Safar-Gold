import { describe, expect, it } from "vitest";
import {
  canAccessOrder,
  canManageOrder,
  hasCapability,
  normalizeAppRole,
  protectOrderGp,
  redactCustomerForRole,
  redactOrderForRole,
  requiredCapabilityForAdminPage,
} from "../src/lib/permissions";

describe("role capabilities", () => {
  it("normalizes only supported roles and fails closed", () => {
    expect(normalizeAppRole(" Admin ")).toBe("admin");
    expect(normalizeAppRole("CS")).toBe("cs");
    expect(normalizeAppRole("authenticated")).toBeNull();
    expect(normalizeAppRole(undefined)).toBeNull();
  });

  it("gives CS operational read access without administrative mutations", () => {
    expect(hasCapability("cs", "orders:create")).toBe(true);
    expect(hasCapability("cs", "stock:read")).toBe(true);
    expect(hasCapability("cs", "stock:manage")).toBe(false);
    expect(hasCapability("cs", "eod:read")).toBe(false);
    expect(hasCapability("cs", "reports:read-all")).toBe(false);
    expect(hasCapability("cs", "analytics:read")).toBe(false);
  });

  it("gives admins business-wide access", () => {
    expect(hasCapability("admin", "orders:read-any")).toBe(true);
    expect(hasCapability("admin", "orders:view-gp")).toBe(true);
    expect(hasCapability("admin", "stock:manage")).toBe(true);
    expect(hasCapability("admin", "eod:generate")).toBe(true);
    expect(hasCapability("admin", "analytics:read")).toBe(true);
  });
});

describe("page capability routing", () => {
  it("maps role-sensitive pages to the same capability policy", () => {
    expect(requiredCapabilityForAdminPage("/admin/orders/123/invoice")).toBe("orders:read-own");
    expect(requiredCapabilityForAdminPage("/admin/stock")).toBe("stock:read");
    expect(requiredCapabilityForAdminPage("/admin/eod")).toBe("eod:read");
    expect(requiredCapabilityForAdminPage("/admin/laporan")).toBe("reports:read-all");
    expect(requiredCapabilityForAdminPage("/admin/analitik?tab=stock")).toBe("analytics:read");
    expect(requiredCapabilityForAdminPage("/admin/jenis-emas")).toBe("system:manage");
    expect(requiredCapabilityForAdminPage("/admin")).toBe("dashboard:view");
  });
});

describe("order authorization", () => {
  it("allows admins to access any order and CS only their own", () => {
    expect(canAccessOrder("admin", "admin-1", "cs-2")).toBe(true);
    expect(canAccessOrder("cs", "cs-1", "cs-1")).toBe(true);
    expect(canAccessOrder("cs", "cs-1", "cs-2")).toBe(false);
    expect(canAccessOrder("cs", "cs-1", null)).toBe(false);
    expect(canAccessOrder(null, "user-1", "user-1")).toBe(false);
  });

  it("allows a CS to mutate only an order they created", () => {
    expect(canManageOrder("admin", "admin-1", "cs-2")).toBe(true);
    expect(canManageOrder("cs", "cs-1", "cs-1")).toBe(true);
    expect(canManageOrder("cs", "cs-1", "cs-2")).toBe(false);
  });

  it("preserves existing GP for CS and accepts an admin update", () => {
    expect(protectOrderGp({ gp: 999_000, total: 1 }, "cs", 125_000)).toEqual({ gp: 125_000, total: 1 });
    expect(protectOrderGp({ gp: 999_000, total: 1 }, "admin", 125_000)).toEqual({ gp: 999_000, total: 1 });
  });

  it("removes GP from responses sent to CS", () => {
    expect(redactOrderForRole({ id: "order-1", gp: 125_000, total: 1_000_000 }, "cs"))
      .toEqual({ id: "order-1", total: 1_000_000 });
    expect(redactOrderForRole({ id: "order-1", gp: 125_000 }, "admin"))
      .toEqual({ id: "order-1", gp: 125_000 });
  });

  it("redacts sensitive customer identity fields for CS", () => {
    const customer = { id: "customer-1", name: "Ayu", phone: "0812", nik: "123", address: "Jl. Emas", instagram: "ayu" };
    expect(redactCustomerForRole(customer, "cs")).toEqual({
      id: "customer-1",
      name: "Ayu",
      phone: "0812",
      nik: null,
      address: null,
      instagram: null,
      kelurahan: null,
      kecamatan: null,
      kabupaten: null,
      provinsi: null,
    });
    expect(redactCustomerForRole(customer, "admin")).toBe(customer);
  });
});
