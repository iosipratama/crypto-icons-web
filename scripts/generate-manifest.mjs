// Scans public/icons/*.svg and writes app/data/icons.json.
// Handles both naming styles: "btc.svg" (ticker only) and "btc-bitcoin.svg" (ticker-name).
// No database — this is the single source of truth for the grid + search.

import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "public", "icons");
const outFile = join(root, "src", "data", "icons.json");

function titleCase(str) {
  return str
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

let files = [];
try {
  files = readdirSync(iconsDir).filter((f) => f.toLowerCase().endsWith(".svg"));
} catch {
  console.warn(`[manifest] No icons dir at ${iconsDir} yet — writing empty manifest.`);
}

const icons = files
  .map((file) => {
    const base = file.replace(/\.svg$/i, "");
    // "btc-bitcoin" -> ticker "BTC", name "Bitcoin"; "btc" -> ticker "BTC", name "Btc"
    const dash = base.indexOf("-");
    let ticker, name;
    if (dash > 0) {
      ticker = base.slice(0, dash);
      name = titleCase(base.slice(dash + 1));
    } else {
      ticker = base;
      name = titleCase(base);
    }
    return {
      slug: base.toLowerCase(),
      ticker: ticker.toUpperCase(),
      name,
      file: `/icons/${file}`,
    };
  })
  .sort((a, b) => a.ticker.localeCompare(b.ticker));

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(icons, null, 2) + "\n");
console.log(`[manifest] Wrote ${icons.length} icons to src/data/icons.json`);
