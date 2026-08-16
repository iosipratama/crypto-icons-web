import { useState } from "react"
import type { CryptoIcon } from "./IconExplorer"

export default function IconCard({ icon }: { icon: CryptoIcon }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  async function copySvg() {
    try {
      const res = await fetch(icon.file)
      const svg = await res.text()
      await navigator.clipboard.writeText(svg)
      setCopied(true)
      setError(false)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setError(true)
      setTimeout(() => setError(false), 1400)
    }
  }

  return (
    <button
      onClick={copySvg}
      title={`${icon.name} — click to copy SVG`}
      className="group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-4 text-center outline-none transition-all hover:border-border-strong hover:shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(0,0,0,0.15)] focus-visible:border-foreground"
    >
      <img
        src={icon.file}
        alt={`${icon.name} logo`}
        width={40}
        height={40}
        loading="lazy"
        className="h-10 w-10 transition-transform duration-200 group-hover:scale-110"
      />
      <span className="font-mono text-[11px] uppercase tracking-wide text-subtle transition-colors group-hover:text-foreground">
        {icon.ticker}
      </span>

      {/* Copy confirmation overlay */}
      <span
        className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-primary text-xs font-medium text-primary-foreground transition-opacity duration-150 ${
          copied || error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error ? "Copy failed" : "Copied SVG"}
      </span>
    </button>
  )
}
