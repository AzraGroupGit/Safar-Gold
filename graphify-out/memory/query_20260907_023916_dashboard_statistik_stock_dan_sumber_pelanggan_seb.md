---
type: "query"
date: "2026-09-07T02:39:16.078096+00:00"
question: "Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa"
contributor: "graphify"
outcome: "useful"
source_nodes: ["AnalyticsClient.tsx", "StockClient.tsx", "customers/route.ts", "movements/route.ts", "sales-summary/route.ts"]
---

# Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa

## Answer

Expanded from original query via graph vocab: analytics, analitik, stock, movements, sales, customers, pelanggan, source, orders, summary. Rekomendasi: jangan menambah sidebar; gunakan tab Keuangan, Stok, dan Sumber Pelanggan dalam menu Analitik. Stok operasional tetap di menu Stok, master customer tetap di Pelanggan. Statistik stok memakai snapshot stock plus riwayat stock_movements dan completed sell order_items; statistik sumber membedakan sumber transaksi orders.source dari sumber akuisisi pelanggan pertama. Jangan tampilkan conversion, CAC, ROAS, atau nilai persediaan aktual sebelum data lead, biaya marketing, dan cost basis tersedia.

## Outcome

- Signal: useful

## Source Nodes

- AnalyticsClient.tsx
- StockClient.tsx
- customers/route.ts
- movements/route.ts
- sales-summary/route.ts