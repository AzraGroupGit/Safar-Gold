import { NextResponse } from "next/server";
import { internalServerError } from "@/lib/api-response";
import { requireCronOrAdmin } from "@/lib/cron-auth";
import { scrapeAntamPrice } from "@/lib/gold-api";

export const dynamic = "force-dynamic";

async function run(request: Request) {
  try {
    const authorization = await requireCronOrAdmin(request);
    if (!authorization.ok) return authorization.response;

    const result = await scrapeAntamPrice();
    if (!result.success) {
      return internalServerError("cron.scrape-antam.provider", result);
    }

    return NextResponse.json({
      success: true,
      antamPrice: result.antamPrice,
      previousPrice: result.previousPrice,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return internalServerError("cron.scrape-antam", error);
  }
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}
