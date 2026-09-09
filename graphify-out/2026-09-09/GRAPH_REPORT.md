# Graph Report - safar-gold  (2026-09-09)

## Corpus Check
- 160 files · ~78,949 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 926 nodes · 1787 edges · 68 communities (54 shown, 14 thin omitted)
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
- admin/page.tsx
- server-user.ts
- OrdersClient.tsx
- PelangganClient
- getServerUser
- smoke-v17.mts
- app/layout.tsx
- OperationalAnalytics.tsx
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
- eod/route.ts
- Spec: Order Lifecycle Hardening
- regions/route.ts
- Stock Modal Design
- plan.md
- Pekerjaan Selesai
- Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya
- Q: Apakah lifecycle order create edit cancel konsisten?
- dependencies
- analytics.ts
- cs-performance-privacy.test.ts
- PelangganClient.tsx
- migration.sql
- gold-api.ts
- Spec: Dashboard Performa CS
- Migrasi v17 — Proteksi Data Operasional dan Pelanggan
- Analytics Chart Visual System
- Stock Correction
- requireCapability
- react
- scripts
- Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa
- package.json
- orders/route.ts
- AdminHargaClient.tsx
- PriceChart.tsx
- normalizeAppRole
- Gold Type Modal Design
- EODClient.tsx
- admin-route-auth.test.ts
- migration-security.test.ts
- proxy-convention.test.ts
- Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?
- next
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
- `MemberDetail()` --calls--> `formatRupiah()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/CsTeamAnalytics.tsx → src/lib/gold-api.ts
- `AnalyticsPage()` --calls--> `hasCapability()`  [EXTRACTED]
  src/app/(admin)/admin/analitik/page.tsx → src/lib/permissions.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (68 total, 14 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.12
Nodes (19): dynamic, GET(), dynamic, GET(), OrderItemQuantity, dynamic, POST(), dynamic (+11 more)

### Community 1 - "PriceApprovalPanel"
Cohesion: 0.10
Nodes (18): PreviewPriceItem, PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam(), Props, CATEGORY_LABELS (+10 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (33): PublicLayout(), dynamic, HomePage(), metadata, BackToTop(), CaraTransaksi(), FAQ(), faqs (+25 more)

### Community 3 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 4 - "admin/page.tsx"
Cohesion: 0.08
Nodes (23): AdminLoginPage(), handleSubmit(), dynamic, AdminLayout(), fetchUser(), getPageMeta(), pageMeta, AdminSidebar() (+15 more)

### Community 5 - "server-user.ts"
Cohesion: 0.17
Nodes (16): POST(), DELETE(), PUT(), POST(), POST(), DELETE(), dynamic, GET() (+8 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.13
Nodes (16): BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail, TODO: add brand selector UI for buyback if needed, RegionOption (+8 more)

### Community 7 - "PelangganClient"
Cohesion: 0.22
Nodes (4): PelangganClient(), Purchase, summarizeCustomerPurchases(), formatDate()

### Community 8 - "getServerUser"
Cohesion: 0.11
Nodes (17): AnalyticsPage(), dynamic, metadata, dynamic, EODPage(), metadata, dynamic, LaporanPage() (+9 more)

### Community 9 - "smoke-v17.mts"
Cohesion: 0.26
Nodes (14): appRequest(), CheckResult, createSessionCookie(), evaluateBlockedTable(), evaluatePublicSettings(), evaluateRoleOrders(), JsonRecord, main() (+6 more)

### Community 11 - "OperationalAnalytics.tsx"
Cohesion: 0.05
Nodes (65): AnalyticsCharts(), countOptions, fullMoney, horizontalMoneyOptions, lineOptions, tooltipBase, addDays(), AnalyticsClient() (+57 more)

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
Cohesion: 0.21
Nodes (15): dynamic, InvoicePage(), Context, DELETE(), dynamic, GET(), PUT(), canAccessOrder() (+7 more)

### Community 28 - "UsersClient"
Cohesion: 0.16
Nodes (7): dynamic, metadata, UserRow, UsersClient(), handleSave(), openAdd(), resetForm()

### Community 29 - "eod/route.ts"
Cohesion: 0.25
Nodes (8): dynamic, EodOrder, EodOrderItem, GET(), GoldTypeCat, POST(), StockSnapshotRow, wibDateStr()

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

### Community 39 - "analytics.ts"
Cohesion: 0.05
Nodes (61): Change(), CsPerformancePage(), dynamic, metadata, addDays(), dynamic, GET(), isValidDate() (+53 more)

### Community 43 - "PelangganClient.tsx"
Cohesion: 0.23
Nodes (10): Customer, CustomerOrder, InvoiceDownloadButton(), downloadPdf(), Props, safeFilename(), buildAddress(), InvoiceOrder (+2 more)

### Community 44 - "migration.sql"
Cohesion: 0.17
Nodes (17): public.adjust_stock_atomic(), public.app_settings, public.apply_stock_delta(), public.cancel_order_atomic(), public.create_order_atomic(), public.customers, public.eod_reports, public.gold_types (+9 more)

### Community 45 - "gold-api.ts"
Cohesion: 0.05
Nodes (64): AdminHargaPage(), dynamic, dynamic, JenisEmasPage(), AdminKontenClient(), AdminKontenPage(), dynamic, dynamic (+56 more)

### Community 48 - "Spec: Dashboard Performa CS"
Cohesion: 0.18
Nodes (10): Admin Team View, Boundaries, Code Style, Objective, Open Questions, Project Structure, Spec: Dashboard Performa CS, Success Criteria (+2 more)

### Community 49 - "Migrasi v17 — Proteksi Data Operasional dan Pelanggan"
Cohesion: 0.25
Nodes (7): Bukti verifikasi, Eksekusi, Migrasi v17 — Proteksi Data Operasional dan Pelanggan, Prasyarat, Rollback dan forward-fix, Smoke test otomatis, Verifikasi database

### Community 50 - "Analytics Chart Visual System"
Cohesion: 0.40
Nodes (4): Analytics Chart Visual System, Applied Views, Direction, Shared Rules

### Community 52 - "Stock Correction"
Cohesion: 0.33
Nodes (5): Acceptance, Objective, Rules, Stock Correction, User Interface

### Community 53 - "requireCapability"
Cohesion: 0.25
Nodes (14): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), GET() (+6 more)

### Community 55 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, smoke:v17, smoke:v17:anon, smoke:v17:roles, start (+1 more)

### Community 56 - "Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa, Source Nodes

### Community 57 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 58 - "orders/route.ts"
Cohesion: 0.22
Nodes (8): dynamic, POST(), dynamic, POST(), adminAuth, mocks, adminAuth, { createAdminClientMock, requireCapabilityMock }

### Community 59 - "AdminHargaClient.tsx"
Cohesion: 0.05
Nodes (33): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient(), MODE_TABS (+25 more)

### Community 60 - "PriceChart.tsx"
Cohesion: 0.21
Nodes (10): crosshairPlugin, formatCompact(), formatDateLabel(), formatRupiah(), HistoryRow, periods, PriceChart(), SERIES (+2 more)

### Community 61 - "normalizeAppRole"
Cohesion: 0.13
Nodes (21): canGenerateEod(), canManageOrders(), finitePositive(), optionalFiniteNumber(), optionalText(), OrderItemInput, OrderType, ParsedOrderMutation (+13 more)

### Community 63 - "Gold Type Modal Design"
Cohesion: 0.40
Nodes (4): Add and Edit, Delete, Gold Type Modal Design, Shared Language

### Community 68 - "EODClient.tsx"
Cohesion: 0.32
Nodes (7): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot

### Community 74 - "Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apakah dashboard CS dan admin sudah saling sinkron untuk seluruh fitur?, Source Nodes

### Community 77 - "local-startup-performance.test.ts"
Cohesion: 0.50
Nodes (3): packageJson, publicSiteData, rootLayout

## Knowledge Gaps
- **318 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+313 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `server-user.ts`, `analytics.ts`, `gold-api.ts`, `permissions.ts`, `requireCapability`, `orders/route.ts`, `eod/route.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `OperationalAnalytics.tsx` to `PriceApprovalPanel`, `(public)/page.tsx`, `admin/page.tsx`, `EODClient.tsx`, `OrdersClient.tsx`, `PelangganClient`, `PelangganClient.tsx`, `gold-api.ts`, `OrdersClient`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `normalizeAppRole()` connect `normalizeAppRole` to `admin/page.tsx`, `server-user.ts`, `OrdersClient.tsx`, `gold-api.ts`, `OrdersClient`, `permissions.ts`, `AdminHargaClient.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _318 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.1164021164021164 - nodes in this community are weakly interconnected._
- **Should `PriceApprovalPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07315233785822021 - nodes in this community are weakly interconnected._