type Purchase = {
  created_at: string;
  total: number;
};

export function summarizeCustomerPurchases(purchases: Purchase[]) {
  let firstPurchaseAt: string | null = null;
  let latestPurchaseAt: string | null = null;
  let totalSpent = 0;

  for (const purchase of purchases) {
    totalSpent += Number(purchase.total) || 0;
    if (!firstPurchaseAt || purchase.created_at < firstPurchaseAt) firstPurchaseAt = purchase.created_at;
    if (!latestPurchaseAt || purchase.created_at > latestPurchaseAt) latestPurchaseAt = purchase.created_at;
  }

  return { firstPurchaseAt, latestPurchaseAt, orderCount: purchases.length, totalSpent };
}
