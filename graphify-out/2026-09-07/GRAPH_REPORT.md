# Graph Report - safar-gold  (2026-09-07)

## Corpus Check
- 144 files · ~70,486 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 793 nodes · 1462 edges · 56 communities (46 shown, 10 thin omitted)
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
- operational-analytics.ts
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
- analytics.ts
- InvoiceDownloadButton.tsx
- OperationalAnalytics.tsx
- gold-api.ts
- getAllGoldTypes
- Spec: Dashboard Performa CS
- StockClient.tsx
- Analytics Chart Visual System
- next
- Stock Correction
- scripts
- Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa
- package.json
- react-chartjs-2
- @types/react

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
- `loadSettings()` --calls--> `createAnonClient()`  [EXTRACTED]
  src/app/(admin)/admin/page.tsx → src/lib/supabase/anon.ts
- `StockPage()` --calls--> `getAllGoldTypes()`  [EXTRACTED]
  src/app/(admin)/admin/stock/page.tsx → src/lib/gold-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (56 total, 10 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.05
Nodes (74): dynamic, GET(), GET(), dynamic, GET(), dynamic, GET(), dynamic (+66 more)

### Community 1 - "PriceApprovalPanel"
Cohesion: 0.10
Nodes (18): PreviewPriceItem, PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam(), Props, CATEGORY_LABELS (+10 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (27): InvoicePage(), dynamic, metadata, PelangganPage(), PublicLayout(), dynamic, HomePage(), metadata (+19 more)

### Community 3 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 4 - "admin/page.tsx"
Cohesion: 0.06
Nodes (29): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), AdminLoginPage() (+21 more)

### Community 5 - "operational-analytics.ts"
Cohesion: 0.20
Nodes (15): addDay(), dynamic, aggregateCustomerSources(), aggregateStockAnalytics(), bucket(), CustomerSourceAnalyticsResult, CustomerSourceOrder, dateFormatter (+7 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.18
Nodes (10): BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail, TODO: add brand selector UI for buyback if needed, RegionOption (+2 more)

### Community 7 - "PelangganClient"
Cohesion: 0.22
Nodes (4): PelangganClient(), Purchase, summarizeCustomerPurchases(), formatDate()

### Community 8 - "EODClient.tsx"
Cohesion: 0.21
Nodes (9): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot, dynamic (+1 more)

### Community 9 - "PelangganClient.tsx"
Cohesion: 0.33
Nodes (7): dynamic, Customer, CustomerOrder, buildAddress(), InvoiceOrder, InvoiceSettings, OrderInvoice()

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
Cohesion: 0.33
Nodes (5): Tampilan Tim untuk Admin, Tasks: Dashboard Performa CS, Tasks: Koreksi Stok, Tasks: Upgrade Modal Stok, Tasks: Visual Grafik Analitik

### Community 35 - "Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya, Source Nodes

### Community 36 - "Q: Apakah lifecycle order create edit cancel konsisten?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apakah lifecycle order create edit cancel konsisten?, Source Nodes

### Community 38 - "dependencies"
Cohesion: 0.12
Nodes (17): chart.js, dependencies, chart.js, html2canvas, jspdf, react, react-dom, react-google-reviews (+9 more)

### Community 39 - "analytics.ts"
Cohesion: 0.08
Nodes (41): Change(), CsPerformancePage(), dynamic, metadata, addDays(), dynamic, GET(), isValidDate() (+33 more)

### Community 40 - "InvoiceDownloadButton.tsx"
Cohesion: 0.50
Nodes (4): InvoiceDownloadButton(), downloadPdf(), Props, safeFilename()

### Community 43 - "OperationalAnalytics.tsx"
Cohesion: 0.05
Nodes (64): AnalyticsCharts(), countOptions, fullMoney, horizontalMoneyOptions, lineOptions, tooltipBase, addDays(), AnalyticsClient() (+56 more)

### Community 45 - "gold-api.ts"
Cohesion: 0.06
Nodes (51): AdminKontenClient(), AdminKontenPage(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, POST(), DELETE() (+43 more)

### Community 47 - "getAllGoldTypes"
Cohesion: 0.07
Nodes (31): AdminHargaPage(), dynamic, dynamic, JenisEmasPage(), dynamic, metadata, OrdersPage(), AdminDashboard() (+23 more)

### Community 48 - "Spec: Dashboard Performa CS"
Cohesion: 0.18
Nodes (10): Admin Team View, Boundaries, Code Style, Objective, Open Questions, Project Structure, Spec: Dashboard Performa CS, Success Criteria (+2 more)

### Community 49 - "StockClient.tsx"
Cohesion: 0.06
Nodes (29): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient(), MODE_TABS (+21 more)

### Community 50 - "Analytics Chart Visual System"
Cohesion: 0.40
Nodes (4): Analytics Chart Visual System, Applied Views, Direction, Shared Rules

### Community 52 - "Stock Correction"
Cohesion: 0.33
Nodes (5): Acceptance, Objective, Rules, Stock Correction, User Interface

### Community 55 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 56 - "Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Dashboard statistik stock dan sumber pelanggan sebaiknya ditempatkan di mana dan berisi apa, Source Nodes

### Community 57 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **259 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+254 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `(public)/page.tsx`, `operational-analytics.ts`, `analytics.ts`, `PelangganClient.tsx`, `gold-api.ts`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `OperationalAnalytics.tsx` to `PriceApprovalPanel`, `admin/page.tsx`, `OrdersClient.tsx`, `PelangganClient`, `EODClient.tsx`, `PelangganClient.tsx`, `OrdersClient`, `gold-api.ts`, `getAllGoldTypes`, `LaporanClient.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `OrdersClient()` connect `OrdersClient` to `admin/page.tsx`, `OrdersClient.tsx`, `order-cart-presentation.ts`, `OperationalAnalytics.tsx`, `getAllGoldTypes`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _259 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.05400948258091115 - nodes in this community are weakly interconnected._
- **Should `PriceApprovalPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06976744186046512 - nodes in this community are weakly interconnected._