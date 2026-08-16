import { useMemo, useState } from "react"
import IconCard from "./IconCard"

export type CryptoIcon = {
  slug: string
  ticker: string
  name: string
  file: string
}

export default function IconExplorer({ icons }: { icons: CryptoIcon[] }) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return icons
    return icons.filter(
      (icon) =>
        icon.ticker.toLowerCase().includes(q) ||
        icon.name.toLowerCase().includes(q) ||
        icon.slug.includes(q),
    )
  }, [icons, query])

  return (
    <section>
      {/* Sticky search */}
      <div className="sticky top-0 z-10 -mx-6 bg-background/85 px-6 py-4 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="relative mx-auto max-w-xl">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logos — try “btc” or “solana”"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-24 text-[15px] text-foreground placeholder:text-subtle outline-none transition-colors focus:border-border-strong"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-subtle">
            {results.length} / {icons.length}
          </span>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[15px] text-muted">
            No logos match{" "}
            <span className="font-mono text-foreground">“{query}”</span>.
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((icon) => (
            <IconCard key={icon.slug} icon={icon} />
          ))}
        </div>
      )}
    </section>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
