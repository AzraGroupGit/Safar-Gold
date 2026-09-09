---
type: "query"
date: "2026-09-08T02:57:34.703932+00:00"
question: "Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["AdminSidebar", "middleware", "AppRole", "OrdersClient", "EOD", "StockClient", "AnalyticsClient", "CsPerformanceClient"]
---

# Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?

## Answer

Expanded from original query via graph vocab: admin, adminsidebar, middleware, approle, requirerole, orders, customers, stock, eod, laporan, analytics, csperformance. Core data synchronization uses the same Supabase records and created_by correctly scopes own and team performance, but authorization and UI are not fully aligned. P0 findings: CS can access and mutate any order, GP is hidden only in UI but accepted and returned by APIs, invoice access lacks ownership, Stock is visible to CS while every stock API is admin-only, EOD generate is visible while POST is admin-only, and Analytics is hidden in sidebar but direct page access is not blocked. Reports and customers expose global finance and PII to CS. Recommended central capability matrix, own-vs-any order policy, field-level response and mutation filtering, read-only stock for CS, admin-only EOD and global reports, role-specific dashboard, and role-matrix integration and browser tests.

## Outcome

- Signal: useful

## Source Nodes

- AdminSidebar
- middleware
- AppRole
- OrdersClient
- EOD
- StockClient
- AnalyticsClient
- CsPerformanceClient