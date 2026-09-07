import type { AnalyticsGrain } from "./analytics";

export type CsPerformanceOrder = {
  id: string;
  order_number: string;
  type: "sell" | "buyback";
  status: string;
  customer_name: string;
  total: number;
  created_at: string;
  order_items: { qty: number; weight: number }[] | null;
};

const wibFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" });

export function canViewOwnCsPerformance(role: unknown) {
  return typeof role === "string" && role.trim().toLowerCase() === "cs";
}

function bucketKey(timestamp: string, grain: AnalyticsGrain) {
  const date = wibFormatter.format(new Date(timestamp));
  if (grain === "month") return date.slice(0, 7);
  if (grain === "week") {
    const parsed = new Date(`${date}T00:00:00Z`);
    const day = parsed.getUTCDay() || 7;
    parsed.setUTCDate(parsed.getUTCDate() - day + 1);
    return parsed.toISOString().slice(0, 10);
  }
  return date;
}

export function aggregateCsPerformance(orders: CsPerformanceOrder[], grain: AnalyticsGrain) {
  const completed = orders.filter(order => order.status === "completed");
  const cancelled = orders.filter(order => order.status === "cancelled");
  const trend = new Map<string, { key: string; completed: number; cancelled: number; value: number }>();

  for (const order of orders) {
    const key = bucketKey(order.created_at, grain);
    const point = trend.get(key) ?? { key, completed: 0, cancelled: 0, value: 0 };
    if (order.status === "completed") {
      point.completed += 1;
      point.value += Number(order.total) || 0;
    } else if (order.status === "cancelled") {
      point.cancelled += 1;
    }
    trend.set(key, point);
  }

  const itemTotals = completed.flatMap(order => order.order_items ?? []).reduce(
    (result, item) => ({ itemCount: result.itemCount + (Number(item.qty) || 0), totalWeight: result.totalWeight + (Number(item.weight) || 0) }),
    { itemCount: 0, totalWeight: 0 },
  );
  const totalOrders = orders.length;

  return {
    metrics: {
      totalOrders,
      completedOrders: completed.length,
      cancelledOrders: cancelled.length,
      sellOrders: completed.filter(order => order.type === "sell").length,
      buybackOrders: completed.filter(order => order.type === "buyback").length,
      completedValue: completed.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
      itemCount: itemTotals.itemCount,
      totalWeight: Math.round(itemTotals.totalWeight * 100) / 100,
      completionRate: totalOrders ? Math.round((completed.length / totalOrders) * 10_000) / 100 : 0,
    },
    trend: [...trend.values()].sort((a, b) => a.key.localeCompare(b.key)),
    recentOrders: [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 20),
  };
}

export type CsPerformanceResult = ReturnType<typeof aggregateCsPerformance>;

export type CsTeamMember = { id: string; email: string };
export type CsTeamOrder = CsPerformanceOrder & { created_by: string | null };

export function aggregateCsTeamPerformance(users: CsTeamMember[], orders: CsTeamOrder[], grain: AnalyticsGrain) {
  const csIds = new Set(users.map(user => user.id));
  const teamOrders = orders.filter(order => order.created_by !== null && csIds.has(order.created_by));
  const members = users.map(user => {
    const memberOrders = teamOrders.filter(order => order.created_by === user.id);
    return { ...user, performance: aggregateCsPerformance(memberOrders, grain), lastOrderAt: memberOrders.sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.created_at ?? null };
  }).sort((a, b) => b.performance.metrics.completedOrders - a.performance.metrics.completedOrders || a.email.localeCompare(b.email));
  const team = aggregateCsPerformance(teamOrders, grain);
  const activeCs = members.filter(member => member.performance.metrics.totalOrders > 0).length;

  return {
    metrics: {
      totalCs: users.length,
      activeCs,
      completedOrders: team.metrics.completedOrders,
      cancelledOrders: team.metrics.cancelledOrders,
      averageCompletedPerActiveCs: activeCs ? Math.round((team.metrics.completedOrders / activeCs) * 100) / 100 : 0,
      unattributedOrders: orders.filter(order => order.created_by === null).length,
      completedValue: team.metrics.completedValue,
    },
    trend: team.trend,
    members,
  };
}

export type CsTeamPerformanceResult = ReturnType<typeof aggregateCsTeamPerformance>;
