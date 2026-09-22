# Graph Report - safar-gold  (2026-09-14)

## Corpus Check
- 166 files · ~81,076 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 957 nodes · 1862 edges · 72 communities (58 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d497766`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- analytics.ts
- PriceApprovalPanel
- (public)/page.tsx
- devDependencies
- admin/page.tsx
- server-user.ts
- OrdersClient.tsx
- PelangganClient
- hasCapability
- smoke-v17.mts
- app/layout.tsx
- OperationalAnalytics.tsx
- tentang/page.tsx
- OrdersClient
- DESIGN.md — Safar Gold "Atelier"
- App Icon
- orders/[id]/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- About Us Hero Image
- Safar Gold Store Interior Hero
- UsersClient
- eod/route.ts
- Spec: Order Lifecycle Hardening
- regions/route.ts
- Stock Modal Design
- plan.md
- Pekerjaan Selesai
- Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya
- Q: Apakah lifecycle order create edit cancel konsisten?
- dependencies
- cs-performance.ts
- cs-performance-privacy.test.ts
- formatRupiah
- migration.sql
- gold-api.ts
- getAllGoldTypes
- Q: Scraping tool apa untuk fallback XAU XAG dan XPD?
- Spec: Dashboard Performa CS
- Migrasi v17 — Proteksi Data Operasional dan Pelanggan
- Analytics Chart Visual System
- Q: Task todo.md mana yang penting dikerjakan lebih dahulu tanpa overengineering?
- Stock Correction
- createAdminClient
- react
- scripts
- Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa
- package.json
- next
- JenisEmasClient.tsx
- stock-adjustment.ts
- Gold Type Modal Design
- order-cart-presentation.ts
- SignaturePad
- EODClient.tsx
- InvoiceDownloadButton.tsx
- admin-route-auth.test.ts
- migration-security.test.ts
- proxy-convention.test.ts
- Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?
- local-startup-performance.test.ts

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 65 edges
2. `requireCapability()` - 43 edges
3. `hasCapability()` - 38 edges
4. `requireRole()` - 30 edges
5. `formatRupiah()` - 28 edges
6. `getUserRole()` - 25 edges
7. `OrdersClient()` - 24 edges
8. `normalizeAppRole()` - 21 edges
9. `getAllGoldTypes()` - 18 edges
10. `getServerUser()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Favicon Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/favicon.png → src/app/icon.png
- `Safar Gold Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/logo-1.webp → src/app/icon.png
- `Change()` --calls--> `calculateChangePercent()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/AnalyticsClient.tsx → src/lib/analytics.ts
- `loadSettings()` --calls--> `createAnonClient()`  [EXTRACTED]
  src/app/(admin)/admin/page.tsx → src/lib/supabase/anon.ts
- `AnalyticsClient()` --calls--> `formatRupiah()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/AnalyticsClient.tsx → src/lib/gold-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (72 total, 14 thin omitted)

### Community 0 - "analytics.ts"
Cohesion: 0.10
Nodes (34): dynamic, GET(), addDays(), dynamic, GET(), isValidDate(), loadOrders(), wibToday() (+26 more)

### Community 1 - "PriceApprovalPanel"
Cohesion: 0.10
Nodes (17): PreviewPriceItem, PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam(), Props, CATEGORY_LABELS (+9 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (33): PublicLayout(), dynamic, HomePage(), metadata, BackToTop(), CaraTransaksi(), FAQ(), faqs (+25 more)

### Community 3 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 4 - "admin/page.tsx"
Cohesion: 0.06
Nodes (39): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient(), MODE_TABS (+31 more)

### Community 5 - "server-user.ts"
Cohesion: 0.16
Nodes (17): POST(), DELETE(), PUT(), dynamic, GET(), PUT(), DELETE(), dynamic (+9 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.18
Nodes (10): BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail, TODO: add brand selector UI for buyback if needed, RegionOption (+2 more)

### Community 7 - "PelangganClient"
Cohesion: 0.22
Nodes (4): PelangganClient(), Purchase, summarizeCustomerPurchases(), formatDate()

### Community 8 - "hasCapability"
Cohesion: 0.12
Nodes (29): AnalyticsPage(), dynamic, metadata, dynamic, EODPage(), metadata, dynamic, LaporanPage() (+21 more)

### Community 9 - "smoke-v17.mts"
Cohesion: 0.26
Nodes (14): appRequest(), CheckResult, createSessionCookie(), evaluateBlockedTable(), evaluatePublicSettings(), evaluateRoleOrders(), JsonRecord, main() (+6 more)

### Community 11 - "OperationalAnalytics.tsx"
Cohesion: 0.05
Nodes (61): AnalyticsCharts(), countOptions, fullMoney, horizontalMoneyOptions, lineOptions, tooltipBase, addDays(), AnalyticsClient() (+53 more)

### Community 12 - "tentang/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, timeline, values

### Community 13 - "OrdersClient"
Cohesion: 0.14
Nodes (7): OrdersClient(), applyLookup(), fetchOrders(), handleSubmit(), openEdit(), resetForm(), titleCase()

### Community 14 - "DESIGN.md — Safar Gold "Atelier""
Cohesion: 0.18
Nodes (10): Buttons, Component vocabulary, DESIGN.md — Safar Gold "Atelier", Design tokens, Fonts, Layout / shell, Radius scale, Shadows (+2 more)

### Community 15 - "App Icon"
Cohesion: 0.67
Nodes (3): Favicon Logo, Safar Gold Logo, App Icon

### Community 17 - "orders/[id]/route.ts"
Cohesion: 0.13
Nodes (23): Context, DELETE(), dynamic, GET(), PUT(), dynamic, GET(), POST() (+15 more)

### Community 28 - "UsersClient"
Cohesion: 0.16
Nodes (7): dynamic, metadata, UserRow, UsersClient(), handleSave(), openAdd(), resetForm()

### Community 29 - "eod/route.ts"
Cohesion: 0.20
Nodes (10): dynamic, EodOrder, EodOrderItem, GET(), GoldTypeCat, POST(), StockSnapshotRow, wibDateStr() (+2 more)

### Community 30 - "Spec: Order Lifecycle Hardening"
Cohesion: 0.12
Nodes (16): Boundaries, Cancel, Code Style, Commands, Create, Edit, EOD, Objective (+8 more)

### Community 32 - "Stock Modal Design"
Cohesion: 0.29
Nodes (6): Adjustment, Correction, Direction, Minimum Stock, Shared Shell, Stock Modal Design

### Community 34 - "Pekerjaan Selesai"
Cohesion: 0.06
Nodes (31): Backlog Audit Pre-Deployment, Browser, Accessibility, dan Performance, CI/CD dan Release Safety, Dashboard Analitik, Dashboard Performa CS, Definition of Done Backlog, Dependency Security, Error Handling dan Observability (+23 more)

### Community 35 - "Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya, Source Nodes

### Community 36 - "Q: Apakah lifecycle order create edit cancel konsisten?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apakah lifecycle order create edit cancel konsisten?, Source Nodes

### Community 38 - "dependencies"
Cohesion: 0.12
Nodes (17): chart.js, dependencies, chart.js, html2canvas, jspdf, react-chartjs-2, react-dom, react-google-reviews (+9 more)

### Community 39 - "cs-performance.ts"
Cohesion: 0.11
Nodes (28): CsPerformancePage(), dynamic, metadata, addDays(), dynamic, GET(), isValidDate(), wibToday() (+20 more)

### Community 43 - "formatRupiah"
Cohesion: 0.20
Nodes (11): MemberDetail(), DailySummary, LaporanClient(), StockRow, Customer, CustomerOrder, buildAddress(), InvoiceOrder (+3 more)

### Community 44 - "migration.sql"
Cohesion: 0.17
Nodes (17): public.adjust_stock_atomic(), public.app_settings, public.apply_stock_delta(), public.cancel_order_atomic(), public.create_order_atomic(), public.customers, public.eod_reports, public.gold_types (+9 more)

### Community 45 - "gold-api.ts"
Cohesion: 0.06
Nodes (60): AdminKontenClient(), AdminKontenPage(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, dynamic, POST() (+52 more)

### Community 46 - "getAllGoldTypes"
Cohesion: 0.07
Nodes (31): AdminHargaPage(), dynamic, dynamic, JenisEmasPage(), dynamic, metadata, OrdersPage(), AdminDashboard() (+23 more)

### Community 47 - "Q: Scraping tool apa untuk fallback XAU XAG dan XPD?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Scraping tool apa untuk fallback XAU XAG dan XPD?, Source Nodes

### Community 48 - "Spec: Dashboard Performa CS"
Cohesion: 0.18
Nodes (10): Admin Team View, Boundaries, Code Style, Objective, Open Questions, Project Structure, Spec: Dashboard Performa CS, Success Criteria (+2 more)

### Community 49 - "Migrasi v17 — Proteksi Data Operasional dan Pelanggan"
Cohesion: 0.25
Nodes (7): Bukti verifikasi, Eksekusi, Migrasi v17 — Proteksi Data Operasional dan Pelanggan, Prasyarat, Rollback dan forward-fix, Smoke test otomatis, Verifikasi database

### Community 50 - "Analytics Chart Visual System"
Cohesion: 0.40
Nodes (4): Analytics Chart Visual System, Applied Views, Direction, Shared Rules

### Community 51 - "Q: Task todo.md mana yang penting dikerjakan lebih dahulu tanpa overengineering?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Task todo.md mana yang penting dikerjakan lebih dahulu tanpa overengineering?, Source Nodes

### Community 52 - "Stock Correction"
Cohesion: 0.33
Nodes (5): Acceptance, Objective, Rules, Stock Correction, User Interface

### Community 53 - "createAdminClient"
Cohesion: 0.13
Nodes (25): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), dynamic (+17 more)

### Community 55 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, smoke:v17, smoke:v17:anon, smoke:v17:roles, start (+1 more)

### Community 56 - "Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa, Source Nodes

### Community 57 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 59 - "JenisEmasClient.tsx"
Cohesion: 0.08
Nodes (15): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), BRAND_OPTIONS (+7 more)

### Community 61 - "stock-adjustment.ts"
Cohesion: 0.24
Nodes (11): dynamic, POST(), dynamic, POST(), canManageStock(), parseStockAdjustment(), parseStockCorrection(), positiveInteger() (+3 more)

### Community 63 - "Gold Type Modal Design"
Cohesion: 0.40
Nodes (4): Add and Edit, Delete, Gold Type Modal Design, Shared Language

### Community 65 - "order-cart-presentation.ts"
Cohesion: 0.32
Nodes (6): currencyFormatter, formatOrderAddress(), getOrderItemDetails(), numberFormatter, OrderAddressInput, OrderItemDetailInput

### Community 67 - "SignaturePad"
Cohesion: 0.38
Nodes (4): SignaturePad(), getPos(), move(), start()

### Community 68 - "EODClient.tsx"
Cohesion: 0.32
Nodes (7): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot

### Community 69 - "InvoiceDownloadButton.tsx"
Cohesion: 0.50
Nodes (4): InvoiceDownloadButton(), downloadPdf(), Props, safeFilename()

### Community 74 - "Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?, Source Nodes

### Community 77 - "local-startup-performance.test.ts"
Cohesion: 0.50
Nodes (3): packageJson, publicSiteData, rootLayout

## Knowledge Gaps
- **330 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+325 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `analytics.ts`, `server-user.ts`, `cs-performance.ts`, `hasCapability`, `gold-api.ts`, `orders/[id]/route.ts`, `stock-adjustment.ts`, `eod/route.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `formatRupiah` to `PriceApprovalPanel`, `(public)/page.tsx`, `admin/page.tsx`, `EODClient.tsx`, `OrdersClient.tsx`, `PelangganClient`, `OperationalAnalytics.tsx`, `OrdersClient`, `getAllGoldTypes`, `gold-api.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `normalizeAppRole()` connect `hasCapability` to `admin/page.tsx`, `server-user.ts`, `OrdersClient.tsx`, `OrdersClient`, `getAllGoldTypes`, `orders/[id]/route.ts`, `stock-adjustment.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _330 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `analytics.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09878048780487805 - nodes in this community are weakly interconnected._
- **Should `PriceApprovalPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.10153846153846154 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07315233785822021 - nodes in this community are weakly interconnected._