# Graph Report - safar-gold  (2026-08-03)

## Corpus Check
- 62 files · ~24,358 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 268 nodes · 403 edges · 28 communities (21 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cca28fb9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (public)/harga/page.tsx
- compilerOptions
- (public)/page.tsx
- dependencies
- gold-api.ts
- devDependencies
- konten/page.tsx
- AdminHargaClient.tsx
- JenisEmasClient.tsx
- createAdminClient
- app/layout.tsx
- PriceChart.tsx
- tentang/page.tsx
- App Icon
- middleware.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- About Us Hero Image
- Safar Gold Store Interior Hero
- opencode.json
- graphify.js

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createAdminClient()` - 13 edges
3. `getAllGoldTypes()` - 12 edges
4. `getPublicSettings()` - 12 edges
5. `getFormattedTodayPrices()` - 11 edges
6. `createAnonClient()` - 11 edges
7. `fetchInternationalGoldPrice()` - 10 edges
8. `setSetting()` - 9 edges
9. `formatRupiah()` - 9 edges
10. `calculatePrices()` - 7 edges

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

### Community 0 - "(public)/harga/page.tsx"
Cohesion: 0.12
Nodes (22): AdminHargaPage(), dynamic, AdminDashboard(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, dynamic (+14 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 2 - "(public)/page.tsx"
Cohesion: 0.11
Nodes (17): PublicLayout(), dynamic, HomePage(), metadata, BackToTop(), CaraTransaksi(), FAQ(), faqs (+9 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (23): chart.js, next, dependencies, chart.js, next, react, react-chartjs-2, react-dom (+15 more)

### Community 4 - "gold-api.ts"
Cohesion: 0.20
Nodes (18): DELETE(), dynamic, POST(), dynamic, POST(), dynamic, GET(), AppSettingRow (+10 more)

### Community 5 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 6 - "konten/page.tsx"
Cohesion: 0.31
Nodes (6): AdminKontenClient(), AdminKontenPage(), dynamic, Hero(), getHeroContent(), HeroContent

### Community 7 - "AdminHargaClient.tsx"
Cohesion: 0.17
Nodes (12): AdminHargaClient(), formatRupiahClient(), MODE_TABS, formatRupiah(), PREVIEW_TABS, PriceApprovalPanel(), Props, Calculator() (+4 more)

### Community 8 - "JenisEmasClient.tsx"
Cohesion: 0.11
Nodes (15): CATEGORIES, emptyForm, FormData, FormModal(), getCategoryLabel(), JenisEmasClient(), nameToSlug(), dynamic (+7 more)

### Community 9 - "createAdminClient"
Cohesion: 0.23
Nodes (8): POST(), PUT(), POST(), POST(), POST(), createGoldType(), updateGoldType(), createAdminClient()

### Community 10 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "PriceChart.tsx"
Cohesion: 0.40
Nodes (5): chartData, generateMockData(), options, periods, PriceChart()

### Community 12 - "tentang/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, timeline, values

### Community 14 - "App Icon"
Cohesion: 0.67
Nodes (3): Favicon Logo, Safar Gold Logo, App Icon

### Community 26 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **94 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `eslintConfig`, `nextConfig`, `name` (+89 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `createAdminClient` to `gold-api.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `createAnonClient()` connect `(public)/harga/page.tsx` to `(public)/page.tsx`, `gold-api.ts`, `konten/page.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `eslintConfig` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `(public)/harga/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12096774193548387 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `(public)/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10574712643678161 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._