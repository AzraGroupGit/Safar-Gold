# Graph Report - .  (2026-08-03)

## Corpus Check
- Corpus is ~20,546 words - fits in a single context window. You may not need a graph.

## Summary
- 237 nodes · 353 edges · 26 communities (20 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 10,276 input · 825 output

## Community Hubs (Navigation)
- Admin Dashboard Pages
- TypeScript & Next.js Types
- Content & Public Pages
- Core Dependencies
- Price Update API
- Development Tooling
- Public Layout Components
- Gold Price Calculator UI
- Admin Layout & Auth
- Admin API & Supabase
- App Shell & Fonts
- Price Chart Visualization
- About Page
- Brand Image Assets
- Middleware
- ESLint Config
- Next.js Config
- PostCSS Config
- Hero: About Image
- Hero: Home Image

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `getPublicSettings()` - 12 edges
3. `getFormattedTodayPrices()` - 11 edges
4. `createAnonClient()` - 11 edges
5. `getAllGoldTypes()` - 10 edges
6. `fetchInternationalGoldPrice()` - 10 edges
7. `createAdminClient()` - 10 edges
8. `setSetting()` - 9 edges
9. `formatRupiah()` - 9 edges
10. `calculatePrices()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Favicon Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/favicon.png → src/app/icon.png
- `Safar Gold Logo` --semantically_similar_to--> `App Icon`  [INFERRED] [semantically similar]
  public/logo-1.webp → src/app/icon.png
- `HomePage()` --calls--> `getPublicSettings()`  [EXTRACTED]
  src/app/(public)/page.tsx → src/lib/gold-api.ts
- `AdminKontenPage()` --calls--> `getHeroContent()`  [EXTRACTED]
  src/app/(admin)/admin/konten/page.tsx → src/lib/gold-api.ts
- `AdminPengaturanPage()` --calls--> `createAnonClient()`  [EXTRACTED]
  src/app/(admin)/admin/pengaturan/page.tsx → src/lib/supabase/anon.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — public_favicon_png, public_logo_1_webp, src_app_icon_png [EXTRACTED 0.90]
- **UI Vector Icons** — public_file_svg, public_globe_svg, public_window_svg [INFERRED 0.70]

## Communities (26 total, 6 thin omitted)

### Community 0 - "Admin Dashboard Pages"
Cohesion: 0.12
Nodes (22): AdminHargaPage(), dynamic, AdminDashboard(), dynamic, AdminPengaturanClient(), AdminPengaturanPage(), dynamic, PriceApprovalPanel() (+14 more)

### Community 1 - "TypeScript & Next.js Types"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 2 - "Content & Public Pages"
Cohesion: 0.11
Nodes (16): AdminKontenClient(), AdminKontenPage(), dynamic, dynamic, HomePage(), metadata, CaraTransaksi(), FAQ() (+8 more)

### Community 3 - "Core Dependencies"
Cohesion: 0.08
Nodes (23): chart.js, next, dependencies, chart.js, next, react, react-chartjs-2, react-dom (+15 more)

### Community 4 - "Price Update API"
Cohesion: 0.23
Nodes (16): dynamic, POST(), dynamic, POST(), dynamic, GET(), AppSettingRow, calculatePrices() (+8 more)

### Community 5 - "Development Tooling"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 6 - "Public Layout Components"
Cohesion: 0.26
Nodes (7): PublicLayout(), BackToTop(), Footer(), KunjungiKami(), Navbar(), WhatsAppButton(), getPublicSettings()

### Community 7 - "Gold Price Calculator UI"
Cohesion: 0.21
Nodes (9): AdminHargaClient(), formatRupiahClient(), Calculator(), formatRupiahClient(), quickWeights, CATEGORIES, TabbedPricelist(), FormattedPrice (+1 more)

### Community 8 - "Admin Layout & Auth"
Cohesion: 0.23
Nodes (5): AdminSidebar(), links, ConfirmModal(), Props, createClient()

### Community 9 - "Admin API & Supabase"
Cohesion: 0.46
Nodes (4): POST(), POST(), POST(), createAdminClient()

### Community 10 - "App Shell & Fonts"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, playfair, NavigationEvents()

### Community 11 - "Price Chart Visualization"
Cohesion: 0.40
Nodes (5): chartData, generateMockData(), options, periods, PriceChart()

### Community 12 - "About Page"
Cohesion: 0.40
Nodes (3): metadata, timeline, values

### Community 14 - "Brand Image Assets"
Cohesion: 0.67
Nodes (3): Favicon Logo, Safar Gold Logo, App Icon

## Knowledge Gaps
- **86 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+81 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `Admin API & Supabase` to `Price Update API`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Development Tooling` to `Core Dependencies`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `getPublicSettings()` connect `Public Layout Components` to `Admin Dashboard Pages`, `Content & Public Pages`, `Price Update API`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _86 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.11895161290322581 - nodes in this community are weakly interconnected._
- **Should `TypeScript & Next.js Types` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Content & Public Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._