import { useEffect, useMemo, useRef, useState } from "react"
import IconCard from "./IconCard"

export type CryptoIcon = {
  slug: string
  ticker: string
  name: string
  file: string
}

// Shown first when browsing, and used as a tie-breaker when searching.
const POPULAR = [
  "BTC",
  "ETH",
  "USDT",
  "BNB",
  "SOL",
  "XRP",
  "USDC",
  "ADA",
  "DOGE",
  "TRX",
  "AVAX",
  "LINK",
  "DOT",
  "MATIC",
  "LTC",
  "SHIB",
  "UNI",
  "ATOM",
  "XLM",
  "SUI",
]
const popularRank = new Map(POPULAR.map((ticker, i) => [ticker, i]))
const popularity = (icon: CryptoIcon) =>
  popularRank.get(icon.ticker) ?? POPULAR.length

type ScoredIcon = {
  icon: CryptoIcon
  score: number
}

// Lower is better; null means no match.
function matchScore(icon: CryptoIcon, q: string): number | null {
  const ticker = icon.ticker.toLowerCase()
  const name = icon.name.toLowerCase()
  if (ticker === q) return 0
  if (ticker.startsWith(q)) return 1
  if (name.startsWith(q)) return 2
  if (ticker.includes(q) || name.includes(q) || icon.slug.includes(q)) return 3
  return null
}

export default function IconExplorer({
  icons,
  onCopy,
}: {
  icons: CryptoIcon[]
  onCopy: (icon: CryptoIcon, ok: boolean) => void
}) {
  const [query, setQuery] = useState("")
  const [stuck, setStuck] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const scored: ScoredIcon[] = []
    for (const icon of icons) {
      const score = q ? matchScore(icon, q) : 0
      if (score !== null) scored.push({ icon, score })
    }
    return scored
      .sort(
        (a, b) => a.score - b.score || popularity(a.icon) - popularity(b.icon),
      )
      .map((s) => s.icon)
  }, [icons, query])

  // "/" focuses search from anywhere on the page
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      if (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      )
        return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Show the search bar's background once it sticks to the top
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) =>
      setStuck(!entry.isIntersecting),
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <section>
      <div ref={sentinelRef} className="h-px" aria-hidden />

      {/* Sticky search, full-bleed so the divider spans the viewport */}
      <div
        className={`sticky top-0 z-20 mx-[calc(50%-50vw)] border-b px-6 py-3 transition-[background-color,border-color] duration-200 ${
          stuck
            ? "border-border bg-background/85 backdrop-blur-md"
            : "border-transparent"
        }`}
      >
        <div className="relative mx-auto max-w-xl">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Escape") return
              if (query) setQuery("")
              else e.currentTarget.blur()
            }}
            placeholder="Search logos — try “btc” or “solana”"
            aria-label="Search logos"
            autoComplete="off"
            spellCheck={false}
            className={`peer w-full rounded-full border border-border bg-card py-3 pl-11 text-[15px] text-foreground placeholder:text-subtle outline-none transition-colors focus:border-border-strong ${
              query ? "pr-32" : "pr-5 md:pr-14"
            }`}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 peer-focus:[&>kbd]:hidden">
            {query ? (
              <>
                <span
                  className="font-mono text-xs text-subtle"
                  aria-live="polite"
                >
                  {results.length} {results.length === 1 ? "result" : "results"}
                </span>
                <button
                  onClick={() => {
                    setQuery("")
                    inputRef.current?.focus()
                  }}
                  aria-label="Clear search"
                  className="grid h-8 w-8 place-items-center rounded-full text-subtle transition-colors hover:bg-background hover:text-foreground"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <kbd className="mr-2 hidden h-6 min-w-6 place-items-center rounded-md border border-border bg-background px-1.5 font-mono text-xs text-subtle md:grid">
                /
              </kbd>
            )}
          </div>
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
        <ul className="mt-3 grid grid-cols-3 gap-2 pb-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
          {results.map((icon) => (
            <IconCard key={icon.slug} icon={icon} onCopy={onCopy} />
          ))}
        </ul>
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

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
