# Graph Report - safar-gold  (2026-09-03)

## Corpus Check
- 110 files · ~55,651 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 592 nodes · 985 edges · 36 communities (30 shown, 6 thin omitted)
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
- AdminHargaClient.tsx
- getAllGoldTypes
- OrdersClient.tsx
- EODClient.tsx
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
- JenisEmasClient.tsx
- Spec: Order Lifecycle Hardening
- regions/route.ts
- gold-api.ts
- Implementation Plan: Order Lifecycle Hardening
- Order Lifecycle Hardening Tasks
- Q: Analisa CodeGraph dan Graphify untuk project ini dan propose kesimpulannya
- Q: Apakah lifecycle order create edit cancel konsisten?

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 53 edges
2. `OrdersClient()` - 22 edges
3. `formatRupiah()` - 21 edges
4. `getAllGoldTypes()` - 18 edges
5. `getPublicSettings()` - 18 edges
6. `createClient()` - 17 edges
7. `getSetting()` - 15 edges
8. `getFormattedTodayPrices()` - 15 edges
9. `createAnonClient()` - 15 edges
10. `PriceApprovalPanel()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Favicon Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/favicon.png → src/app/icon.png
- `Safar Gold Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/logo-1.webp → src/app/icon.png
- `fetchRole()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(admin)/admin/harga/AdminHargaClient.tsx → src/lib/supabase/client.ts
- `JenisEmasPage()` --calls--> `getAllGoldTypes()`  [EXTRACTED]
  src/app/(admin)/admin/jenis-emas/page.tsx → src/lib/gold-api.ts
- `loadSettings()` --calls--> `createAnonClient()`  [EXTRACTED]
  src/app/(admin)/admin/page.tsx → src/lib/supabase/anon.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (36 total, 6 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.05
Nodes (63): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), dynamic (+55 more)

### Community 1 - "PriceApprovalPanel"
Cohesion: 0.10
Nodes (18): PreviewPriceItem, PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam(), Props, CATEGORY_LABELS (+10 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (26): dynamic, metadata, PelangganPage(), PublicLayout(), dynamic, HomePage(), metadata, BackToTop() (+18 more)

### Community 3 - "devDependencies"
Cohesion: 0.04
Nodes (45): chart.js, eslint, eslint-config-next, next, dependencies, chart.js, next, react (+37 more)

### Community 4 - "AdminHargaClient.tsx"
Cohesion: 0.07
Nodes (28): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient(), MODE_TABS (+20 more)

### Community 5 - "getAllGoldTypes"
Cohesion: 0.08
Nodes (28): AdminHargaPage(), dynamic, dynamic, metadata, OrdersPage(), AdminDashboard(), loadData(), loadSettings() (+20 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.06
Nodes (30): DailySummary, LaporanClient(), StockRow, dynamic, metadata, dynamic, InvoicePage(), BUYBACK_CATEGORIES (+22 more)

### Community 8 - "EODClient.tsx"
Cohesion: 0.21
Nodes (9): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot, dynamic (+1 more)

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "admin/page.tsx"
Cohesion: 0.08
Nodes (22): AdminLoginPage(), handleSubmit(), dynamic, AdminLayout(), fetchUser(), getPageMeta(), pageMeta, AdminSidebar() (+14 more)

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

### Community 29 - "JenisEmasClient.tsx"
Cohesion: 0.16
Nodes (9): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), dynamic (+1 more)

### Community 30 - "Spec: Order Lifecycle Hardening"
Cohesion: 0.12
Nodes (16): Boundaries, Cancel, Code Style, Commands, Create, Edit, EOD, Objective (+8 more)

### Community 32 - "gold-api.ts"
Cohesion: 0.06
Nodes (50): AdminKontenClient(), AdminKontenPage(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, POST(), DELETE() (+42 more)

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

## Knowledge Gaps
- **199 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `gold-api.ts`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `OrdersClient.tsx` to `gold-api.ts`, `PriceApprovalPanel`, `getAllGoldTypes`, `EODClient.tsx`, `admin/page.tsx`, `OrdersClient`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `OrdersClient()` connect `OrdersClient` to `admin/page.tsx`, `getAllGoldTypes`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _199 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.05134825014343087 - nodes in this community are weakly interconnected._
- **Should `PriceApprovalPanel` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07200929152148665 - nodes in this community are weakly interconnected._