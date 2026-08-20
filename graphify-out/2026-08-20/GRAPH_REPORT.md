# Graph Report - safar-gold  (2026-08-20)

## Corpus Check
- 91 files · ~188,322 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 449 nodes · 760 edges · 31 communities (25 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65019a09`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createAdminClient
- getSetting
- (public)/page.tsx
- dependencies
- AdminHargaClient.tsx
- devDependencies
- OrdersClient.tsx
- JenisEmasClient.tsx
- StockClient
- admin/page.tsx
- app/layout.tsx
- getAllGoldTypes
- tentang/page.tsx
- OrdersClient
- App Icon
- middleware.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- About Us Hero Image
- Safar Gold Store Interior Hero
- UsersClient
- PriceChart.tsx
- regions/route.ts
- gold-api.ts

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 45 edges
2. `OrdersClient()` - 19 edges
3. `formatRupiah()` - 19 edges
4. `getPublicSettings()` - 18 edges
5. `getAllGoldTypes()` - 16 edges
6. `getSetting()` - 15 edges
7. `getFormattedTodayPrices()` - 15 edges
8. `createAnonClient()` - 15 edges
9. `PriceApprovalPanel()` - 12 edges
10. `fetchInternationalGoldPrice()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Favicon Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/favicon.png → src/app/icon.png
- `Safar Gold Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/logo-1.webp → src/app/icon.png
- `fetchRole()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(admin)/admin/harga/AdminHargaClient.tsx → src/lib/supabase/client.ts
- `loadSettings()` --calls--> `createAnonClient()`  [EXTRACTED]
  src/app/(admin)/admin/page.tsx → src/lib/supabase/anon.ts
- `Props` --references--> `GoldTypeRow`  [EXTRACTED]
  src/app/(admin)/admin/PriceApprovalPanel.tsx → src/lib/gold-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (31 total, 6 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.08
Nodes (35): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), dynamic (+27 more)

### Community 1 - "getSetting"
Cohesion: 0.20
Nodes (19): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, POST() (+11 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (27): InvoicePage(), dynamic, metadata, PelangganPage(), PublicLayout(), dynamic, HomePage(), metadata (+19 more)

### Community 3 - "dependencies"
Cohesion: 0.12
Nodes (17): chart.js, next, dependencies, chart.js, next, react, react-chartjs-2, react-dom (+9 more)

### Community 4 - "AdminHargaClient.tsx"
Cohesion: 0.12
Nodes (18): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient(), MODE_TABS (+10 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.08
Nodes (23): DailySummary, EOD, LaporanClient(), StockRow, dynamic, metadata, dynamic, BUYBACK_CATEGORIES (+15 more)

### Community 7 - "JenisEmasClient.tsx"
Cohesion: 0.10
Nodes (16): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), AdminLoginPage() (+8 more)

### Community 8 - "StockClient"
Cohesion: 0.20
Nodes (7): dynamic, metadata, Movement, StockClient(), fetchData(), handleAdjust(), StockRow

### Community 9 - "admin/page.tsx"
Cohesion: 0.08
Nodes (19): dynamic, PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam(), Props, AdminSkeleton() (+11 more)

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "getAllGoldTypes"
Cohesion: 0.11
Nodes (20): AdminHargaPage(), dynamic, dynamic, JenisEmasPage(), dynamic, metadata, OrdersPage(), AdminDashboard() (+12 more)

### Community 12 - "tentang/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, timeline, values

### Community 13 - "OrdersClient"
Cohesion: 0.13
Nodes (4): OrdersClient(), fetchOrders(), handleSubmit(), resetForm()

### Community 15 - "App Icon"
Cohesion: 0.67
Nodes (3): Favicon Logo, Safar Gold Logo, App Icon

### Community 17 - "middleware.ts"
Cohesion: 0.40
Nodes (3): config, CS_RESTRICTED_API, CS_RESTRICTED_PAGES

### Community 28 - "UsersClient"
Cohesion: 0.17
Nodes (8): dynamic, metadata, UserRow, UsersClient(), fetchUsers(), handleSave(), openAdd(), resetForm()

### Community 29 - "PriceChart.tsx"
Cohesion: 0.24
Nodes (9): crosshairPlugin, formatCompact(), formatDateLabel(), formatRupiah(), HistoryRow, periods, PriceChart(), SERIES (+1 more)

### Community 32 - "gold-api.ts"
Cohesion: 0.08
Nodes (27): AdminKontenClient(), AdminKontenPage(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, POST(), DELETE() (+19 more)

## Knowledge Gaps
- **123 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `gold-api.ts`, `getSetting`, `(public)/page.tsx`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `OrdersClient()` connect `OrdersClient` to `getAllGoldTypes`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `OrdersClient.tsx` to `gold-api.ts`, `admin/page.tsx`, `getAllGoldTypes`, `OrdersClient`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.07510204081632653 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06976744186046512 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._