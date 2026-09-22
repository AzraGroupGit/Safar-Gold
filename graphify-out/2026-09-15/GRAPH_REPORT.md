# Graph Report - safar-gold  (2026-09-15)

## Corpus Check
- 175 files · ~89,685 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1043 nodes · 2253 edges · 84 communities (69 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d497766`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cs-performance.ts
- PricePreviewModal.tsx
- (public)/page.tsx
- devDependencies
- operational-analytics.ts
- CsPerformanceClient.tsx
- OrdersClient.tsx
- analytics.ts
- getAllGoldTypes
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
- OperationalAnalytics.tsx
- Spec: Order Lifecycle Hardening
- regions/route.ts
- Stock Modal Design
- plan.md
- Pekerjaan Selesai
- Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya
- Q: Apakah lifecycle order create edit cancel konsisten?
- dependencies
- JenisEmasClient.tsx
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
- Calculator.tsx
- react
- scripts
- Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa
- package.json
- StockClient.tsx
- AnalyticsClient.tsx
- AdminHargaClient.tsx
- admin/page.tsx
- StockClient
- Gold Type Modal Design
- order-cart-presentation.ts
- AnalyticsCharts.tsx
- stock-adjustment.ts
- AdminHargaClient
- @supabase/supabase-js
- admin-route-auth.test.ts
- migration-security.test.ts
- proxy-convention.test.ts
- PelangganClient.tsx
- Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?
- PriceChart.tsx
- Q: Apalagi untuk selanjutnya?
- local-startup-performance.test.ts
- SignaturePad
- CsTeamAnalytics.tsx
- PelangganClient
- (public)/harga/page.tsx
- formatRupiah
- EODClient.tsx

## God Nodes (most connected - your core abstractions)
1. `internalServerError()` - 72 edges
2. `createAdminClient()` - 65 edges
3. `validationError()` - 48 edges
4. `requireCapability()` - 43 edges
5. `hasCapability()` - 38 edges
6. `requireRole()` - 30 edges
7. `formatRupiah()` - 28 edges
8. `getUserRole()` - 25 edges
9. `OrdersClient()` - 24 edges
10. `normalizeAppRole()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Favicon Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/favicon.png → src/app/icon.png
- `Safar Gold Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/logo-1.webp → src/app/icon.png
- `Change()` --calls--> `calculateChangePercent()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/AnalyticsClient.tsx → src/lib/analytics.ts
- `MemberDetail()` --calls--> `formatRupiah()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/CsTeamAnalytics.tsx → src/lib/gold-api.ts
- `JenisEmasPage()` --calls--> `getAllGoldTypes()`  [EXTRACTED]
  src/app/(admin)/admin/jenis-emas/page.tsx → src/lib/gold-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (84 total, 15 thin omitted)

### Community 0 - "cs-performance.ts"
Cohesion: 0.10
Nodes (26): addDays(), dynamic, GET(), isValidDate(), wibToday(), addDays(), dynamic, GET() (+18 more)

### Community 1 - "PricePreviewModal.tsx"
Cohesion: 0.17
Nodes (13): PreviewPriceItem, Props, CATEGORY_LABELS, formatRupiah(), PreviewItem, PricePreviewModal(), PricePreviewModalProps, CATEGORIES (+5 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (33): PublicLayout(), dynamic, HomePage(), metadata, BackToTop(), CaraTransaksi(), FAQ(), faqs (+25 more)

### Community 3 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 4 - "operational-analytics.ts"
Cohesion: 0.20
Nodes (16): addDay(), dynamic, GET(), AnalyticsGrain, aggregateCustomerSources(), aggregateStockAnalytics(), bucket(), CustomerSourceAnalyticsResult (+8 more)

### Community 5 - "CsPerformanceClient.tsx"
Cohesion: 0.19
Nodes (14): AnalyticsSkeleton(), StatusBadge(), addDays(), change(), chartOptions, CsPerformanceClient(), choosePreset(), updateRange() (+6 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.18
Nodes (10): BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail, TODO: add brand selector UI for buyback if needed, RegionOption (+2 more)

### Community 7 - "analytics.ts"
Cohesion: 0.22
Nodes (15): addDays(), dynamic, GET(), isValidDate(), loadOrders(), wibToday(), addDays(), aggregateAnalytics() (+7 more)

### Community 8 - "getAllGoldTypes"
Cohesion: 0.26
Nodes (9): AdminHargaPage(), dynamic, dynamic, metadata, OrdersPage(), loadData(), KalkulatorPage(), getAllGoldTypes() (+1 more)

### Community 9 - "smoke-v17.mts"
Cohesion: 0.26
Nodes (14): appRequest(), CheckResult, createSessionCookie(), evaluateBlockedTable(), evaluatePublicSettings(), evaluateRoleOrders(), JsonRecord, main() (+6 more)

### Community 11 - "PriceApprovalPanel"
Cohesion: 0.24
Nodes (5): PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam()

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
Cohesion: 0.05
Nodes (69): AnalyticsPage(), dynamic, metadata, dynamic, EODPage(), metadata, dynamic, LaporanPage() (+61 more)

### Community 28 - "UsersClient"
Cohesion: 0.16
Nodes (7): dynamic, metadata, UserRow, UsersClient(), handleSave(), openAdd(), resetForm()

### Community 29 - "OperationalAnalytics.tsx"
Cohesion: 0.24
Nodes (10): baseTooltip, CustomerSourceAnalytics(), horizontalOptions, lineOptions, moneyOptions, StockAnalytics(), stockState(), StockVelocity (+2 more)

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
Nodes (17): chart.js, next, dependencies, chart.js, html2canvas, jspdf, next, react-chartjs-2 (+9 more)

### Community 39 - "JenisEmasClient.tsx"
Cohesion: 0.16
Nodes (9): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), dynamic (+1 more)

### Community 43 - "internalServerError"
Cohesion: 0.05
Nodes (92): dynamic, GET(), POST(), dynamic, GET(), dynamic, GET(), POST() (+84 more)

### Community 44 - "migration.sql"
Cohesion: 0.17
Nodes (17): public.adjust_stock_atomic(), public.app_settings, public.apply_stock_delta(), public.cancel_order_atomic(), public.create_order_atomic(), public.customers, public.eod_reports, public.gold_types (+9 more)

### Community 45 - "admin-input.ts"
Cohesion: 0.11
Nodes (36): AdminUserCreateInput, AdminUserRole, AdminUserUpdateInput, CustomerMutationInput, DailyReportRange, GOLD_TYPE_CATEGORIES, GoldTypeCategory, GoldTypeCreateInput (+28 more)

### Community 46 - "gold-api.ts"
Cohesion: 0.07
Nodes (51): AdminKontenClient(), AdminKontenPage(), dynamic, loadSettings(), AdminPengaturanClient(), AdminPengaturanPage(), dynamic, dynamic (+43 more)

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

### Community 53 - "Calculator.tsx"
Cohesion: 0.27
Nodes (9): Calculator(), switchTransaction(), CATEGORY_LABELS, formatRupiahClient(), quickQty, quickWeights, SELL_CATEGORY_ORDER, orderIndex() (+1 more)

### Community 55 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, smoke:v17, smoke:v17:anon, smoke:v17:roles, start (+1 more)

### Community 56 - "Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa, Source Nodes

### Community 57 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 58 - "StockClient.tsx"
Cohesion: 0.29
Nodes (6): BRAND_OPTIONS, CATEGORY_LABELS, CATEGORY_ORDER, Movement, StockRow, AdminModalShell()

### Community 59 - "AnalyticsClient.tsx"
Cohesion: 0.22
Nodes (11): addDays(), AnalyticsClient(), choosePreset(), updateRange(), AnalyticsResponse, AnalyticsTab, Change(), dateInWib() (+3 more)

### Community 60 - "AdminHargaClient.tsx"
Cohesion: 0.33
Nodes (3): MODE_TABS, ModeModal(), GoldTypeRow

### Community 61 - "admin/page.tsx"
Cohesion: 0.18
Nodes (6): AdminLoginPage(), handleSubmit(), dynamic, AdminSkeleton(), SignatureSection(), createClient()

### Community 63 - "Gold Type Modal Design"
Cohesion: 0.40
Nodes (4): Add and Edit, Delete, Gold Type Modal Design, Shared Language

### Community 65 - "order-cart-presentation.ts"
Cohesion: 0.32
Nodes (6): currencyFormatter, formatOrderAddress(), getOrderItemDetails(), numberFormatter, OrderAddressInput, OrderItemDetailInput

### Community 66 - "AnalyticsCharts.tsx"
Cohesion: 0.16
Nodes (14): AnalyticsCharts(), countOptions, fullMoney, horizontalMoneyOptions, lineOptions, tooltipBase, AnalyticsPanel(), chartColors (+6 more)

### Community 67 - "stock-adjustment.ts"
Cohesion: 0.31
Nodes (12): brandName(), canManageStock(), goldTypeId(), integerInRange(), parseStockAdjustment(), parseStockCorrection(), parseStockMinimum(), requiredText() (+4 more)

### Community 68 - "AdminHargaClient"
Cohesion: 0.36
Nodes (7): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient()

### Community 73 - "PelangganClient.tsx"
Cohesion: 0.23
Nodes (10): Customer, CustomerOrder, InvoiceDownloadButton(), downloadPdf(), Props, safeFilename(), buildAddress(), InvoiceOrder (+2 more)

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

### Community 79 - "CsTeamAnalytics.tsx"
Cohesion: 0.15
Nodes (14): AnalyticsEmptyState(), AnalyticsKpiCard(), ChartInsight(), SummaryStrip(), Tone, toneClasses, CsTeamAnalytics(), Member (+6 more)

### Community 80 - "PelangganClient"
Cohesion: 0.22
Nodes (4): PelangganClient(), Purchase, summarizeCustomerPurchases(), formatDate()

### Community 81 - "(public)/harga/page.tsx"
Cohesion: 0.27
Nodes (7): dynamic, HargaPage(), metadata, dynamic, metadata, LegalNotice(), getPriceHistory()

### Community 82 - "formatRupiah"
Cohesion: 0.33
Nodes (5): DailySummary, LaporanClient(), StockRow, AdminDashboard(), formatRupiah()

### Community 84 - "EODClient.tsx"
Cohesion: 0.32
Nodes (7): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot

## Knowledge Gaps
- **364 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+359 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `fetchInternationalGoldPrice()` (2× useful, score=1.970613076) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `internalServerError` to `cs-performance.ts`, `operational-analytics.ts`, `analytics.ts`, `gold-api.ts`, `server-user.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `formatRupiah` to `PricePreviewModal.tsx`, `(public)/page.tsx`, `OrdersClient.tsx`, `getAllGoldTypes`, `PelangganClient.tsx`, `OrdersClient`, `gold-api.ts`, `CsTeamAnalytics.tsx`, `PelangganClient`, `(public)/harga/page.tsx`, `admin/page.tsx`, `EODClient.tsx`, `AnalyticsClient.tsx`, `OperationalAnalytics.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `normalizeAppRole()` connect `server-user.ts` to `stock-adjustment.ts`, `AdminHargaClient`, `OrdersClient.tsx`, `getAllGoldTypes`, `OrdersClient`, `AdminHargaClient.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _364 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cs-performance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10160427807486631 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07315233785822021 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._