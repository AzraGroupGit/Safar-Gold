import { NextResponse } from "next/server";
import { scrapeAntamPrice } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

export async function POST() {
  const result = await scrapeAntamPrice();
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({
    success: true,
    antamPrice: result.antamPrice,
    previousPrice: result.previousPrice,
    timestamp: new Date().toISOString(),
  });
}
