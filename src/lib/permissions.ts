export type AppRole = "admin" | "cs";

export type Capability =
  | "dashboard:view"
  | "performance:view-own"
  | "orders:create"
  | "orders:read-own"
  | "orders:read-any"
  | "orders:manage-own"
  | "orders:manage-any"
  | "orders:view-gp"
  | "customers:lookup"
  | "customers:read-own"
  | "customers:read-any"
  | "customers:manage"
  | "prices:read"
  | "prices:manage"
  | "stock:read"
  | "stock:manage"
  | "eod:read"
  | "eod:generate"
  | "reports:read-all"
  | "analytics:read"
  | "system:manage"
  | "profile:manage-own";

const ROLE_CAPABILITIES: Record<AppRole, readonly Capability[]> = {
  admin: [
    "dashboard:view",
    "orders:create",
    "orders:read-own",
    "orders:read-any",
    "orders:manage-own",
    "orders:manage-any",
    "orders:view-gp",
    "customers:lookup",
    "customers:read-own",
    "customers:read-any",
    "customers:manage",
    "prices:read",
    "prices:manage",
    "stock:read",
    "stock:manage",
    "eod:read",
    "eod:generate",
    "reports:read-all",
    "analytics:read",
    "system:manage",
    "profile:manage-own",
  ],
  cs: [
    "dashboard:view",
    "performance:view-own",
    "orders:create",
    "orders:read-own",
    "orders:manage-own",
    "customers:lookup",
    "customers:read-own",
    "prices:read",
    "stock:read",
    "profile:manage-own",
  ],
};

const PAGE_CAPABILITY_RULES: readonly { prefix: string; capability: Capability }[] = [
  { prefix: "/admin/performa", capability: "performance:view-own" },
  { prefix: "/admin/orders", capability: "orders:read-own" },
  { prefix: "/admin/pelanggan", capability: "customers:read-own" },
  { prefix: "/admin/harga", capability: "prices:read" },
  { prefix: "/admin/stock", capability: "stock:read" },
  { prefix: "/admin/eod", capability: "eod:read" },
  { prefix: "/admin/laporan", capability: "reports:read-all" },
  { prefix: "/admin/analitik", capability: "analytics:read" },
  { prefix: "/admin/jenis-emas", capability: "system:manage" },
  { prefix: "/admin/konten", capability: "system:manage" },
  { prefix: "/admin/users", capability: "system:manage" },
  { prefix: "/admin/pengaturan", capability: "system:manage" },
  { prefix: "/admin", capability: "dashboard:view" },
];

export function normalizeAppRole(value: unknown): AppRole | null {
  if (typeof value !== "string") return null;
  const role = value.trim().toLowerCase();
  return role === "admin" || role === "cs" ? role : null;
}

export function hasCapability(role: AppRole | null, capability: Capability): boolean {
  return role !== null && ROLE_CAPABILITIES[role].includes(capability);
}

export function requiredCapabilityForAdminPage(pathname: string): Capability | null {
  const normalizedPath = pathname.split("?", 1)[0];
  return PAGE_CAPABILITY_RULES.find(({ prefix }) =>
    normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
  )?.capability ?? null;
}

export function canAccessOrder(
  role: AppRole | null,
  actorId: string,
  createdBy: string | null,
): boolean {
  if (hasCapability(role, "orders:read-any")) return true;
  return hasCapability(role, "orders:read-own") && createdBy !== null && createdBy === actorId;
}

export function canManageOrder(
  role: AppRole | null,
  actorId: string,
  createdBy: string | null,
): boolean {
  if (hasCapability(role, "orders:manage-any")) return true;
  return hasCapability(role, "orders:manage-own") && createdBy !== null && createdBy === actorId;
}

export function protectOrderGp<T extends { gp: number | null }>(
  payload: T,
  role: AppRole | null,
  existingGp: number | null,
): T {
  return hasCapability(role, "orders:view-gp") ? payload : { ...payload, gp: existingGp };
}

export function redactOrderForRole<T extends Record<string, unknown>>(order: T, role: AppRole | null): T {
  if (hasCapability(role, "orders:view-gp")) return order;
  const safeOrder = { ...order };
  delete safeOrder.gp;
  return safeOrder;
}

const CUSTOMER_SENSITIVE_FIELDS = [
  "nik",
  "address",
  "kelurahan",
  "kecamatan",
  "kabupaten",
  "provinsi",
  "instagram",
] as const;

export function redactCustomerForRole<T extends Record<string, unknown>>(
  customer: T,
  role: AppRole | null,
): T {
  if (hasCapability(role, "customers:read-any")) return customer;
  const safeCustomer: Record<string, unknown> = { ...customer };
  CUSTOMER_SENSITIVE_FIELDS.forEach((field) => {
    safeCustomer[field] = null;
  });
  return safeCustomer as T;
}
