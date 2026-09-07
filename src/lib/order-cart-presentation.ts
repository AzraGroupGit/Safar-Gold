type OrderItemDetailInput = {
  brand?: string | null;
  qty: number;
  weight: number;
  karat: number | null;
  pricePerGram: number;
};

const numberFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });
const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function getOrderItemDetails(item: OrderItemDetailInput): string[] {
  return [
    item.brand ? `Merek: ${item.brand}` : null,
    `Qty: ${item.qty}`,
    `Berat total: ${numberFormatter.format(item.weight)} g`,
    item.karat ? `Karat: ${item.karat}K` : null,
    `Harga/g: ${currencyFormatter.format(item.pricePerGram)}`,
  ].filter((detail): detail is string => detail !== null);
}

type OrderAddressInput = {
  address?: string | null;
  village?: string | null;
  district?: string | null;
  regency?: string | null;
  province?: string | null;
};

export function formatOrderAddress(address: OrderAddressInput): string {
  const parts = [address.address, address.village, address.district, address.regency, address.province]
    .map(part => part?.trim())
    .filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(", ") : "-";
}
