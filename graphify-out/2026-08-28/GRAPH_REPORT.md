# Graph Report - safar-gold  (2026-08-26)

## Corpus Check
- 95 files · ~191,694 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 494 nodes · 829 edges · 31 communities (25 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a622410`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createAdminClient
- formatRupiah
- (public)/page.tsx
- dependencies
- AdminHargaClient.tsx
- devDependencies
- OrdersClient.tsx
- createClient
- PriceApprovalPanel
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
- PriceChart.tsx
- regions/route.ts
- gold-api.ts

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 48 edges
2. `formatRupiah()` - 21 edges
3. `OrdersClient()` - 19 edges
4. `getAllGoldTypes()` - 18 edges
5. `getPublicSettings()` - 18 edges
6. `getSetting()` - 15 edges
7. `getFormattedTodayPrices()` - 15 edges
8. `createAnonClient()` - 15 edges
9. `createClient()` - 14 edges
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
- `PelangganPage()` --calls--> `getPublicSettings()`  [EXTRACTED]
  src/app/(admin)/admin/pelanggan/page.tsx → src/lib/gold-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (31 total, 6 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.06
Nodes (42): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), dynamic (+34 more)

### Community 1 - "formatRupiah"
Cohesion: 0.06
Nodes (32): Breakdown, EOD, EODClient(), handleGenerate(), load(), formatDate(), StockSnapshot, dynamic (+24 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.07
Nodes (25): AdminKontenClient(), AdminKontenPage(), dynamic, dynamic, HomePage(), metadata, CaraTransaksi(), FAQ() (+17 more)

### Community 3 - "dependencies"
Cohesion: 0.12
Nodes (17): chart.js, next, dependencies, chart.js, next, react, react-chartjs-2, react-dom (+9 more)

### Community 4 - "AdminHargaClient.tsx"
Cohesion: 0.07
Nodes (27): AdminHargaClient(), fetchRole(), formatPrice(), getPrice(), getPriceLabel(), isBuyable(), formatRupiahClient(), MODE_TABS (+19 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.09
Nodes (20): dynamic, InvoicePage(), BUYBACK_CATEGORIES, CartItem, CustomerLookup, LM_PRODUCTS, Order, OrderDetail (+12 more)

### Community 7 - "createClient"
Cohesion: 0.08
Nodes (24): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), dynamic (+16 more)

### Community 8 - "PriceApprovalPanel"
Cohesion: 0.24
Nodes (5): PriceApprovalPanel(), cleanNumber(), handleSaveAntamPrice(), handleSaveGlobalGoldPrice(), handleScrapeAntam()

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "admin/page.tsx"
Cohesion: 0.07
Nodes (28): AdminHargaPage(), dynamic, dynamic, metadata, OrdersPage(), AdminDashboard(), loadData(), loadSettings() (+20 more)

### Community 12 - "tentang/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, timeline, values

### Community 13 - "OrdersClient"
Cohesion: 0.13
Nodes (4): OrdersClient(), fetchOrders(), handleSubmit(), resetForm()

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

### Community 29 - "PriceChart.tsx"
Cohesion: 0.21
Nodes (10): crosshairPlugin, formatCompact(), formatDateLabel(), formatRupiah(), HistoryRow, periods, PriceChart(), SERIES (+2 more)

### Community 32 - "gold-api.ts"
Cohesion: 0.09
Nodes (37): POST(), DELETE(), dynamic, POST(), dynamic, POST(), dynamic, POST() (+29 more)

## Knowledge Gaps
- **148 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `gold-api.ts`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `formatRupiah` to `gold-api.ts`, `(public)/page.tsx`, `OrdersClient.tsx`, `admin/page.tsx`, `OrdersClient`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `OrdersClient()` connect `OrdersClient` to `formatRupiah`, `admin/page.tsx`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06328320802005012 - nodes in this community are weakly interconnected._
- **Should `formatRupiah` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06852497096399536 - nodes in this community are weakly interconnected._