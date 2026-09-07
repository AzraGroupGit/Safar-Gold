# Graph Report - safar-gold  (2026-09-04)

## Corpus Check
- 111 files · ~56,143 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 595 nodes · 992 edges · 45 communities (38 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
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
- StockClient
- getAllGoldTypes
- OrdersClient.tsx
- JenisEmasClient.tsx
- EODClient.tsx
- formatRupiah
- app/layout.tsx
- admin/page.tsx
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
- gold-api.ts
- Implementation Plan: Order Lifecycle Hardening
- Order Lifecycle Hardening Tasks
- Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya
- Q: Apakah lifecycle order create edit cancel konsisten?
- Calculator.tsx
- AdminHargaClient
- order-cart-presentation.ts
- AdminHargaClient.tsx
- SignaturePad
- StockClient.tsx
- PelangganClient

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 53 edges
2. `OrdersClient()` - 23 edges
3. `formatRupiah()` - 21 edges
4. `getAllGoldTypes()` - 18 edges
5. `getPublicSettings()` - 18 edges
6. `createClient()` - 17 edges
7. `getSetting()` - 15 edges
8. `getFormattedTodayPrices()` - 15 edges
9. `createAnonClient()` - 15 edges
10. `getUserRole()` - 13 edges

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

## Communities (45 total, 7 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.05
Nodes (62): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), dynamic (+54 more)

### Community 1 - "PriceApprovalPanel"
Cohesion: 0.10
Nodes (17): PreviewPriceItem, PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam(), Props, CATEGORY_LABELS (+9 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (27): InvoicePage(), dynamic, metadata, PelangganPage(), PublicLayout(), dynamic, HomePage(), metadata (+19 more)

### Community 3 - "devDependencies"
Cohesion: 0.04
Nodes (45): chart.js, eslint, eslint-config-next, next, dependencies, chart.js, next, react (+37 more)

### Community 4 - "StockClient"
Cohesion: 0.20
Nodes (4): dynamic, metadata, StockPage(), StockClient()

### Community 5 - "getAllGoldTypes"
Cohesion: 0.08
Nodes (28): AdminHargaPage(), dynamic, dynamic, JenisEmasPage(), dynamic, metadata, OrdersPage(), dynamic (+20 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.18
Nodes (10): BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail, TODO: add brand selector UI for buyback if needed, RegionOption (+2 more)

### Community 7 - "JenisEmasClient.tsx"
Cohesion: 0.20
Nodes (7): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug()

### Community 8 - "EODClient.tsx"
Cohesion: 0.21
Nodes (9): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot, dynamic (+1 more)

### Community 9 - "formatRupiah"
Cohesion: 0.33
Nodes (8): dynamic, Customer, CustomerOrder, buildAddress(), InvoiceOrder, InvoiceSettings, OrderInvoice(), formatRupiah()

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "admin/page.tsx"
Cohesion: 0.09
Nodes (21): AdminLoginPage(), handleSubmit(), AdminDashboard(), loadData(), loadSettings(), dynamic, AdminLayout(), fetchUser() (+13 more)

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

### Community 32 - "gold-api.ts"
Cohesion: 0.06
Nodes (51): AdminKontenClient(), AdminKontenPage(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, POST(), DELETE() (+43 more)

### Community 33 - "Implementation Plan: Order Lifecycle Hardening"
Cohesion: 0.14
Nodes (13): Architecture Decisions, Checkpoints, Dependency Order, Implementation Plan: Order Lifecycle Hardening, Open Questions, Overview, Phase 1: Test foundation and contracts, Phase 2: Atomic create (+5 more)

### Community 34 - "Order Lifecycle Hardening Tasks"
Cohesion: 0.29
Nodes (6): Order Lifecycle Hardening Tasks, Task 1: Validation and test foundation, Task 2: Atomic order creation, Task 3: Atomic edit and cancel, Task 4: EOD invalidation, Task 5: Final verification

### Community 35 - "Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya, Source Nodes

### Community 36 - "Q: Apakah lifecycle order create edit cancel konsisten?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apakah lifecycle order create edit cancel konsisten?, Source Nodes

### Community 38 - "Calculator.tsx"
Cohesion: 0.27
Nodes (9): Calculator(), switchTransaction(), CATEGORY_LABELS, formatRupiahClient(), quickQty, quickWeights, SELL_CATEGORY_ORDER, orderIndex() (+1 more)

### Community 39 - "AdminHargaClient"
Cohesion: 0.36
Nodes (7): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient()

### Community 40 - "order-cart-presentation.ts"
Cohesion: 0.32
Nodes (6): currencyFormatter, formatOrderAddress(), getOrderItemDetails(), numberFormatter, OrderAddressInput, OrderItemDetailInput

### Community 41 - "AdminHargaClient.tsx"
Cohesion: 0.29
Nodes (4): MODE_TABS, ModeModal(), FormattedPrice, GoldTypeRow

### Community 42 - "SignaturePad"
Cohesion: 0.38
Nodes (4): SignaturePad(), getPos(), move(), start()

### Community 43 - "StockClient.tsx"
Cohesion: 0.33
Nodes (5): BRAND_OPTIONS, CATEGORY_LABELS, CATEGORY_ORDER, Movement, StockRow

## Knowledge Gaps
- **200 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+195 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `gold-api.ts`, `formatRupiah`, `(public)/page.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `formatRupiah` to `gold-api.ts`, `PriceApprovalPanel`, `getAllGoldTypes`, `OrdersClient.tsx`, `EODClient.tsx`, `admin/page.tsx`, `PelangganClient`, `OrdersClient`, `LaporanClient.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `OrdersClient()` connect `OrdersClient` to `getAllGoldTypes`, `OrdersClient.tsx`, `order-cart-presentation.ts`, `formatRupiah`, `admin/page.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _200 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.05201292976785189 - nodes in this community are weakly interconnected._
- **Should `PriceApprovalPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.10153846153846154 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06976744186046512 - nodes in this community are weakly interconnected._