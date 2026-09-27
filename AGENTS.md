# crypto-logos-app

React + Vite + Tailwind CSS v4 project. A browse/search/copy gallery for crypto logo SVGs. Deploys to Vercel. No database — icons are read from `public/icons/` and indexed into a JSON manifest before dev/build.

## Development

- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Generate icon manifest: `npm run generate-manifest`

The `predev` and `prebuild` scripts regenerate the icon manifest automatically.

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into `#root`
- `src/App.tsx` - Page shell: header, `IconExplorer`, footer; imports the generated `src/data/icons.json`
- `src/components/IconExplorer.tsx` - Search state, ranked filtering (popular coins first), sticky search bar, `/` shortcut, result grid
- `src/components/IconCard.tsx` - Single logo cell; click copies the SVG to clipboard, hover shows the full name and a download button
- `src/components/Toast.tsx` - "Copied" toast; shows a one-time Ko-fi nudge per visit
- `src/links.ts` - External URLs (Ko-fi)
- `public/favicon.svg`, `public/apple-touch-icon.png` - Tab and home-screen icons (the logo mark)
- `src/index.css` - Google font imports, Tailwind v4 import, `@theme` design tokens, global styles
- `scripts/generate-manifest.mjs` - Scans `public/icons/*.svg` and writes `src/data/icons.json`. Handles both `btc.svg` and `btc-bitcoin.svg` naming
- `public/icons/` - The SVG logo files. Filenames drive ticker/name in search
- `src/data/icons.json` - Generated manifest (ticker, name, slug, file path). Do not edit by hand; run `npm run generate-manifest`
- `index.html` - Vite HTML shell with `#root`, loading `src/main.tsx`
- `vite.config.ts` - Vite config with React, Tailwind v4, and `@` alias for `src`

## Adding icons

Copy the SVG files into `public/icons/` (naming `ticker.svg` or `ticker-name.svg`), then run `npm run generate-manifest` (or `npm run dev` / `npm run build`, which run it automatically).

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, `@vitejs/plugin-react`
- Formatting: oxfmt
