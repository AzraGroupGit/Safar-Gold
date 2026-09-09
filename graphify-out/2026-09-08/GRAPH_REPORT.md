# Graph Report - safar-gold  (2026-09-08)

## Corpus Check
- 159 files · ~78,710 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 918 nodes · 1779 edges · 79 communities (65 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `12a35910`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createAdminClient
- PriceApprovalPanel
- (public)/page.tsx
- devDependencies
- normalizeAppRole
- OperationalAnalytics.tsx
- OrdersClient.tsx
- PelangganClient.tsx
- server-user.ts
- smoke-v17.mts
- app/layout.tsx
- AnalyticsCharts.tsx
- tentang/page.tsx
- OrdersClient
- DESIGN.md — Safar Gold "Atelier"
- App Icon
- permissions.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- About Us Hero Image
- Safar Gold Store Interior Hero
- UsersClient
- CsTeamAnalytics.tsx
- Spec: Order Lifecycle Hardening
- regions/route.ts
- Stock Modal Design
- plan.md
- Pekerjaan Selesai
- Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya
- Q: Apakah lifecycle order create edit cancel konsisten?
- dependencies
- analytics.ts
- CsPerformanceClient.tsx
- AnalyticsClient.tsx
- migration.sql
- fetchInternationalGoldPrice
- JenisEmasClient.tsx
- getAllGoldTypes
- Spec: Dashboard Performa CS
- Migrasi v17 — Proteksi Data Operasional dan Pelanggan
- Analytics Chart Visual System
- admin/page.tsx
- Stock Correction
- hasCapability
- react
- scripts
- Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa
- package.json
- eod/route.ts
- gold-api.ts
- PriceChart.tsx
- order-lifecycle.ts
- PricePreviewModal.tsx
- Gold Type Modal Design
- konten/page.tsx
- stock-adjustment.ts
- formatRupiah
- EODClient.tsx
- (public)/harga/page.tsx
- admin-route-auth.test.ts
- migration-security.test.ts
- proxy-convention.test.ts
- SignaturePad
- Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?
- AdminHargaClient
- scrape-antam/route.ts
- local-startup-performance.test.ts
- @supabase/supabase-js

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 65 edges
2. `requireCapability()` - 43 edges
3. `hasCapability()` - 38 edges
4. `formatRupiah()` - 30 edges
5. `requireRole()` - 30 edges
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
- `AnalyticsClient()` --calls--> `formatRupiah()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/AnalyticsClient.tsx → src/lib/gold-api.ts
- `MemberDetail()` --calls--> `formatRupiah()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/CsTeamAnalytics.tsx → src/lib/gold-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (79 total, 14 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.12
Nodes (22): dynamic, GET(), dynamic, GET(), OrderItemQuantity, dynamic, POST(), dynamic (+14 more)

### Community 1 - "PriceApprovalPanel"
Cohesion: 0.24
Nodes (5): PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam()

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (33): PublicLayout(), dynamic, HomePage(), metadata, BackToTop(), CaraTransaksi(), FAQ(), faqs (+25 more)

### Community 3 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 4 - "normalizeAppRole"
Cohesion: 0.13
Nodes (21): fetchRole(), MODE_TABS, AdminLoginPage(), handleSubmit(), loadData(), AdminLayout(), fetchUser(), getPageMeta() (+13 more)

### Community 5 - "OperationalAnalytics.tsx"
Cohesion: 0.21
Nodes (11): baseTooltip, CustomerSourceAnalytics(), horizontalOptions, lineOptions, moneyOptions, StockAnalytics(), stockState(), StockVelocity (+3 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.13
Nodes (16): BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail, TODO: add brand selector UI for buyback if needed, RegionOption (+8 more)

### Community 7 - "PelangganClient.tsx"
Cohesion: 0.12
Nodes (14): Customer, CustomerOrder, PelangganClient(), InvoiceDownloadButton(), downloadPdf(), Props, safeFilename(), buildAddress() (+6 more)

### Community 8 - "server-user.ts"
Cohesion: 0.10
Nodes (31): AnalyticsPage(), dynamic, metadata, dynamic, EODPage(), metadata, dynamic, LaporanPage() (+23 more)

### Community 9 - "smoke-v17.mts"
Cohesion: 0.26
Nodes (14): appRequest(), CheckResult, createSessionCookie(), evaluateBlockedTable(), evaluatePublicSettings(), evaluateRoleOrders(), JsonRecord, main() (+6 more)

### Community 11 - "AnalyticsCharts.tsx"
Cohesion: 0.16
Nodes (14): AnalyticsCharts(), countOptions, fullMoney, horizontalMoneyOptions, lineOptions, tooltipBase, AnalyticsPanel(), ChartInsight() (+6 more)

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

### Community 17 - "permissions.ts"
Cohesion: 0.15
Nodes (20): dynamic, InvoicePage(), Context, DELETE(), dynamic, GET(), PUT(), dynamic (+12 more)

### Community 28 - "UsersClient"
Cohesion: 0.16
Nodes (7): dynamic, metadata, UserRow, UsersClient(), handleSave(), openAdd(), resetForm()

### Community 29 - "CsTeamAnalytics.tsx"
Cohesion: 0.17
Nodes (12): AnalyticsKpiCard(), chartColors, StatusBadge(), SummaryStrip(), Tone, toneClasses, Member, rankOptions (+4 more)

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

### Community 39 - "analytics.ts"
Cohesion: 0.06
Nodes (54): CsPerformancePage(), dynamic, metadata, addDays(), dynamic, GET(), isValidDate(), wibToday() (+46 more)

### Community 40 - "CsPerformanceClient.tsx"
Cohesion: 0.19
Nodes (14): AnalyticsEmptyState(), AnalyticsSkeleton(), addDays(), change(), chartOptions, CsPerformanceClient(), choosePreset(), updateRange() (+6 more)

### Community 43 - "AnalyticsClient.tsx"
Cohesion: 0.22
Nodes (11): addDays(), AnalyticsClient(), choosePreset(), updateRange(), AnalyticsResponse, AnalyticsTab, Change(), dateInWib() (+3 more)

### Community 44 - "migration.sql"
Cohesion: 0.17
Nodes (17): public.adjust_stock_atomic(), public.app_settings, public.apply_stock_delta(), public.cancel_order_atomic(), public.create_order_atomic(), public.customers, public.eod_reports, public.gold_types (+9 more)

### Community 45 - "fetchInternationalGoldPrice"
Cohesion: 0.21
Nodes (19): dynamic, POST(), dynamic, POST(), dynamic, POST(), POST(), dynamic (+11 more)

### Community 46 - "JenisEmasClient.tsx"
Cohesion: 0.06
Nodes (25): ModeModal(), CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug() (+17 more)

### Community 47 - "getAllGoldTypes"
Cohesion: 0.17
Nodes (13): AdminHargaPage(), dynamic, dynamic, JenisEmasPage(), dynamic, metadata, OrdersPage(), dynamic (+5 more)

### Community 48 - "Spec: Dashboard Performa CS"
Cohesion: 0.18
Nodes (10): Admin Team View, Boundaries, Code Style, Objective, Open Questions, Project Structure, Spec: Dashboard Performa CS, Success Criteria (+2 more)

### Community 49 - "Migrasi v17 — Proteksi Data Operasional dan Pelanggan"
Cohesion: 0.25
Nodes (7): Bukti verifikasi, Eksekusi, Migrasi v17 — Proteksi Data Operasional dan Pelanggan, Prasyarat, Rollback dan forward-fix, Smoke test otomatis, Verifikasi database

### Community 50 - "Analytics Chart Visual System"
Cohesion: 0.40
Nodes (4): Analytics Chart Visual System, Applied Views, Direction, Shared Rules

### Community 51 - "admin/page.tsx"
Cohesion: 0.14
Nodes (9): AdminDashboard(), loadSettings(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, AdminSkeleton(), getTodayPrices() (+1 more)

### Community 52 - "Stock Correction"
Cohesion: 0.33
Nodes (5): Acceptance, Objective, Rules, Stock Correction, User Interface

### Community 53 - "hasCapability"
Cohesion: 0.19
Nodes (14): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), normalizePhone() (+6 more)

### Community 55 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, smoke:v17, smoke:v17:anon, smoke:v17:roles, start (+1 more)

### Community 56 - "Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa, Source Nodes

### Community 57 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 58 - "eod/route.ts"
Cohesion: 0.16
Nodes (12): dynamic, EodOrder, EodOrderItem, GET(), GoldTypeCat, POST(), StockSnapshotRow, wibDateStr() (+4 more)

### Community 59 - "gold-api.ts"
Cohesion: 0.17
Nodes (13): CATEGORIES, AppSettingRow, BB_LM_ORDER, BB_LOGAM_ORDER, ComputedPrice, ComputePricesParams, CustomerInput, FormattedPrice (+5 more)

### Community 60 - "PriceChart.tsx"
Cohesion: 0.21
Nodes (10): crosshairPlugin, formatCompact(), formatDateLabel(), formatRupiah(), HistoryRow, periods, PriceChart(), SERIES (+2 more)

### Community 61 - "order-lifecycle.ts"
Cohesion: 0.26
Nodes (10): canGenerateEod(), canManageOrders(), finitePositive(), optionalFiniteNumber(), optionalText(), OrderItemInput, OrderType, ParsedOrderMutation (+2 more)

### Community 62 - "PricePreviewModal.tsx"
Cohesion: 0.27
Nodes (8): PreviewPriceItem, Props, CATEGORY_LABELS, formatRupiah(), PreviewItem, PricePreviewModal(), PricePreviewModalProps, perhiasanRank()

### Community 63 - "Gold Type Modal Design"
Cohesion: 0.40
Nodes (4): Add and Edit, Delete, Gold Type Modal Design, Shared Language

### Community 65 - "konten/page.tsx"
Cohesion: 0.28
Nodes (5): AdminKontenClient(), AdminKontenPage(), dynamic, getHeroContent(), HeroContent

### Community 66 - "stock-adjustment.ts"
Cohesion: 0.42
Nodes (7): canManageStock(), parseStockAdjustment(), parseStockCorrection(), positiveInteger(), requiredText(), StockAdjustmentInput, StockCorrectionInput

### Community 67 - "formatRupiah"
Cohesion: 0.29
Nodes (6): CsTeamAnalytics(), MemberDetail(), DailySummary, LaporanClient(), StockRow, formatRupiah()

### Community 68 - "EODClient.tsx"
Cohesion: 0.32
Nodes (7): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot

### Community 69 - "(public)/harga/page.tsx"
Cohesion: 0.32
Nodes (6): dynamic, HargaPage(), metadata, LegalNotice(), TabbedPricelist(), getPriceHistory()

### Community 73 - "SignaturePad"
Cohesion: 0.38
Nodes (4): SignaturePad(), getPos(), move(), start()

### Community 74 - "Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?, Source Nodes

### Community 75 - "AdminHargaClient"
Cohesion: 0.43
Nodes (6): AdminHargaClient(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient()

### Community 76 - "scrape-antam/route.ts"
Cohesion: 0.43
Nodes (6): dynamic, GET(), POST(), run(), firecrawlScrapeAntam(), scrapeAntamPrice()

## Knowledge Gaps
- **313 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+308 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `analytics.ts`, `server-user.ts`, `fetchInternationalGoldPrice`, `permissions.ts`, `hasCapability`, `eod/route.ts`, `gold-api.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `formatRupiah` to `(public)/page.tsx`, `EODClient.tsx`, `OperationalAnalytics.tsx`, `OrdersClient.tsx`, `PelangganClient.tsx`, `CsPerformanceClient.tsx`, `(public)/harga/page.tsx`, `AnalyticsClient.tsx`, `OrdersClient`, `getAllGoldTypes`, `admin/page.tsx`, `gold-api.ts`, `CsTeamAnalytics.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `normalizeAppRole()` connect `normalizeAppRole` to `stock-adjustment.ts`, `OrdersClient.tsx`, `server-user.ts`, `OrdersClient`, `permissions.ts`, `admin/page.tsx`, `hasCapability`, `order-lifecycle.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _313 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07315233785822021 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._