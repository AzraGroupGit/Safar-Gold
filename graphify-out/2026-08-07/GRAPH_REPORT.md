# Graph Report - safar-gold  (2026-08-07)

## Corpus Check
- 63 files · ~25,794 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 255 nodes · 413 edges · 28 communities (21 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `67309af5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- admin/page.tsx
- fetchInternationalGoldPrice
- (public)/page.tsx
- dependencies
- PriceApprovalPanel.tsx
- devDependencies
- gold-api.ts
- JenisEmasClient.tsx
- createAdminClient
- PriceChart.tsx
- app/layout.tsx
- (public)/harga/page.tsx
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

## God Nodes (most connected - your core abstractions)
1. `createAnonClient()` - 14 edges
2. `createAdminClient()` - 13 edges
3. `getAllGoldTypes()` - 12 edges
4. `getPublicSettings()` - 12 edges
5. `getFormattedTodayPrices()` - 11 edges
6. `formatRupiah()` - 11 edges
7. `fetchInternationalGoldPrice()` - 10 edges
8. `setSetting()` - 9 edges
9. `getSetting()` - 8 edges
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

## Communities (28 total, 7 thin omitted)

### Community 0 - "admin/page.tsx"
Cohesion: 0.17
Nodes (10): AdminDashboard(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, AdminSkeleton(), getMedianFactors(), getTodayPrices() (+2 more)

### Community 1 - "fetchInternationalGoldPrice"
Cohesion: 0.34
Nodes (11): dynamic, POST(), dynamic, POST(), dynamic, GET(), calculatePrices(), convertToIdrPerGram() (+3 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.11
Nodes (17): PublicLayout(), dynamic, HomePage(), metadata, BackToTop(), CaraTransaksi(), FAQ(), faqs (+9 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (23): chart.js, next, dependencies, chart.js, next, react, react-chartjs-2, react-dom (+15 more)

### Community 4 - "PriceApprovalPanel.tsx"
Cohesion: 0.23
Nodes (9): PriceApprovalPanel(), Props, CATEGORY_LABELS, formatRupiah(), PreviewItem, PricePreviewModal(), PricePreviewModalProps, roundToNearest() (+1 more)

### Community 5 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 6 - "gold-api.ts"
Cohesion: 0.14
Nodes (17): AdminKontenClient(), AdminKontenPage(), dynamic, DELETE(), PUT(), Hero(), LivePriceBand(), AppSettingRow (+9 more)

### Community 7 - "JenisEmasClient.tsx"
Cohesion: 0.11
Nodes (15): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), dynamic (+7 more)

### Community 8 - "createAdminClient"
Cohesion: 0.31
Nodes (6): POST(), POST(), POST(), POST(), createGoldType(), createAdminClient()

### Community 9 - "PriceChart.tsx"
Cohesion: 0.40
Nodes (5): chartData, generateMockData(), options, periods, PriceChart()

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "(public)/harga/page.tsx"
Cohesion: 0.12
Nodes (21): AdminHargaClient(), formatRupiahClient(), MODE_TABS, AdminHargaPage(), dynamic, dynamic, HargaPage(), metadata (+13 more)

### Community 12 - "tentang/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, timeline, values

### Community 13 - "migration.sql"
Cohesion: 0.67
Nodes (3): public.app_settings, public.gold_types, public.price_history

### Community 15 - "App Icon"
Cohesion: 0.67
Nodes (3): Favicon Logo, Safar Gold Logo, App Icon

## Knowledge Gaps
- **71 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `fetchInternationalGoldPrice`, `gold-api.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `createAnonClient()` connect `admin/page.tsx` to `fetchInternationalGoldPrice`, `(public)/page.tsx`, `(public)/harga/page.tsx`, `gold-api.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10574712643678161 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `gold-api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._