type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export type PriceInput = {
  hargaDasarJual: number;
  acuanBuybackLM: number;
  adjJual: number;
  adjBeli: number;
  adjPerhiasan: number;
  persenBuybackPerhiasan: number;
};

const MAX_PRICE_PER_GRAM = 1_000_000_000;
const MAX_ADJUSTMENT = 1_000_000_000;
const MAX_SETTING_PRICE = 10_000_000_000_000;

const SETTING_KEYS = new Set([
  "api_key",
  "usd_idr_rate",
  "phone",
  "email",
  "address",
  "weekday_open",
  "weekday_close",
  "saturday_open",
  "saturday_close",
  "google_reviews_widget_id",
  "antam_price",
  "antam_price_prev",
  "global_gold_price",
  "global_gold_price_prev",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function integerInRange(
  value: unknown,
  minimum: number,
  maximum: number,
): number | null {
  const parsed = parseNumber(value);
  if (parsed === null || !Number.isSafeInteger(parsed)) return null;
  return parsed >= minimum && parsed <= maximum ? parsed : null;
}

export function parsePriceInput(body: unknown): ValidationResult<PriceInput> {
  if (!isRecord(body)) return { ok: false, error: "Payload harga tidak valid" };

  const hargaDasarJual = integerInRange(body.hargaDasarJual, 1, MAX_PRICE_PER_GRAM);
  if (hargaDasarJual === null) {
    return { ok: false, error: "Harga dasar jual harus berupa angka positif yang valid" };
  }

  const acuanBuybackLM = integerInRange(body.acuanBuybackLM, 1, MAX_PRICE_PER_GRAM);
  if (acuanBuybackLM === null) {
    return { ok: false, error: "Acuan buyback harus berupa angka positif yang valid" };
  }

  const adjJual = integerInRange(body.adjJual ?? 0, -MAX_ADJUSTMENT, MAX_ADJUSTMENT);
  const adjBeli = integerInRange(body.adjBeli ?? 0, -MAX_ADJUSTMENT, MAX_ADJUSTMENT);
  const adjPerhiasan = integerInRange(
    body.adjPerhiasan ?? 0,
    -MAX_ADJUSTMENT,
    MAX_ADJUSTMENT,
  );
  if (adjJual === null || adjBeli === null || adjPerhiasan === null) {
    return { ok: false, error: "Nilai penyesuaian harga tidak valid" };
  }

  const persenBuybackPerhiasan = parseNumber(body.persenBuybackPerhiasan ?? 81);
  if (
    persenBuybackPerhiasan === null ||
    persenBuybackPerhiasan <= 0 ||
    persenBuybackPerhiasan > 100
  ) {
    return { ok: false, error: "Persentase buyback harus lebih dari 0 sampai 100" };
  }

  return {
    ok: true,
    value: {
      hargaDasarJual,
      acuanBuybackLM,
      adjJual,
      adjBeli,
      adjPerhiasan,
      persenBuybackPerhiasan,
    },
  };
}

function stringValue(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length <= maxLength ? normalized : null;
}

function validateSetting(key: string, value: unknown): string | null {
  if (key === "usd_idr_rate") {
    const rate = parseNumber(value);
    return rate !== null && rate >= 1_000 && rate <= 100_000 ? String(rate) : null;
  }

  if (["antam_price", "global_gold_price"].includes(key)) {
    const price = integerInRange(value, 1, MAX_SETTING_PRICE);
    return price === null ? null : String(price);
  }

  if (["antam_price_prev", "global_gold_price_prev"].includes(key)) {
    const price = integerInRange(value, 0, MAX_SETTING_PRICE);
    return price === null ? null : String(price);
  }

  if (["weekday_open", "weekday_close", "saturday_open", "saturday_close"].includes(key)) {
    const time = stringValue(value, 5);
    return time !== null && (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time) || time === "")
      ? time
      : null;
  }

  if (key === "email") {
    const email = stringValue(value, 254);
    return email !== null && (email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      ? email
      : null;
  }

  if (key === "phone") {
    const phone = stringValue(value, 32);
    return phone !== null && (phone === "" || /^[0-9+()\-\s]+$/.test(phone)) ? phone : null;
  }

  const maximumLength = key === "address" ? 500 : key === "api_key" ? 512 : 200;
  return stringValue(value, maximumLength);
}

export function parseSettingsInput(
  body: unknown,
): ValidationResult<Array<{ key: string; value: string }>> {
  if (!isRecord(body) || !isRecord(body.settings)) {
    return { ok: false, error: "Payload pengaturan tidak valid" };
  }

  const settings = Object.entries(body.settings);
  if (settings.length === 0 || settings.length > SETTING_KEYS.size) {
    return { ok: false, error: "Jumlah pengaturan tidak valid" };
  }

  const entries: Array<{ key: string; value: string }> = [];
  for (const [key, rawValue] of settings) {
    if (!SETTING_KEYS.has(key)) {
      return { ok: false, error: "Kunci pengaturan tidak diizinkan" };
    }

    const value = validateSetting(key, rawValue);
    if (value === null) {
      return { ok: false, error: `Nilai pengaturan ${key} tidak valid` };
    }
    entries.push({ key, value });
  }

  return { ok: true, value: entries };
}

export type CustomerMutationInput = {
  name: string;
  phone: string;
  nik: string | null;
  source: string | null;
  address: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kabupaten: string | null;
  provinsi: string | null;
  instagram: string | null;
};

function optionalBoundedText(
  value: unknown,
  label: string,
  maximum: number,
): ValidationResult<string | null> {
  if (value === null || value === undefined || value === "") {
    return { ok: true, value: null };
  }
  if (typeof value !== "string") return { ok: false, error: `${label} tidak valid` };

  const text = value.trim();
  if (!text) return { ok: true, value: null };
  if (text.length > maximum) return { ok: false, error: `${label} terlalu panjang` };
  return { ok: true, value: text };
}

export function parseCustomerInput(body: unknown): ValidationResult<CustomerMutationInput> {
  if (!isRecord(body)) return { ok: false, error: "Payload pelanggan tidak valid" };

  const name = optionalBoundedText(body.name, "Nama pelanggan", 100);
  if (!name.ok) return name;
  if (!name.value) return { ok: false, error: "Nama pelanggan wajib diisi" };

  if (typeof body.phone !== "string" || !/^[0-9+()\-\s]+$/.test(body.phone.trim())) {
    return { ok: false, error: "Nomor HP tidak valid" };
  }
  let phone = body.phone.replace(/\D/g, "");
  if (phone.startsWith("62")) phone = `0${phone.slice(2)}`;
  if (phone.length < 8 || phone.length > 15) {
    return { ok: false, error: "Nomor HP harus terdiri dari 8 sampai 15 digit" };
  }

  const nik = optionalBoundedText(body.nik, "NIK", 16);
  if (!nik.ok) return nik;
  if (nik.value && !/^\d{16}$/.test(nik.value)) {
    return { ok: false, error: "NIK harus terdiri dari 16 digit" };
  }

  const source = optionalBoundedText(body.source, "Sumber pelanggan", 100);
  if (!source.ok) return source;
  const address = optionalBoundedText(body.address, "Alamat", 500);
  if (!address.ok) return address;
  const kelurahan = optionalBoundedText(body.kelurahan, "Kelurahan", 100);
  if (!kelurahan.ok) return kelurahan;
  const kecamatan = optionalBoundedText(body.kecamatan, "Kecamatan", 100);
  if (!kecamatan.ok) return kecamatan;
  const kabupaten = optionalBoundedText(body.kabupaten, "Kabupaten", 100);
  if (!kabupaten.ok) return kabupaten;
  const provinsi = optionalBoundedText(body.provinsi, "Provinsi", 100);
  if (!provinsi.ok) return provinsi;
  const instagram = optionalBoundedText(body.instagram, "Instagram", 31);
  if (!instagram.ok) return instagram;
  if (instagram.value && !/^@?[A-Za-z0-9._]{1,30}$/.test(instagram.value)) {
    return { ok: false, error: "Format Instagram tidak valid" };
  }

  return {
    ok: true,
    value: {
      name: name.value,
      phone,
      nik: nik.value,
      source: source.value,
      address: address.value,
      kelurahan: kelurahan.value,
      kecamatan: kecamatan.value,
      kabupaten: kabupaten.value,
      provinsi: provinsi.value,
      instagram: instagram.value,
    },
  };
}

export type UserProfileInput = {
  userId: string;
  name: string | null;
  signature: string | null;
};

export function parseUserProfileInput(body: unknown): ValidationResult<UserProfileInput> {
  if (!isRecord(body)) return { ok: false, error: "Payload profil tidak valid" };

  if (
    typeof body.userId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.userId)
  ) {
    return { ok: false, error: "User ID tidak valid" };
  }

  const name = optionalBoundedText(body.name, "Nama profil", 100);
  if (!name.ok) return name;

  if (body.signature === null || body.signature === undefined || body.signature === "") {
    return { ok: true, value: { userId: body.userId, name: name.value, signature: null } };
  }
  if (
    typeof body.signature !== "string" ||
    body.signature.length > 500_000 ||
    !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(body.signature)
  ) {
    return { ok: false, error: "Tanda tangan tidak valid" };
  }

  return {
    ok: true,
    value: { userId: body.userId, name: name.value, signature: body.signature },
  };
}

export type HeroContentInput = {
  badge: string;
  headlineStart: string;
  headlineGradient: string;
  headlineEnd: string;
  subheadline: string;
  ctaText: string;
};

export function parseHeroContentInput(body: unknown): ValidationResult<HeroContentInput> {
  if (!isRecord(body) || !isRecord(body.hero)) {
    return { ok: false, error: "Payload konten tidak valid" };
  }

  const fields = [
    ["badge", "Badge", 120, true],
    ["headlineStart", "Teks awal", 100, true],
    ["headlineGradient", "Teks gradient", 100, true],
    ["headlineEnd", "Teks akhir", 100, false],
    ["subheadline", "Subheadline", 500, true],
    ["ctaText", "Teks tombol", 80, true],
  ] as const;
  const parsed: Partial<HeroContentInput> = {};

  for (const [key, label, maximum, required] of fields) {
    const value = optionalBoundedText(body.hero[key], label, maximum);
    if (!value.ok) return value;
    if (required && !value.value) return { ok: false, error: `${label} wajib diisi` };
    parsed[key] = value.value ?? "";
  }

  return { ok: true, value: parsed as HeroContentInput };
}

export type DailyReportRange = "today" | "week" | "month";

export function parseDailyReportRange(value: unknown): ValidationResult<DailyReportRange> {
  if (value === "today" || value === "week" || value === "month") {
    return { ok: true, value };
  }
  return { ok: false, error: "Rentang laporan tidak valid" };
}

export function parseEodDate(value: unknown): ValidationResult<string> {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { ok: false, error: "Tanggal EOD tidak valid" };
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return { ok: false, error: "Tanggal EOD tidak valid" };
  }

  return { ok: true, value };
}

const GOLD_TYPE_CATEGORIES = new Set(["lm", "bb-lm", "bb-perhiasan", "bb-logam"]);
const MAX_GOLD_WEIGHT = 100_000;
const MAX_MARGIN_PERCENT = 100;

type GoldTypeCategory = "lm" | "bb-lm" | "bb-perhiasan" | "bb-logam";

export type GoldTypeCreateInput = {
  id: string;
  name: string;
  category: GoldTypeCategory;
  karat: number | null;
  weight: number | null;
  margin_buy: number;
  margin_sell: number;
};

function parseGoldTypeId(value: unknown): ValidationResult<string> {
  const id = optionalBoundedText(value, "ID jenis emas", 64);
  if (!id.ok) return id;
  if (!id.value || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(id.value)) {
    return { ok: false, error: "ID jenis emas tidak valid" };
  }
  return { ok: true, value: id.value };
}

function nullableNumberInRange(
  value: unknown,
  label: string,
  minimum: number,
  maximum: number,
  integer = false,
): ValidationResult<number | null> {
  if (value === null || value === undefined || value === "") {
    return { ok: true, value: null };
  }
  const parsed = parseNumber(value);
  if (
    parsed === null ||
    (integer && !Number.isSafeInteger(parsed)) ||
    parsed < minimum ||
    parsed > maximum
  ) {
    return { ok: false, error: `${label} tidak valid` };
  }
  return { ok: true, value: parsed };
}

function parseGoldTypeCategory(value: unknown): ValidationResult<GoldTypeCategory> {
  if (typeof value !== "string" || !GOLD_TYPE_CATEGORIES.has(value)) {
    return { ok: false, error: "Kategori jenis emas tidak valid" };
  }
  return { ok: true, value: value as GoldTypeCategory };
}

export function parseGoldTypeCreateInput(body: unknown): ValidationResult<GoldTypeCreateInput> {
  if (!isRecord(body)) return { ok: false, error: "Payload jenis emas tidak valid" };

  const id = parseGoldTypeId(body.id);
  if (!id.ok) return id;
  const name = optionalBoundedText(body.name, "Nama jenis emas", 100);
  if (!name.ok) return name;
  if (!name.value) return { ok: false, error: "Nama jenis emas wajib diisi" };
  const category = parseGoldTypeCategory(body.category);
  if (!category.ok) return category;
  const karat = nullableNumberInRange(body.karat, "Karat", 1, 24, true);
  if (!karat.ok) return karat;
  const weight = nullableNumberInRange(body.weight, "Berat", 0.001, MAX_GOLD_WEIGHT);
  if (!weight.ok) return weight;
  const marginBuy = nullableNumberInRange(body.margin_buy ?? 3, "Margin beli", 0, MAX_MARGIN_PERCENT);
  if (!marginBuy.ok || marginBuy.value === null) return { ok: false, error: "Margin beli tidak valid" };
  const marginSell = nullableNumberInRange(body.margin_sell ?? 2, "Margin jual", 0, MAX_MARGIN_PERCENT);
  if (!marginSell.ok || marginSell.value === null) return { ok: false, error: "Margin jual tidak valid" };

  return { ok: true, value: { id: id.value, name: name.value, category: category.value, karat: karat.value, weight: weight.value, margin_buy: marginBuy.value, margin_sell: marginSell.value } };
}

export function parseGoldTypeUpdateInput(
  body: unknown,
): ValidationResult<{ id: string; updates: Partial<Omit<GoldTypeCreateInput, "id">> }> {
  if (!isRecord(body)) return { ok: false, error: "Payload jenis emas tidak valid" };
  const id = parseGoldTypeId(body.id);
  if (!id.ok) return id;
  const updates: Partial<Omit<GoldTypeCreateInput, "id">> = {};

  if (body.name !== undefined) {
    const name = optionalBoundedText(body.name, "Nama jenis emas", 100);
    if (!name.ok || !name.value) return { ok: false, error: "Nama jenis emas tidak valid" };
    updates.name = name.value;
  }
  if (body.category !== undefined) {
    const category = parseGoldTypeCategory(body.category);
    if (!category.ok) return category;
    updates.category = category.value;
  }
  for (const [key, label, minimum, maximum, integer] of [
    ["karat", "Karat", 1, 24, true],
    ["weight", "Berat", 0.001, MAX_GOLD_WEIGHT, false],
    ["margin_buy", "Margin beli", 0, MAX_MARGIN_PERCENT, false],
    ["margin_sell", "Margin jual", 0, MAX_MARGIN_PERCENT, false],
  ] as const) {
    if (body[key] === undefined) continue;
    const parsed = nullableNumberInRange(body[key], label, minimum, maximum, integer);
    if (!parsed.ok) return parsed;
    updates[key] = parsed.value as never;
  }
  if (!Object.keys(updates).length) return { ok: false, error: "Tidak ada perubahan jenis emas" };
  return { ok: true, value: { id: id.value, updates } };
}

export type GoldTypeModeInput = {
  id: string;
  isAuto: boolean;
  manualBuy: number | null;
  manualSell: number | null;
};

export function parseGoldTypeModesInput(body: unknown): ValidationResult<GoldTypeModeInput[]> {
  if (!Array.isArray(body) || body.length === 0 || body.length > 200) {
    return { ok: false, error: "Payload mode harga tidak valid" };
  }
  const result: GoldTypeModeInput[] = [];
  for (const item of body) {
    if (!isRecord(item) || typeof item.isAuto !== "boolean") {
      return { ok: false, error: "Data mode harga tidak valid" };
    }
    const id = parseGoldTypeId(item.id);
    if (!id.ok) return id;
    const manualBuy = nullableNumberInRange(item.manualBuy, "Harga beli manual", 0, MAX_SETTING_PRICE, true);
    if (!manualBuy.ok) return manualBuy;
    const manualSell = nullableNumberInRange(item.manualSell, "Harga jual manual", 0, MAX_SETTING_PRICE, true);
    if (!manualSell.ok) return manualSell;
    result.push({ id: id.value, isAuto: item.isAuto, manualBuy: manualBuy.value, manualSell: manualSell.value });
  }
  return { ok: true, value: result };
}

export function parseGoldTypeDeleteInput(body: unknown): ValidationResult<string> {
  if (!isRecord(body)) return { ok: false, error: "Payload jenis emas tidak valid" };
  return parseGoldTypeId(body.id);
}

export type AdminUserRole = "admin" | "cs";

export type AdminUserCreateInput = {
  email: string;
  password: string;
  role: AdminUserRole;
};

export type AdminUserUpdateInput = {
  userId: string;
  email?: string;
  password?: string;
  role?: AdminUserRole;
};

const USER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const USER_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_USER_PASSWORD_LENGTH = 6;
const MAX_USER_PASSWORD_LENGTH = 128;

function parseAdminUserId(value: unknown): ValidationResult<string> {
  if (typeof value !== "string" || !USER_ID_PATTERN.test(value.trim())) {
    return { ok: false, error: "ID pengguna tidak valid" };
  }
  return { ok: true, value: value.trim() };
}

function parseAdminUserEmail(value: unknown): ValidationResult<string> {
  if (typeof value !== "string") return { ok: false, error: "Email tidak valid" };
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || !USER_EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Email tidak valid" };
  }
  return { ok: true, value: email };
}

function parseAdminUserPassword(value: unknown): ValidationResult<string> {
  if (
    typeof value !== "string" ||
    value.length < MIN_USER_PASSWORD_LENGTH ||
    value.length > MAX_USER_PASSWORD_LENGTH
  ) {
    return {
      ok: false,
      error: `Password harus ${MIN_USER_PASSWORD_LENGTH}-${MAX_USER_PASSWORD_LENGTH} karakter`,
    };
  }
  return { ok: true, value };
}

function parseAdminUserRole(value: unknown): ValidationResult<AdminUserRole> {
  if (value !== "admin" && value !== "cs") {
    return { ok: false, error: "Role pengguna tidak valid" };
  }
  return { ok: true, value };
}

export function parseAdminUserCreateInput(
  body: unknown,
): ValidationResult<AdminUserCreateInput> {
  if (!isRecord(body)) return { ok: false, error: "Payload pengguna tidak valid" };

  const email = parseAdminUserEmail(body.email);
  if (!email.ok) return email;
  const password = parseAdminUserPassword(body.password);
  if (!password.ok) return password;
  const role = parseAdminUserRole(body.role ?? "cs");
  if (!role.ok) return role;

  return {
    ok: true,
    value: { email: email.value, password: password.value, role: role.value },
  };
}

export function parseAdminUserUpdateInput(
  body: unknown,
): ValidationResult<AdminUserUpdateInput> {
  if (!isRecord(body)) return { ok: false, error: "Payload pengguna tidak valid" };

  const userId = parseAdminUserId(body.userId);
  if (!userId.ok) return userId;
  const value: AdminUserUpdateInput = { userId: userId.value };

  if (body.email !== undefined) {
    const email = parseAdminUserEmail(body.email);
    if (!email.ok) return email;
    value.email = email.value;
  }
  if (body.password !== undefined) {
    const password = parseAdminUserPassword(body.password);
    if (!password.ok) return password;
    value.password = password.value;
  }
  if (body.role !== undefined) {
    const role = parseAdminUserRole(body.role);
    if (!role.ok) return role;
    value.role = role.value;
  }

  if (value.email === undefined && value.password === undefined && value.role === undefined) {
    return { ok: false, error: "Tidak ada data pengguna yang diubah" };
  }
  return { ok: true, value };
}

export function parseAdminUserDeleteInput(body: unknown): ValidationResult<string> {
  if (!isRecord(body)) return { ok: false, error: "Payload pengguna tidak valid" };
  return parseAdminUserId(body.userId);
}
