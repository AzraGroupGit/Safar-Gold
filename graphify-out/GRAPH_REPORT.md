# Graph Report - safar-gold  (2026-09-07)

## Corpus Check
- 146 files · ~71,329 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 821 nodes · 1501 edges · 65 communities (54 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e08db1fe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createAdminClient
- PriceApprovalPanel
- (public)/page.tsx
- devDependencies
- admin/page.tsx
- analytics.ts
- OrdersClient.tsx
- PelangganClient
- EODClient.tsx
- PelangganClient.tsx
- app/layout.tsx
- order-cart-presentation.ts
- tentang/page.tsx
- OrdersClient
- DESIGN.md — Safar Gold "Atelier"
- App Icon
- middleware.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- About Us Hero Image
- Safar Gold Store Interior Hero
- UsersClient
- LaporanClient.tsx
- Spec: Order Lifecycle Hardening
- regions/route.ts
- Stock Modal Design
- plan.md
- todo.md
- Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya
- Q: Apakah lifecycle order create edit cancel konsisten?
- dependencies
- admin/cs-performance/route.ts
- InvoiceDownloadButton.tsx
- OperationalAnalytics.tsx
- migration.sql
- gold-api.ts
- JenisEmasClient.tsx
- getAllGoldTypes
- Spec: Dashboard Performa CS
- StockClient.tsx
- Analytics Chart Visual System
- next
- Stock Correction
- AdminHargaClient.tsx
- PriceChart.tsx
- scripts
- Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa
- package.json
- (public)/harga/page.tsx
- react-chartjs-2
- @types/react
- AdminHargaClient
- SignaturePad
- Gold Type Modal Design

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 65 edges
2. `getUserRole()` - 37 edges
3. `getServerUser()` - 35 edges
4. `formatRupiah()` - 30 edges
5. `OrdersClient()` - 23 edges
6. `getAllGoldTypes()` - 18 edges
7. `getPublicSettings()` - 18 edges
8. `createClient()` - 17 edges
9. `getSetting()` - 15 edges
10. `getFormattedTodayPrices()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Favicon Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/favicon.png → src/app/icon.png
- `Safar Gold Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/logo-1.webp → src/app/icon.png
- `fetchRole()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(admin)/admin/harga/AdminHargaClient.tsx → src/lib/supabase/client.ts
- `JenisEmasPage()` --calls--> `getAllGoldTypes()`  [EXTRACTED]
  src/app/(admin)/admin/jenis-emas/page.tsx → src/lib/gold-api.ts
- `StockPage()` --calls--> `getAllGoldTypes()`  [EXTRACTED]
  src/app/(admin)/admin/stock/page.tsx → src/lib/gold-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (65 total, 11 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.05
Nodes (73): GET(), GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+65 more)

### Community 1 - "PriceApprovalPanel"
Cohesion: 0.24
Nodes (5): PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam()

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (26): dynamic, metadata, PelangganPage(), PublicLayout(), dynamic, HomePage(), metadata, BackToTop() (+18 more)

### Community 3 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 4 - "admin/page.tsx"
Cohesion: 0.07
Nodes (27): AdminLoginPage(), handleSubmit(), AdminDashboard(), loadData(), loadSettings(), dynamic, AdminPengaturanClient(), AdminPengaturanPage() (+19 more)

### Community 5 - "analytics.ts"
Cohesion: 0.10
Nodes (34): Change(), dynamic, addDays(), dynamic, GET(), isValidDate(), loadOrders(), wibToday() (+26 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.18
Nodes (10): BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail, TODO: add brand selector UI for buyback if needed, RegionOption (+2 more)

### Community 8 - "EODClient.tsx"
Cohesion: 0.21
Nodes (9): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot, dynamic (+1 more)

### Community 9 - "PelangganClient.tsx"
Cohesion: 0.21
Nodes (10): dynamic, InvoicePage(), Customer, CustomerOrder, buildAddress(), InvoiceOrder, InvoiceSettings, OrderInvoice() (+2 more)

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "order-cart-presentation.ts"
Cohesion: 0.32
Nodes (6): currencyFormatter, formatOrderAddress(), getOrderItemDetails(), numberFormatter, OrderAddressInput, OrderItemDetailInput

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

### Community 17 - "middleware.ts"
Cohesion: 0.40
Nodes (3): config, CS_RESTRICTED_API, CS_RESTRICTED_PAGES

### Community 28 - "UsersClient"
Cohesion: 0.16
Nodes (7): dynamic, metadata, UserRow, UsersClient(), handleSave(), openAdd(), resetForm()

### Community 29 - "LaporanClient.tsx"
Cohesion: 0.25
Nodes (5): DailySummary, LaporanClient(), StockRow, dynamic, metadata

### Community 30 - "Spec: Order Lifecycle Hardening"
Cohesion: 0.12
Nodes (16): Boundaries, Cancel, Code Style, Commands, Create, Edit, EOD, Objective (+8 more)

### Community 32 - "Stock Modal Design"
Cohesion: 0.29
Nodes (6): Adjustment, Correction, Direction, Minimum Stock, Shared Shell, Stock Modal Design

### Community 34 - "todo.md"
Cohesion: 0.29
Nodes (6): Tampilan Tim untuk Admin, Tasks: Dashboard Performa CS, Tasks: Koreksi Stok, Tasks: Upgrade Modal Jenis Emas, Tasks: Upgrade Modal Stok, Tasks: Visual Grafik Analitik

### Community 35 - "Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya, Source Nodes

### Community 36 - "Q: Apakah lifecycle order create edit cancel konsisten?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apakah lifecycle order create edit cancel konsisten?, Source Nodes

### Community 38 - "dependencies"
Cohesion: 0.12
Nodes (17): chart.js, dependencies, chart.js, html2canvas, jspdf, react, react-dom, react-google-reviews (+9 more)

### Community 39 - "admin/cs-performance/route.ts"
Cohesion: 0.13
Nodes (23): CsPerformancePage(), dynamic, metadata, addDays(), dynamic, GET(), isValidDate(), wibToday() (+15 more)

### Community 40 - "InvoiceDownloadButton.tsx"
Cohesion: 0.50
Nodes (4): InvoiceDownloadButton(), downloadPdf(), Props, safeFilename()

### Community 43 - "OperationalAnalytics.tsx"
Cohesion: 0.05
Nodes (64): AnalyticsCharts(), countOptions, fullMoney, horizontalMoneyOptions, lineOptions, tooltipBase, addDays(), AnalyticsClient() (+56 more)

### Community 44 - "migration.sql"
Cohesion: 0.17
Nodes (17): public.adjust_stock_atomic(), public.app_settings, public.apply_stock_delta(), public.cancel_order_atomic(), public.create_order_atomic(), public.customers, public.eod_reports, public.gold_types (+9 more)

### Community 45 - "gold-api.ts"
Cohesion: 0.05
Nodes (58): AdminKontenClient(), AdminKontenPage(), dynamic, PreviewPriceItem, Props, POST(), DELETE(), dynamic (+50 more)

### Community 46 - "JenisEmasClient.tsx"
Cohesion: 0.15
Nodes (10): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), dynamic (+2 more)

### Community 47 - "getAllGoldTypes"
Cohesion: 0.24
Nodes (9): AdminHargaPage(), dynamic, dynamic, metadata, OrdersPage(), KalkulatorPage(), getAllGoldTypes(), getFormattedTodayPrices() (+1 more)

### Community 48 - "Spec: Dashboard Performa CS"
Cohesion: 0.18
Nodes (10): Admin Team View, Boundaries, Code Style, Objective, Open Questions, Project Structure, Spec: Dashboard Performa CS, Success Criteria (+2 more)

### Community 49 - "StockClient.tsx"
Cohesion: 0.12
Nodes (9): dynamic, metadata, StockPage(), BRAND_OPTIONS, CATEGORY_LABELS, CATEGORY_ORDER, Movement, StockClient() (+1 more)

### Community 50 - "Analytics Chart Visual System"
Cohesion: 0.40
Nodes (4): Analytics Chart Visual System, Applied Views, Direction, Shared Rules

### Community 52 - "Stock Correction"
Cohesion: 0.33
Nodes (5): Acceptance, Objective, Rules, Stock Correction, User Interface

### Community 53 - "AdminHargaClient.tsx"
Cohesion: 0.17
Nodes (12): MODE_TABS, ModeModal(), Calculator(), switchTransaction(), CATEGORY_LABELS, formatRupiahClient(), quickQty, quickWeights (+4 more)

### Community 54 - "PriceChart.tsx"
Cohesion: 0.21
Nodes (10): crosshairPlugin, formatCompact(), formatDateLabel(), formatRupiah(), HistoryRow, periods, PriceChart(), SERIES (+2 more)

### Community 55 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 56 - "Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa, Source Nodes

### Community 57 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 58 - "(public)/harga/page.tsx"
Cohesion: 0.27
Nodes (7): dynamic, HargaPage(), metadata, dynamic, metadata, LegalNotice(), getPriceHistory()

### Community 61 - "AdminHargaClient"
Cohesion: 0.36
Nodes (7): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient()

### Community 62 - "SignaturePad"
Cohesion: 0.38
Nodes (4): SignaturePad(), getPos(), move(), start()

### Community 63 - "Gold Type Modal Design"
Cohesion: 0.40
Nodes (4): Add and Edit, Delete, Gold Type Modal Design, Shared Language

## Knowledge Gaps
- **267 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+262 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `PelangganClient.tsx`, `gold-api.ts`, `analytics.ts`, `admin/cs-performance/route.ts`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `OperationalAnalytics.tsx` to `admin/page.tsx`, `OrdersClient.tsx`, `PelangganClient`, `EODClient.tsx`, `PelangganClient.tsx`, `OrdersClient`, `gold-api.ts`, `getAllGoldTypes`, `(public)/harga/page.tsx`, `LaporanClient.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `OrdersClient()` connect `OrdersClient` to `admin/page.tsx`, `OrdersClient.tsx`, `order-cart-presentation.ts`, `OperationalAnalytics.tsx`, `getAllGoldTypes`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _267 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.0547680412371134 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07200929152148665 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._