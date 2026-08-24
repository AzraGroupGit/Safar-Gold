import { NextResponse } from "next/server";
import { scrapeAntamPrice } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

async function run() {
  const result = await scrapeAntamPrice();
  if (!result.success) {
    return NextResponse.json(
      { error: result.error, detail: result.detail },
      { status: 500 },
    );
  }
  return NextResponse.json({
    success: true,
    antamPrice: result.antamPrice,
    previousPrice: result.previousPrice,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return run();
}

export async function POST() {
  return run();
}
