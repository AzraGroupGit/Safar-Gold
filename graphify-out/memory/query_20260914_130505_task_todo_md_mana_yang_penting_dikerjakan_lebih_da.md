---
type: "query"
date: "2026-09-14T13:05:05.860182+00:00"
question: "Task todo.md mana yang penting dikerjakan lebih dahulu tanpa overengineering?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["todo.md", "publish-prices/route.ts", "fetchInternationalGoldPrice()"]
---

# Q: Task todo.md mana yang penting dikerjakan lebih dahulu tanpa overengineering?

## Answer

Expanded via graph vocab: todo, security, test, migration, order, stock, price, analytics, performance. Prioritas pertama adalah slice kecil Validasi dan Kontrak API pada endpoint mutasi harga/settings: tolak input angka tidak valid, batasi format/panjang, sanitasi error browser, dan periksa error Supabase. Setelah itu pecah konsistensi transaksi menjadi tiga pekerjaan terpisah: publikasi harga atomik, customer upsert ON CONFLICT, lalu idempotensi EOD. CI minimal dan header keamanan dasar dilakukan sebelum produksi. Pagination, refactor besar, observability penuh, full E2E, CSP ketat, bundle analysis, dan optimasi query ditunda sampai ada kebutuhan atau bukti performa.

## Outcome

- Signal: useful

## Source Nodes

- todo.md
- publish-prices/route.ts
- fetchInternationalGoldPrice()