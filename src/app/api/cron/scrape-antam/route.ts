import { NextResponse } from "next/server";
import { setSetting, getSetting } from "@/lib/gold-api";

export async function POST() {
  try {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "FIRECRAWL_API_KEY not configured" }, { status: 500 });
    }

    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://www.logammulia.com",
        formats: ["markdown"],
        onlyMainContent: false,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      return NextResponse.json({ error: "Firecrawl scrape failed", detail: data }, { status: 500 });
    }

    const markdown: string = data.data?.markdown ?? "";

    // Parse: "Emas\nHarga/gram Rp2.690.000,00..."
    const emasSection = markdown.match(/Emas\s*\n\s*Harga\/gram\s+Rp([\d.]+)/i);
    let price = 0;

    if (emasSection?.[1]) {
      price = parseInt(emasSection[1].replace(/\./g, ""), 10);
    } else {
      // Fallback: "Harga Terakhir: Rp2.690.000,00"
      const lastPrice = markdown.match(/Harga Terakhir:\s*Rp([\d.]+)/i);
      if (lastPrice?.[1]) {
        price = parseInt(lastPrice[1].replace(/\./g, ""), 10);
      }
    }

    if (price <= 0) {
      return NextResponse.json({ error: "Could not parse gold price", raw: markdown.substring(0, 500) }, { status: 500 });
    }

    const prevRaw = await getSetting("antam_price");
    const prevPrice = prevRaw ? parseInt(prevRaw, 10) || 0 : 0;

    await setSetting("antam_price_prev", String(prevPrice));
    await setSetting("antam_price", String(price));

    return NextResponse.json({
      success: true,
      antamPrice: price,
      previousPrice: prevPrice,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
