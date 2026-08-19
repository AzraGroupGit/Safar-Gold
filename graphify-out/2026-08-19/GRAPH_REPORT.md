# Graph Report - safar-gold  (2026-08-18)

## Corpus Check
- 91 files · ~187,730 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 393 nodes · 696 edges · 30 communities (23 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `261ec39a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createAdminClient
- getSetting
- (public)/page.tsx
- dependencies
- getAllGoldTypes
- devDependencies
- OrdersClient.tsx
- admin/page.tsx
- stock/page.tsx
- gold-api.ts
- app/layout.tsx
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
- (public)/harga/page.tsx
- regions/route.ts

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 45 edges
2. `formatRupiah()` - 19 edges
3. `getPublicSettings()` - 18 edges
4. `getAllGoldTypes()` - 16 edges
5. `getSetting()` - 15 edges
6. `createAnonClient()` - 15 edges
7. `getFormattedTodayPrices()` - 13 edges
8. `fetchInternationalGoldPrice()` - 12 edges
9. `setSetting()` - 10 edges
10. `sortGoldTypes()` - 8 edges

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

## Communities (30 total, 7 thin omitted)

### Community 0 - "createAdminClient"
Cohesion: 0.08
Nodes (35): dynamic, GET(), dynamic, GET(), dynamic, GET(), POST(), dynamic (+27 more)

### Community 1 - "getSetting"
Cohesion: 0.20
Nodes (19): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, POST() (+11 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.06
Nodes (28): InvoicePage(), dynamic, metadata, PelangganPage(), PublicLayout(), dynamic, HomePage(), metadata (+20 more)

### Community 3 - "dependencies"
Cohesion: 0.12
Nodes (17): chart.js, next, dependencies, chart.js, next, react, react-chartjs-2, react-dom (+9 more)

### Community 4 - "getAllGoldTypes"
Cohesion: 0.12
Nodes (24): AdminHargaClient(), formatRupiahClient(), MODE_TABS, ModeModal(), AdminHargaPage(), dynamic, dynamic, metadata (+16 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 6 - "OrdersClient.tsx"
Cohesion: 0.10
Nodes (23): DailySummary, EOD, LaporanClient(), StockRow, dynamic, metadata, dynamic, BUYBACK_CATEGORIES (+15 more)

### Community 7 - "admin/page.tsx"
Cohesion: 0.08
Nodes (19): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), dynamic (+11 more)

### Community 8 - "stock/page.tsx"
Cohesion: 0.29
Nodes (5): dynamic, metadata, Movement, StockClient(), StockRow

### Community 9 - "gold-api.ts"
Cohesion: 0.08
Nodes (29): AdminKontenClient(), AdminKontenPage(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, POST(), DELETE() (+21 more)

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

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

### Community 29 - "(public)/harga/page.tsx"
Cohesion: 0.11
Nodes (22): dynamic, metadata, LegalNotice(), crosshairPlugin, formatCompact(), formatDateLabel(), formatRupiah(), HistoryRow (+14 more)

## Knowledge Gaps
- **122 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `gold-api.ts`, `(public)/page.tsx`, `OrdersClient.tsx`, `getSetting`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `formatRupiah()` connect `OrdersClient.tsx` to `(public)/page.tsx`, `getAllGoldTypes`, `admin/page.tsx`, `gold-api.ts`, `(public)/harga/page.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `getPublicSettings()` connect `(public)/page.tsx` to `gold-api.ts`, `getAllGoldTypes`, `OrdersClient.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createAdminClient` be split into smaller, more focused modules?**
  _Cohesion score 0.07510204081632653 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0647342995169082 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._