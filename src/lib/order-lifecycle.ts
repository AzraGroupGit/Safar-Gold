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

function finitePositive(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} harus lebih dari nol`);
  }
  return value;
}

function optionalFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseOrderMutation(input: unknown): ParsedOrderMutation {
  if (!input || typeof input !== "object") throw new Error("Payload order tidak valid");
  const body = input as Record<string, unknown>;
  if (body.type !== "sell" && body.type !== "buyback") {
    throw new Error("Tipe order tidak valid");
  }

  const customerName = optionalText(body.customerName);
  const customerPhone = optionalText(body.customerPhone)?.replace(/\D/g, "") ?? null;
  if (!customerName || !customerPhone) throw new Error("Nama dan nomor HP wajib diisi");
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new Error("Minimal satu item wajib diisi");
  }

  const items = body.items.map((raw, index): OrderItemInput => {
    if (!raw || typeof raw !== "object") throw new Error(`Item ${index + 1} tidak valid`);
    const item = raw as Record<string, unknown>;
    const itemName = optionalText(item.itemName);
    if (!itemName) throw new Error(`Nama item ${index + 1} wajib diisi`);
    const qty = finitePositive(item.qty ?? 1, `Jumlah item ${index + 1}`);
    if (!Number.isInteger(qty)) throw new Error(`Jumlah item ${index + 1} harus bilangan bulat`);
    const weight = finitePositive(item.weight, `Berat item ${index + 1}`);
    const pricePerGram = finitePositive(item.pricePerGram, `Harga item ${index + 1}`);
    const goldTypeId = optionalText(item.goldTypeId);
    const brand = goldTypeId ? (optionalText(item.brand) ?? "Antam") : optionalText(item.brand);

    return {
      goldTypeId,
      itemName,
      brand,
      weight,
      karat: typeof item.karat === "number" && Number.isFinite(item.karat) ? item.karat : null,
      qty,
      pricePerGram,
      priceTotal: Math.round(weight * pricePerGram),
    };
  });

  return {
    type: body.type,
    customerName,
    customerPhone,
    paymentMethod: body.paymentMethod === "transfer" ? "transfer" : "cash",
    notes: optionalText(body.notes),
    gp: optionalFiniteNumber(body.gp),
    source: optionalText(body.source),
    nik: optionalText(body.nik),
    address: optionalText(body.address),
    kelurahan: optionalText(body.kelurahan),
    kecamatan: optionalText(body.kecamatan),
    kabupaten: optionalText(body.kabupaten),
    provinsi: optionalText(body.provinsi),
    instagram: optionalText(body.instagram),
    provinceId: optionalText(body.provinceId),
    regencyId: optionalText(body.regencyId),
    districtId: optionalText(body.districtId),
    villageId: optionalText(body.villageId),
    items,
    total: items.reduce((sum, item) => sum + item.priceTotal, 0),
  };
}
import { hasCapability, normalizeAppRole } from "./permissions";
