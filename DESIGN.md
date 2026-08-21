# DESIGN.md — Safar Gold "Atelier"

Durable design system for the admin panel (and shared components). Captured from the built world, not speculative. Follow these rules before adding or restyling any UI.

## Design tokens

Defined in `src/app/globals.css` under `@theme inline`. Use utilities (e.g. `bg-surface`, `text-text-muted`), never raw hex in components unless a value does not exist yet.

| Token | Value | Role |
|---|---|---|
| `gold` | `#c89116` | Primary accent / brand |
| `gold-light` | `#f5d061` | Hover for solid-gold buttons |
| `gold-dark` | `#9b7110` | Text on gold tints / outline buttons |
| `surface` | `#f8f6f0` | Content area background (warm cream) |
| `surface-alt` | `#f2efe7` | Secondary neutral layer |
| `border` | `#e8e4d8` | Hairline borders |
| `text` | `#1a1a1a` | Primary text |
| `text-muted` | `#6b6b6b` | Secondary text / labels |
| `text-light` | `#9ca3af` | Tertiary / disabled |
| `footer` | `#111111` | Dark surfaces (footer, hero bg) |
| `footer-text` | `#a3a3a3` | Muted on dark |
| `sidebar` | `#17130f` | Dark sidebar background |

### Fonts
- `font-serif` → **Playfair Display** — page/section titles and large numeric (KPI) values only. Never for UI labels or body.
- `font-sans` → **Geist Sans** — everything else (labels, body, data, buttons).
- `font-mono` → Geist Mono — code/IDs only (e.g. widget ID).

## Radius scale

- Cards / panels / table wrappers: **`rounded-xl`** (never `rounded-2xl`).
- Inner boxes, inputs, buttons: **`rounded-lg`**.
- Badges / pills / avatars: **`rounded-full`**.
- Sharp corners are the default language; do not reintroduce large rounding.

## Shadows

- Cards: **no shadow** — rely on hairline `border-border/60`.
- Overlays (modals): `shadow-lg` (elevation is reserved for overlays).
- Never `shadow-md`/`shadow-2xl` on cards; never colored glow (`shadow-gold/*`).

## Buttons

| Kind | Classes |
|---|---|
| Primary | `rounded-lg bg-gold px-* py-* text-sm font-semibold text-[#1a1a1a] hover:bg-gold-light` |
| Outline (gold) | `rounded-lg border border-gold/40 text-gold-dark hover:bg-gold/5` |
| Neutral | `rounded-lg border border-border/60 text-text-muted hover:bg-surface` |
| Destructive | `rounded-lg bg-red-500 text-white hover:bg-red-600` |
| Focus ring (buttons) | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2` |
| Focus ring (inputs) | `focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30` |

- Primary actions use **solid gold + dark text** (high contrast), NOT `gold-gradient-bg` with white text.
- `gold-gradient-bg` / `gold-gradient-text` are public-site brand elements only (hero CTA, gradient headline). Do not use them inside admin UI.

## Typography conventions

- Page title: `font-serif text-2xl font-semibold` (one `<h1>` per page).
- Section title: `font-serif text-lg font-semibold`.
- Field/section label (small caps): `text-xs font-semibold uppercase tracking-wider text-text-muted`.
- Numeric data (prices, quantities, KPIs, tables): always add **`tabular-nums`**.

## Layout / shell

- **Sidebar** (`AdminSidebar.tsx`): dark `bg-sidebar`, border `border-white/10`. Brand header `h-[72px]`. Nav grouped into sections with small caps labels: *Utama*, *Transaksi*, *Inventori*, *Pengelolaan*. Active item = `bg-gold/15 text-gold-light` + `aria-current="page"`.
- **Topbar** (`(admin)/layout.tsx`): sticky `h-[72px]` (aligns with sidebar brand header), `bg-white/85 backdrop-blur-md`, border `border-border/60`. Breadcrumb `{Group} › {Title}` from `pageMeta` map. Right side = avatar (initial) + name (email local part) + role badge.
- **Content**: `main` padding `p-4 md:p-6 lg:p-8`, background `bg-surface`.

## State patterns

- **Loading**: `AdminSkeleton` (admin dashboard) or centered spinner for quick fetches. Never a spinner in the middle of content.
- **Empty**: centered muted text inside the table (`colSpan`), e.g. "Belum ada data …".
- **Error**: red banner (`rounded-lg border-red-200 bg-red-50 text-red-600`) or a full error state with a retry button.
- **Data fetch in `useEffect`**: inline `async function load()` inside the effect with a `cancelled` guard, and a `reloadKey` state for refetch after mutations. Do NOT call an external function that synchronously calls `setState` (React Compiler `react-hooks/set-state-in-effect`).

## Component vocabulary

- Modal: `rounded-xl border border-border/60 bg-white shadow-lg`, header `border-b border-border/40`, footer `border-t border-border/40 rounded-b-xl`.
- Table: wrapper `overflow-hidden rounded-xl border border-border/60 bg-white`, header row `bg-surface/50 text-xs font-semibold uppercase tracking-wider text-text-muted`, rows `divide-y divide-border/30`.
- Badge (status): `rounded-full px-2 py-0.5 text-xs font-medium` with semantic colors (emerald = ok/active, amber = warning, red = danger). Never color as the only signal — pair with text.
