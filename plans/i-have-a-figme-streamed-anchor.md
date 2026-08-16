# Crypto Logos — SVG Icon Library Web App

## Context
The user published a Figma Community file with **876 crypto logos as SVG** and wants a companion web app so designers/developers (crypto wallets, exchanges) can browse, search, and copy the SVGs. It must be a static, no-database app that reads SVGs from a single folder, deploy to **Vercel via Next.js (App Router)**, and adopt the clean warm-minimal design language of [ioslayers.com](https://ioslayers.com) (reference: [icons.saman.design](https://icons.saman.design)).

Key decisions confirmed with user:
- **Stack: convert this scaffold to Next.js (App Router).**
- SVGs go in one folder; **no database**. Filenames are currently the ticker (`btc.svg`); may later become `ticker-name.svg`. The manifest script must handle both.

> ⚠️ Note to flag on start: the Figma Make live preview runs Vite. Converting to Next.js may change/break the in-panel preview even though it deploys fine to Vercel. Proceeding per the user's explicit choice.

## Design language (from ioslayers)
- Warm off-white background (~`#f3f2ef`), near-black text (`#1a1a1a`), muted gray secondary text.
- Rounded (`~16px`) cards with hairline borders, generous whitespace, centered content column.
- Slightly characterful sans for headings + clean neutral sans for body (Google Fonts via `next/font/google`, e.g. heading `Instrument Sans`/`Bricolage Grotesque`, body `Inter`). Final pairing chosen via the `aesthetic-stance` skill at implementation.
- Pill buttons (black fill / white text), subtle hover states, no heavy shadows.

## Approach

### 1. Convert scaffold to Next.js App Router
- Replace Vite setup with Next.js: add `next` dependency; remove `vite.config.ts`, `index.html`, `src/main.tsx`, `@vitejs/plugin-react`, `@tailwindcss/vite`.
- Create `app/layout.tsx`, `app/page.tsx`, `app/globals.css`.
- Tailwind v4 with Next: use `@import "tailwindcss";` in `globals.css` and the PostCSS plugin (`@tailwindcss/postcss`) — add `postcss.config.mjs`.
- Update `package.json` scripts to `next dev` / `next build` / `next start`; add `tsconfig.json` paths + `next-env.d.ts`.
- Wire fonts through `next/font/google` in `layout.tsx`.

### 2. Icon storage + manifest (no DB)
- SVGs live in `public/icons/*.svg` (user drops them here).
- Build script `scripts/generate-manifest.mjs` scans `public/icons`, and for each file derives:
  - `ticker` (uppercased, e.g. `BTC`), `name` (from `ticker-name.svg` if present, else humanized ticker), `file`, `slug`.
- Outputs `app/data/icons.json` (a lightweight index — ticker/name/file only, **not** the raw SVG markup, to keep bundle small).
- Hook the script into a `prebuild`/`predev` npm script so the manifest regenerates automatically.
- Add a small placeholder set of sample SVGs so the app renders before the real 876 are added.

### 3. Search (client-side, instant)
- `app/page.tsx` is a server component that loads `icons.json`; a client component (`components/IconExplorer.tsx`) holds search state.
- Fuzzy/substring match against ticker + name, filtering the grid live as the user types (no submit button). Show result count.

### 4. Icon grid + copy interaction
- Responsive grid of bordered cards; each cell renders the SVG (via `<img src="/icons/..">` for the thumbnail) with ticker label beneath.
- **Copy SVG:** on click/hover-action, fetch the SVG file text and `navigator.clipboard.writeText(...)`, with a "Copied!" confirmation state (toast or in-cell label swap).
- Optional: click opens a lightweight detail (larger preview + copy SVG / copy filename). Start with hover-to-copy per the saman reference; keep it simple.

### 5. Page chrome
- Header: logo/title, short tagline, count ("876 crypto logos"), link back to the Figma Community file.
- Sticky search bar under header.
- Footer: credit + Figma file link.

## Critical files
- `app/layout.tsx` — root layout, fonts, metadata.
- `app/page.tsx` — loads manifest, renders explorer.
- `app/globals.css` — Tailwind import + design tokens (colors, radius, fonts).
- `components/IconExplorer.tsx` — search + grid + copy (client).
- `components/IconCard.tsx` — single logo cell with copy action.
- `scripts/generate-manifest.mjs` — folder → `app/data/icons.json`.
- `public/icons/` — the SVG folder (user-provided).
- `package.json`, `tsconfig.json`, `postcss.config.mjs`, `next.config.mjs` — Next.js config.
- Remove: `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`.

## Verification
1. Add a handful of sample SVGs to `public/icons/`, run the manifest script, confirm `icons.json` generated with correct ticker/name.
2. `next dev` → grid renders, typing filters instantly, result count updates.
3. Click/hover copy → clipboard contains the exact SVG markup; "Copied!" state shows.
4. Test both `btc.svg` and `btc-bitcoin.svg` naming to confirm the parser handles each.
5. `next build` succeeds (Vercel-ready).
