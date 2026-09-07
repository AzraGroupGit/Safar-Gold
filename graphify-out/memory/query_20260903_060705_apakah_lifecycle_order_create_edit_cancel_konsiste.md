---
type: "query"
date: "2026-09-03T06:07:05.060955+00:00"
question: "Apakah lifecycle order create edit cancel konsisten?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OrdersClient", "middleware", "EODClient"]
---

# Q: Apakah lifecycle order create edit cancel konsisten?

## Answer

Tidak sepenuhnya. Happy path tersedia, tetapi create, edit, cancel, customer upsert, order_items, stock, and stock_movements dijalankan sebagai banyak operasi non-transactional dan sebagian error diabaikan. Brand dipakai saat create tetapi hilang pada reversal/edit, cancelled order masih dapat diedit, nomor order/invoice berbasis count rentan race, client mengirim priceTotal dan createdBy, dan EOD yang sudah dibuat tidak direkonsiliasi setelah edit/cancel.

## Outcome

- Signal: useful

## Source Nodes

- OrdersClient
- middleware
- EODClient