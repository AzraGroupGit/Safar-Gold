---
type: "query"
date: "2026-09-14T09:50:19.646559+00:00"
question: "Scraping tool apa untuk fallback XAU XAG dan XPD?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["firecrawlScrapeAntam()", "fetchInternationalGoldPrice()", "fetchAllFallbackPrices()"]
---

# Q: Scraping tool apa untuk fallback XAU XAG dan XPD?

## Answer

Expanded from original query via vocab: fetch, fallback, scrape, firecrawl, gold, international, price, api. Firecrawl v2 paling konsisten dengan project karena firecrawlScrapeAntam sudah tersedia. Jika sumber mengizinkan otomatisasi, gunakan rendered markdown atau HTML dan parser deterministik; panggil secara lazy hanya untuk simbol yang gagal, validasi nilai, lalu simpan last-known-good. Namun TradingView melarang automated data collection dan non-display market-data usage, sehingga sumber tersebut tidak layak diimplementasikan tanpa izin tertulis; gunakan API data berlisensi sebagai fallback produksi.

## Outcome

- Signal: useful

## Source Nodes

- firecrawlScrapeAntam()
- fetchInternationalGoldPrice()
- fetchAllFallbackPrices()