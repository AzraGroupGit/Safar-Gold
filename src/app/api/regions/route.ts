import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // regency | district | village
  const parent = searchParams.get("parent"); // province_id | regency_id | district_id

  try {
    let url: string;
    if (type === "regency" && parent) {
      url = `${BASE}/regencies/${parent}.json`;
    } else if (type === "district" && parent) {
      url = `${BASE}/districts/${parent}.json`;
    } else if (type === "village" && parent) {
      url = `${BASE}/villages/${parent}.json`;
    } else {
      url = `${BASE}/provinces.json`;
    }

    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return NextResponse.json({ error: "Failed to fetch region data" }, { status: 502 });

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Region service unavailable" }, { status: 500 });
  }
}
