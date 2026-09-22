# Graph Report - safar-gold  (2026-09-22)

## Corpus Check
- 177 files · ~90,976 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1051 nodes · 2281 edges · 79 communities (64 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d497766`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- order-cart-presentation.ts
- PricePreviewModal.tsx
- (public)/page.tsx
- devDependencies
- pelanggan/page.tsx
- InvoiceDownloadButton.tsx
- OrdersClient.tsx
- analytics.ts
- formatRupiah
- smoke-v17.mts
- app/layout.tsx
- PriceApprovalPanel
- tentang/page.tsx
- OrdersClient
- DESIGN.md — Safar Gold "Atelier"
- App Icon
- server-user.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- About Us Hero Image
- Safar Gold Store Interior Hero
- UsersClient
- Spec: Order Lifecycle Hardening
- regions/route.ts
- Stock Modal Design
- plan.md
- Pekerjaan Selesai
- Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya
- Q: Apakah lifecycle order create edit cancel konsisten?
- dependencies
- AdminHargaClient.tsx
- cs-performance-privacy.test.ts
- internalServerError
- migration.sql
- admin-input.ts
- gold-api.ts
- Q: Scraping tool apa untuk fallback XAU XAG dan XPD?
- Spec: Dashboard Performa CS
- Migrasi v17 — Proteksi Data Operasional dan Pelanggan
- Analytics Chart Visual System
- Q: Task todo.md mana yang penting dikerjakan lebih dahulu tanpa overengineering?
- Stock Correction
- react
- scripts
- Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa
- package.json
- admin/page.tsx
- fetchInternationalGoldPrice
- Gold Type Modal Design
- createClient
- OperationalAnalytics.tsx
- stock-adjustment.ts
- hasCapability
- order-lifecycle.ts
- admin-route-auth.test.ts
- migration-security.test.ts
- proxy-convention.test.ts
- PelangganClient.tsx
- Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?
- PriceChart.tsx
- Q: Apalagi untuk selanjutnya?
- local-startup-performance.test.ts
- SignaturePad
- PelangganClient
- LaporanClient.tsx
- createAnonClient
- publish-prices/route.ts
- next

## God Nodes (most connected - your core abstractions)
1. `internalServerError()` - 74 edges
2. `createAdminClient()` - 66 edges
3. `validationError()` - 48 edges
4. `requireCapability()` - 43 edges
5. `hasCapability()` - 38 edges
6. `requireRole()` - 32 edges
7. `formatRupiah()` - 28 edges
8. `getUserRole()` - 25 edges
9. `OrdersClient()` - 24 edges
10. `normalizeAppRole()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Favicon Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/favicon.png → src/app/icon.png
- `Safar Gold Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/logo-1.webp → src/app/icon.png
- `MemberDetail()` --calls--> `formatRupiah()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/CsTeamAnalytics.tsx → src/lib/gold-api.ts
- `loadSettings()` --calls--> `createAnonClient()`  [EXTRACTED]
  src/app/(admin)/admin/page.tsx → src/lib/supabase/anon.ts
- `Change()` --calls--> `calculateChangePercent()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/AnalyticsClient.tsx → src/lib/analytics.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (79 total, 15 thin omitted)

### Community 0 - "order-cart-presentation.ts"
Cohesion: 0.32
Nodes (6): currencyFormatter, formatOrderAddress(), getOrderItemDetails(), numberFormatter, OrderAddressInput, OrderItemDetailInput

### Community 1 - "PricePreviewModal.tsx"
Cohesion: 0.17
Nodes (12): PreviewPriceItem, Props, CATEGORY_LABELS, formatRupiah(), PreviewItem, PricePreviewModal(), PricePreviewModalProps, CATEGORIES (+4 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (33): PublicLayout(), dynamic, HomePage(), metadata, BackToTop(), CaraTransaksi(), FAQ(), faqs (+25 more)

### Community 3 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 4 - "pelanggan/page.tsx"
Cohesion: 0.50
Nodes (4): dynamic, metadata, PelangganPage(), getPublicSettings()

### Community 5 - "InvoiceDownloadButton.tsx"
Cohesion: 0.50
Nodes (4): InvoiceDownloadButton(), downloadPdf(), Props, safeFilename()

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.18
Nodes (10): BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail, TODO: add brand selector UI for buyback if needed, RegionOption (+2 more)

### Community 7 - "analytics.ts"
Cohesion: 0.05
Nodes (62): Change(), addDays(), dynamic, GET(), isValidDate(), wibToday(), dynamic, GET() (+54 more)

### Community 8 - "formatRupiah"
Cohesion: 0.11
Nodes (22): AdminHargaPage(), dynamic, dynamic, JenisEmasPage(), dynamic, metadata, OrdersPage(), AdminDashboard() (+14 more)

### Community 9 - "smoke-v17.mts"
Cohesion: 0.26
Nodes (14): appRequest(), CheckResult, createSessionCookie(), evaluateBlockedTable(), evaluatePublicSettings(), evaluateRoleOrders(), JsonRecord, main() (+6 more)

### Community 11 - "PriceApprovalPanel"
Cohesion: 0.13
Nodes (12): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot, PriceApprovalPanel() (+4 more)

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

### Community 17 - "server-user.ts"
Cohesion: 0.14
Nodes (20): AnalyticsPage(), dynamic, metadata, dynamic, EODPage(), metadata, dynamic, LaporanPage() (+12 more)

### Community 28 - "UsersClient"
Cohesion: 0.16
Nodes (7): dynamic, metadata, UserRow, UsersClient(), handleSave(), openAdd(), resetForm()

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

### Community 39 - "AdminHargaClient.tsx"
Cohesion: 0.05
Nodes (33): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient(), MODE_TABS (+25 more)

### Community 43 - "internalServerError"
Cohesion: 0.05
Nodes (96): POST(), dynamic, GET(), dynamic, GET(), dynamic, GET(), POST() (+88 more)

### Community 44 - "migration.sql"
Cohesion: 0.17
Nodes (17): public.adjust_stock_atomic(), public.app_settings, public.apply_stock_delta(), public.cancel_order_atomic(), public.create_order_atomic(), public.customers, public.eod_reports, public.gold_types (+9 more)

### Community 45 - "admin-input.ts"
Cohesion: 0.11
Nodes (35): AdminUserCreateInput, AdminUserRole, AdminUserUpdateInput, CustomerMutationInput, DailyReportRange, GOLD_TYPE_CATEGORIES, GoldTypeCategory, GoldTypeCreateInput (+27 more)

### Community 46 - "gold-api.ts"
Cohesion: 0.12
Nodes (15): AdminKontenClient(), AdminKontenPage(), dynamic, AppSettingRow, ComputedPrice, ComputePricesParams, CustomerInput, getHeroContent() (+7 more)

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

### Community 55 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, smoke:v17, smoke:v17:anon, smoke:v17:roles, start (+1 more)

### Community 56 - "Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa, Source Nodes

### Community 57 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 62 - "fetchInternationalGoldPrice"
Cohesion: 0.15
Nodes (21): dynamic, GET(), POST(), run(), dynamic, GET(), hasValidCronSecret(), requireCronOrAdmin() (+13 more)

### Community 63 - "Gold Type Modal Design"
Cohesion: 0.40
Nodes (4): Add and Edit, Delete, Gold Type Modal Design, Shared Language

### Community 65 - "createClient"
Cohesion: 0.14
Nodes (17): AdminLoginPage(), handleSubmit(), AdminLayout(), fetchUser(), getPageMeta(), pageMeta, AdminSidebar(), fetchRole() (+9 more)

### Community 66 - "OperationalAnalytics.tsx"
Cohesion: 0.05
Nodes (61): AnalyticsCharts(), countOptions, fullMoney, horizontalMoneyOptions, lineOptions, tooltipBase, addDays(), AnalyticsClient() (+53 more)

### Community 67 - "stock-adjustment.ts"
Cohesion: 0.31
Nodes (12): brandName(), canManageStock(), goldTypeId(), integerInRange(), parseStockAdjustment(), parseStockCorrection(), parseStockMinimum(), requiredText() (+4 more)

### Community 68 - "hasCapability"
Cohesion: 0.26
Nodes (13): dynamic, InvoicePage(), canAccessOrder(), canManageOrder(), CUSTOMER_SENSITIVE_FIELDS, hasCapability(), normalizeAppRole(), PAGE_CAPABILITY_RULES (+5 more)

### Community 69 - "order-lifecycle.ts"
Cohesion: 0.23
Nodes (12): boundedOptionalText(), canGenerateEod(), canManageOrders(), finitePositive(), optionalBoundedInteger(), optionalText(), OrderItemInput, OrderType (+4 more)

### Community 73 - "PelangganClient.tsx"
Cohesion: 0.39
Nodes (6): Customer, CustomerOrder, buildAddress(), InvoiceOrder, InvoiceSettings, OrderInvoice()

### Community 74 - "Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?, Source Nodes

### Community 75 - "PriceChart.tsx"
Cohesion: 0.21
Nodes (10): crosshairPlugin, formatCompact(), formatDateLabel(), formatRupiah(), HistoryRow, periods, PriceChart(), SERIES (+2 more)

### Community 76 - "Q: Apalagi untuk selanjutnya?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apalagi untuk selanjutnya?, Source Nodes

### Community 77 - "local-startup-performance.test.ts"
Cohesion: 0.50
Nodes (3): packageJson, publicSiteData, rootLayout

### Community 78 - "SignaturePad"
Cohesion: 0.38
Nodes (4): SignaturePad(), getPos(), move(), start()

### Community 80 - "PelangganClient"
Cohesion: 0.22
Nodes (4): PelangganClient(), Purchase, summarizeCustomerPurchases(), formatDate()

### Community 84 - "LaporanClient.tsx"
Cohesion: 0.40
Nodes (3): DailySummary, LaporanClient(), StockRow

### Community 87 - "createAnonClient"
Cohesion: 0.31
Nodes (5): AdminPengaturanClient(), AdminPengaturanPage(), dynamic, getTodayPrices(), createAnonClient()

### Community 89 - "publish-prices/route.ts"
Cohesion: 0.26
Nodes (15): dynamic, POST(), dynamic, POST(), dynamic, POST(), parsePriceInput(), calculatePrices() (+7 more)

## Knowledge Gaps
- **366 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+361 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `fetchInternationalGoldPrice()` (2× useful, score=1.970613076) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `internalServerError` to `hasCapability`, `analytics.ts`, `gold-api.ts`, `publish-prices/route.ts`, `fetchInternationalGoldPrice`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `formatRupiah` to `PricePreviewModal.tsx`, `OperationalAnalytics.tsx`, `(public)/page.tsx`, `OrdersClient.tsx`, `PelangganClient.tsx`, `PriceApprovalPanel`, `OrdersClient`, `gold-api.ts`, `PelangganClient`, `LaporanClient.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `normalizeAppRole()` connect `hasCapability` to `createClient`, `stock-adjustment.ts`, `order-lifecycle.ts`, `OrdersClient.tsx`, `AdminHargaClient.tsx`, `formatRupiah`, `OrdersClient`, `server-user.ts`, `admin/page.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _366 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07315233785822021 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `analytics.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05365686944634313 - nodes in this community are weakly interconnected._