# crypto-logos-app

React + Vite + Tailwind CSS v4 project running inside Figma Make. A browse/search/copy gallery for crypto logo SVGs. Deploys to Vercel. No database — icons are read from `public/icons/` and indexed into a JSON manifest before dev/build.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately
- The `predev`/`prebuild` scripts regenerate the icon manifest automatically

## Project Structure

This is the canonical project structure. Start with task-relevant files below.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into `#root`
- `src/App.tsx` - Page shell: header, `IconExplorer`, footer; imports the generated `src/data/icons.json`
- `src/components/IconExplorer.tsx` - Search state, live filtering, sticky search bar, result grid
- `src/components/IconCard.tsx` - Single logo cell; fetches the SVG file and copies it to clipboard with a "Copied" confirmation
- `src/index.css` - Google font `@import`s (Inter, Instrument Sans, JetBrains Mono), Tailwind v4 import, `@theme` design tokens, global styles
- `scripts/generate-manifest.mjs` - Scans `public/icons/*.svg` and writes `src/data/icons.json`. Handles both `btc.svg` and `btc-bitcoin.svg` naming
- `public/icons/` - The SVG logo files (drop the full 876 here). Filenames drive ticker/name in search
- `src/data/icons.json` - Generated manifest (ticker, name, slug, file path). Do not edit by hand; run `pnpm generate-manifest`
- `index.html` - Vite HTML shell with `#root`, loading `src/main.tsx`
- `vite.config.ts` - Vite config with React, Tailwind v4, and Figma Make plugins plus the `@` alias for `src`

## Adding the full icon set

Copy the SVG files into `public/icons/` (naming `ticker.svg` or `ticker-name.svg`), then run `pnpm generate-manifest` (or just `pnpm dev` / `pnpm build`, which run it automatically).

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin in `vite.config.ts`. `src/index.css` imports Tailwind with `@import "tailwindcss";` and defines theme tokens in an `@theme` block. Use Tailwind utility classes in JSX. Fonts are loaded via Google Fonts `@import` at the top of `src/index.css` (before all other statements) and exposed through the `@theme` font tokens.

## Code quality

- Use double quotes for strings containing apostrophes, or escape them in single-quoted strings.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
