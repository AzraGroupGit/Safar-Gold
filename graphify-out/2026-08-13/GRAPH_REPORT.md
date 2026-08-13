# Graph Report - safar-gold  (2026-08-13)

## Corpus Check
- 90 files · ~94,048 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 376 nodes · 649 edges · 31 communities (24 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d2808b4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createAdminClient
- PriceChart.tsx
- (public)/page.tsx
- dependencies
- PricePreviewModal.tsx
- devDependencies
- OrdersClient.tsx
- JenisEmasClient.tsx
- stock/page.tsx
- gold-api.ts
- app/layout.tsx
- admin/page.tsx
- tentang/page.tsx
- migration.sql
- graphify.js
- App Icon
- middleware.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- About Us Hero Image
- Safar Gold Store Interior Hero
- users/page.tsx
- getPublicSettings
- regions/route.ts

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 45 edges
2. `formatRupiah()` - 19 edges
3. `getPublicSettings()` - 18 edges
4. `getAllGoldTypes()` - 14 edges
5. `createAnonClient()` - 14 edges
6. `getSetting()` - 13 edges
7. `getFormattedTodayPrices()` - 13 edges
8. `setSetting()` - 10 edges
9. `fetchInternationalGoldPrice()` - 10 edges
10. `getMarketInfo()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Favicon Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/favicon.png → src/app/icon.png
- `Safar Gold Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/logo-1.webp → src/app/icon.png
- `JenisEmasPage()` --calls--> `getAllGoldTypes()`  [EXTRACTED]
  src/app/(admin)/admin/jenis-emas/page.tsx → src/lib/gold-api.ts
- `Props` --references--> `GoldTypeRow`  [EXTRACTED]
  src/app/(admin)/admin/PriceApprovalPanel.tsx → src/lib/gold-api.ts
- `AdminKontenPage()` --calls--> `getHeroContent()`  [EXTRACTED]
  src/app/(admin)/admin/konten/page.tsx → src/lib/gold-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (31 total, 7 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.08
Nodes (35): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), dynamic (+27 more)

### Community 1 - "PriceChart.tsx"
Cohesion: 0.40
Nodes (5): chartData, generateMockData(), options, periods, PriceChart()

### Community 2 - "(public)/page.tsx"
Cohesion: 0.10
Nodes (18): dynamic, metadata, CaraTransaksi(), FAQ(), faqs, FeaturableWidget(), GoldDivider(), Hero() (+10 more)

### Community 3 - "dependencies"
Cohesion: 0.12
Nodes (17): chart.js, next, dependencies, chart.js, next, react, react-chartjs-2, react-dom (+9 more)

### Community 4 - "PricePreviewModal.tsx"
Cohesion: 0.25
Nodes (9): CATEGORY_LABELS, formatRupiah(), PreviewItem, PricePreviewModal(), PricePreviewModalProps, roundToNearest(), CATEGORIES, TabbedPricelist() (+1 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.09
Nodes (25): DailySummary, EOD, LaporanClient(), StockRow, dynamic, metadata, dynamic, BUYBACK_CATEGORIES (+17 more)

### Community 7 - "JenisEmasClient.tsx"
Cohesion: 0.14
Nodes (13): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), dynamic (+5 more)

### Community 8 - "stock/page.tsx"
Cohesion: 0.29
Nodes (5): dynamic, metadata, Movement, StockClient(), StockRow

### Community 9 - "gold-api.ts"
Cohesion: 0.08
Nodes (39): AdminKontenClient(), AdminKontenPage(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, POST(), DELETE() (+31 more)

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "admin/page.tsx"
Cohesion: 0.08
Nodes (26): AdminHargaClient(), formatRupiahClient(), MODE_TABS, AdminHargaPage(), dynamic, OrdersPage(), AdminDashboard(), dynamic (+18 more)

### Community 12 - "tentang/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, timeline, values

### Community 13 - "migration.sql"
Cohesion: 0.39
Nodes (8): public.app_settings, public.customers, public.gold_types, public.order_items, public.orders, public.price_history, public.stock, public.stock_movements

### Community 15 - "App Icon"
Cohesion: 0.67
Nodes (3): Favicon Logo, Safar Gold Logo, App Icon

### Community 17 - "middleware.ts"
Cohesion: 0.60
Nodes (4): config, CS_RESTRICTED_API, CS_RESTRICTED_PAGES, middleware()

### Community 28 - "users/page.tsx"
Cohesion: 0.33
Nodes (4): dynamic, metadata, UserRow, UsersClient()

### Community 29 - "getPublicSettings"
Cohesion: 0.16
Nodes (12): InvoicePage(), dynamic, metadata, PelangganPage(), PublicLayout(), HomePage(), BackToTop(), Footer() (+4 more)

## Knowledge Gaps
- **115 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+110 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `gold-api.ts`, `getPublicSettings`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `getPublicSettings()` connect `getPublicSettings` to `gold-api.ts`, `(public)/page.tsx`, `admin/page.tsx`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `OrdersClient.tsx` to `gold-api.ts`, `(public)/page.tsx`, `admin/page.tsx`, `PricePreviewModal.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _115 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.07510204081632653 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09885057471264368 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._