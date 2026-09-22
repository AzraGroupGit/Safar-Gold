export type OrderType = "sell" | "buyback";

export type OrderItemInput = {
  goldTypeId: string | null;
  itemName: string;
  brand: string | null;
  weight: number;
  karat: number | null;
  qty: number;
  pricePerGram: number;
  priceTotal: number;
};

export type ParsedOrderMutation = {
  type: OrderType;
  customerName: string;
  customerPhone: string;
  paymentMethod: "cash" | "transfer";
  notes: string | null;
  gp: number | null;
  source: string | null;
  nik: string | null;
  address: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kabupaten: string | null;
  provinsi: string | null;
  instagram: string | null;
  provinceId: string | null;
  regencyId: string | null;
  districtId: string | null;
  villageId: string | null;
  items: OrderItemInput[];
  total: number;
};

const MAX_ORDER_ITEMS = 100;
const MAX_ITEM_QUANTITY = 1_000_000;
const MAX_ITEM_WEIGHT = 1_000_000;
const MAX_PRICE_PER_GRAM = 1_000_000_000;
const MAX_ORDER_TOTAL = 1_000_000_000_000;

export function canManageOrders(role: unknown): boolean {
  return hasCapability(normalizeAppRole(role), "orders:create");
}

export function canGenerateEod(role: unknown): boolean {
  return hasCapability(normalizeAppRole(role), "eod:generate");
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text || null;
}

function boundedOptionalText(value: unknown, label: string, maximum: number): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") throw new Error(`${label} tidak valid`);
  const text = value.trim();
  if (!text) return null;
  if (text.length > maximum) throw new Error(`${label} terlalu panjang`);
  return text;
}

function finitePositive(value: unknown, label: string, maximum: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > maximum) {
    throw new Error(`${label} harus lebih dari nol dan maksimal ${maximum}`);
  }
  return value;
}

function optionalBoundedInteger(value: unknown, label: string, maximum: number): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(parsed) || Math.abs(parsed) > maximum) {
    throw new Error(`${label} harus berupa bilangan bulat antara -${maximum} dan ${maximum}`);
  }
  return parsed;
}

export function parseOrderId(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim())
  ) {
    throw new Error("ID order tidak valid");
  }
  return value.trim();
}

export function parseOrderMutation(input: unknown): ParsedOrderMutation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Payload order tidak valid");
  }
  const body = input as Record<string, unknown>;
  if (body.type !== "sell" && body.type !== "buyback") {
    throw new Error("Tipe order tidak valid");
  }

  const customerName = boundedOptionalText(body.customerName, "Nama pelanggan", 100);
  const rawCustomerPhone = optionalText(body.customerPhone);
  if (!customerName || !rawCustomerPhone) throw new Error("Nama dan nomor HP wajib diisi");
  if (!/^[0-9+()\-\s]+$/.test(rawCustomerPhone)) throw new Error("Format nomor HP tidak valid");
  let customerPhone = rawCustomerPhone.replace(/\D/g, "");
  if (customerPhone.startsWith("62")) customerPhone = `0${customerPhone.slice(2)}`;
  if (customerPhone.length < 8 || customerPhone.length > 15) {
    throw new Error("Nomor HP harus terdiri dari 8 sampai 15 digit");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new Error("Minimal satu item wajib diisi");
  }
  if (body.items.length > MAX_ORDER_ITEMS) {
    throw new Error(`Item dalam satu order maksimal ${MAX_ORDER_ITEMS}`);
  }

  const notes = boundedOptionalText(body.notes, "Catatan", 1_000);
  const source = boundedOptionalText(body.source, "Sumber pelanggan", 100);
  const nik = boundedOptionalText(body.nik, "NIK", 16);
  if (nik && !/^\d{16}$/.test(nik)) throw new Error("NIK harus terdiri dari 16 digit");
  const address = boundedOptionalText(body.address, "Alamat", 500);
  const kelurahan = boundedOptionalText(body.kelurahan, "Kelurahan", 100);
  const kecamatan = boundedOptionalText(body.kecamatan, "Kecamatan", 100);
  const kabupaten = boundedOptionalText(body.kabupaten, "Kabupaten", 100);
  const provinsi = boundedOptionalText(body.provinsi, "Provinsi", 100);
  const instagram = boundedOptionalText(body.instagram, "Instagram", 31);
  if (instagram && !/^@?[A-Za-z0-9._]{1,30}$/.test(instagram)) {
    throw new Error("Format Instagram tidak valid");
  }
  const provinceId = boundedOptionalText(body.provinceId, "ID provinsi", 50);
  const regencyId = boundedOptionalText(body.regencyId, "ID kabupaten", 50);
  const districtId = boundedOptionalText(body.districtId, "ID kecamatan", 50);
  const villageId = boundedOptionalText(body.villageId, "ID kelurahan", 50);

  const items = body.items.map((raw, index): OrderItemInput => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error(`Item ${index + 1} tidak valid`);
    }
    const item = raw as Record<string, unknown>;
    const itemName = boundedOptionalText(item.itemName, `Nama item ${index + 1}`, 200);
    if (!itemName) throw new Error(`Nama item ${index + 1} wajib diisi`);
    const qty = finitePositive(item.qty ?? 1, `Jumlah item ${index + 1}`, MAX_ITEM_QUANTITY);
    if (!Number.isSafeInteger(qty)) throw new Error(`Jumlah item ${index + 1} harus bilangan bulat`);
    const weight = finitePositive(item.weight, `Berat item ${index + 1}`, MAX_ITEM_WEIGHT);
    const pricePerGram = finitePositive(
      item.pricePerGram,
      `Harga item ${index + 1}`,
      MAX_PRICE_PER_GRAM,
    );
    if (!Number.isSafeInteger(pricePerGram)) {
      throw new Error(`Harga item ${index + 1} harus bilangan bulat`);
    }
    const goldTypeId = boundedOptionalText(item.goldTypeId, `ID produk ${index + 1}`, 64);
    if (goldTypeId && !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(goldTypeId)) {
      throw new Error(`ID produk ${index + 1} tidak valid`);
    }
    const rawBrand = boundedOptionalText(item.brand, `Merek item ${index + 1}`, 100);
    const brand = goldTypeId ? (rawBrand ?? "Antam") : rawBrand;
    const karat = optionalBoundedInteger(item.karat, `Karat item ${index + 1}`, 24);
    if (karat !== null && karat < 1) throw new Error(`Karat item ${index + 1} harus antara 1 dan 24`);
    const priceTotal = Math.round(weight * pricePerGram);
    if (!Number.isSafeInteger(priceTotal) || priceTotal > MAX_ORDER_TOTAL) {
      throw new Error(`Total harga item ${index + 1} melebihi batas`);
    }

    return {
      goldTypeId,
      itemName,
      brand,
      weight,
      karat,
      qty,
      pricePerGram,
      priceTotal,
    };
  });

  const total = items.reduce((sum, item) => sum + item.priceTotal, 0);
  if (!Number.isSafeInteger(total) || total > MAX_ORDER_TOTAL) {
    throw new Error("Total order melebihi batas");
  }
  const paymentMethod = body.paymentMethod === null || body.paymentMethod === undefined || body.paymentMethod === ""
    ? "cash"
    : body.paymentMethod;
  if (paymentMethod !== "cash" && paymentMethod !== "transfer") {
    throw new Error("Metode pembayaran tidak valid");
  }

  return {
    type: body.type,
    customerName,
    customerPhone,
    paymentMethod,
    notes,
    gp: optionalBoundedInteger(body.gp, "GP", MAX_ORDER_TOTAL),
    source,
    nik,
    address,
    kelurahan,
    kecamatan,
    kabupaten,
    provinsi,
    instagram,
    provinceId,
    regencyId,
    districtId,
    villageId,
    items,
    total,
  };
}
import { hasCapability, normalizeAppRole } from "./permissions";
