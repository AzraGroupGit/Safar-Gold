import { pathToFileURL } from "node:url";
import { createServerClient } from "@supabase/ssr";

type JsonRecord = Record<string, unknown>;
type CheckResult = { pass: boolean; detail: string };

const PUBLIC_SETTING_KEYS = new Set([
  "usd_idr_rate", "last_price_update",
  "harga_dasar_jual", "acuan_buyback_lm", "premi_pecahan", "spread_buyback_lm",
  "offset_perhiasan_k24s", "offset_perhiasan_k24", "dasar_perhiasan_offset",
  "adjustment_jual", "adjustment_beli", "adjustment_perhiasan", "persen_buyback_perhiasan",
  "last_cron_xau_usd", "last_cron_xag_usd", "last_cron_xpd_usd",
  "antam_price", "antam_price_prev", "global_gold_price", "global_gold_price_prev",
  "phone", "email", "address", "weekday_open", "weekday_close", "saturday_open", "saturday_close",
  "hero_badge", "hero_headline_start", "hero_headline_gradient", "hero_headline_end",
  "hero_subheadline", "hero_cta", "google_reviews_widget_id",
]);

export function evaluateBlockedTable(rows: unknown[]): CheckResult {
  const count = rows.length;
  return {
    pass: count === 0,
    detail: count === 0 ? "0 rows" : `${count} exposed ${count === 1 ? "row" : "rows"}`,
  };
}

export function evaluatePublicSettings(rows: JsonRecord[]): CheckResult {
  const keys = rows.map((row) => String(row.key ?? ""));
  const unexpected = keys.filter((key) => !PUBLIC_SETTING_KEYS.has(key));
  return {
    pass: unexpected.length === 0 && !keys.includes("api_key"),
    detail: unexpected.length === 0 ? `${keys.length} allowlisted keys` : `unexpected keys: ${unexpected.join(", ")}`,
  };
}

export function evaluateRoleOrders(userId: string, orders: JsonRecord[]): CheckResult {
  const foreign = orders.filter((order) => order.created_by !== userId);
  const withGp = orders.filter((order) => Object.hasOwn(order, "gp"));
  const pass = foreign.length === 0 && withGp.length === 0;
  return {
    pass,
    detail: pass
      ? `${orders.length} owned ${orders.length === 1 ? "order" : "orders"}`
      : `${foreign.length} foreign, ${withGp.length} exposing GP`,
  };
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} wajib tersedia`);
  return value;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { nonJsonResponse: true };
  }
}

function printCheck(name: string, result: CheckResult): boolean {
  console.log(`${result.pass ? "PASS" : "FAIL"}  ${name} (${result.detail})`);
  return result.pass;
}

async function runAnonChecks(supabaseUrl: string, publishableKey: string): Promise<boolean> {
  const headers = { apikey: publishableKey, Authorization: `Bearer ${publishableKey}` };
  const sensitive = [
    ["orders", "id,customer_phone,nik,address"],
    ["order_items", "id,order_id,price_total"],
    ["customers", "id,phone,nik,address"],
    ["stock_movements", "id,order_id,notes"],
  ] as const;
  let passed = true;

  for (const [table, columns] of sensitive) {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&limit=1`, { headers });
    const body = await readJson(response);
    const result = response.ok && Array.isArray(body)
      ? evaluateBlockedTable(body)
      : { pass: false, detail: `HTTP ${response.status}` };
    passed = printCheck(`anon cannot read ${table}`, result) && passed;
  }

  const settingsResponse = await fetch(`${supabaseUrl}/rest/v1/app_settings?select=key&order=key`, { headers });
  const settingsBody = await readJson(settingsResponse);
  const settings = settingsResponse.ok && Array.isArray(settingsBody) ? settingsBody as JsonRecord[] : [{ key: "request_failed" }];
  passed = printCheck("anon settings use an explicit allowlist", evaluatePublicSettings(settings)) && passed;

  for (const table of ["gold_types", "price_history"]) {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id&limit=1`, { headers });
    passed = printCheck(`public pricing table ${table} remains readable`, {
      pass: response.ok,
      detail: `HTTP ${response.status}`,
    }) && passed;
  }

  return passed;
}

async function createSessionCookie(
  supabaseUrl: string,
  publishableKey: string,
  email: string,
  password: string,
): Promise<{ cookie: string; userId: string }> {
  let cookies: { name: string; value: string }[] = [];
  const client = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll: () => [],
      setAll: (nextCookies) => {
        cookies = nextCookies.map(({ name, value }) => ({ name, value }));
      },
    },
  });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user || cookies.length === 0) {
    throw new Error(`Login akun smoke test gagal: ${error?.message ?? "cookie session tidak dibuat"}`);
  }
  return {
    cookie: cookies.map(({ name, value }) => `${name}=${value}`).join("; "),
    userId: data.user.id,
  };
}

async function appRequest(baseUrl: string, path: string, cookie?: string): Promise<{ response: Response; body: unknown }> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: cookie ? { Cookie: cookie } : undefined,
    redirect: "manual",
  });
  return { response, body: await readJson(response) };
}

async function runRoleChecks(supabaseUrl: string, publishableKey: string, baseUrl: string): Promise<boolean> {
  const credentials = {
    admin: { email: requiredEnv("SMOKE_ADMIN_EMAIL"), password: requiredEnv("SMOKE_ADMIN_PASSWORD") },
    cs: { email: requiredEnv("SMOKE_CS_EMAIL"), password: requiredEnv("SMOKE_CS_PASSWORD") },
  };
  let passed = true;

  const anonymous = await appRequest(baseUrl, "/api/admin/orders");
  passed = printCheck("anonymous application request is rejected", {
    pass: anonymous.response.status === 401,
    detail: `HTTP ${anonymous.response.status}`,
  }) && passed;

  const admin = await createSessionCookie(supabaseUrl, publishableKey, credentials.admin.email, credentials.admin.password);
  for (const path of ["/api/admin/orders", "/api/admin/stock", "/api/admin/laporan/eod"]) {
    const result = await appRequest(baseUrl, path, admin.cookie);
    passed = printCheck(`admin can access ${path}`, {
      pass: result.response.status === 200,
      detail: `HTTP ${result.response.status}`,
    }) && passed;
  }

  const cs = await createSessionCookie(supabaseUrl, publishableKey, credentials.cs.email, credentials.cs.password);
  const csOrders = await appRequest(baseUrl, "/api/admin/orders", cs.cookie);
  const orders = csOrders.response.ok && csOrders.body && typeof csOrders.body === "object"
    ? ((csOrders.body as JsonRecord).orders as JsonRecord[] | undefined) ?? []
    : [];
  passed = printCheck("CS receives only owned orders without GP", {
    ...evaluateRoleOrders(cs.userId, orders),
    pass: csOrders.response.status === 200 && evaluateRoleOrders(cs.userId, orders).pass,
  }) && passed;

  const csStock = await appRequest(baseUrl, "/api/admin/stock", cs.cookie);
  passed = printCheck("CS keeps read-only stock access", {
    pass: csStock.response.status === 200,
    detail: `HTTP ${csStock.response.status}`,
  }) && passed;

  for (const path of ["/api/admin/laporan/eod", "/api/admin/analytics?from=2026-01-01&to=2026-01-31&grain=day"] ) {
    const result = await appRequest(baseUrl, path, cs.cookie);
    passed = printCheck(`CS is forbidden from ${path.split("?")[0]}`, {
      pass: result.response.status === 403,
      detail: `HTTP ${result.response.status}`,
    }) && passed;
  }

  return passed;
}

async function main() {
  const scope = process.argv.find((argument) => argument.startsWith("--scope="))?.split("=")[1] ?? "all";
  if (!["all", "anon", "roles"].includes(scope)) throw new Error(`Scope tidak dikenal: ${scope}`);

  const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  const publishableKey = requiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  const baseUrl = (process.env.APP_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  let passed = true;

  if (scope === "all" || scope === "anon") {
    passed = await runAnonChecks(supabaseUrl, publishableKey) && passed;
  }
  if (scope === "all" || scope === "roles") {
    passed = await runRoleChecks(supabaseUrl, publishableKey, baseUrl) && passed;
  }

  if (!passed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(`FAIL  smoke test tidak selesai (${error instanceof Error ? error.message : "unknown error"})`);
    process.exitCode = 1;
  });
}
