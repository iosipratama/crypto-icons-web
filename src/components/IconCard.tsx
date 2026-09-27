import { useState } from "react"
import type { CryptoIcon } from "./IconExplorer"

const svgCache = new Map<string, Promise<string>>()

function loadSvg(file: string) {
  let svg = svgCache.get(file)
  if (!svg) {
    svg = fetch(file).then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${file}`)
      return res.text()
    })
    svg.catch(() => svgCache.delete(file))
    svgCache.set(file, svg)
  }
  return svg
}

async function copySvg(file: string) {
  const svg = loadSvg(file)
  // Safari drops the click's user activation across an await, so hand the
  // clipboard a pending item up front. Fall back to writeText elsewhere.
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": svg.then(
          (text) => new Blob([text], { type: "text/plain" }),
        ),
      }),
    ])
  } catch {
    await navigator.clipboard.writeText(await svg)
  }
}

export default function IconCard({
  icon,
  onCopy,
}: {
  icon: CryptoIcon
  onCopy: (icon: CryptoIcon, ok: boolean) => void
}) {
  const [copied, setCopied] = useState(false)
  const hasName = icon.name.toLowerCase() !== icon.ticker.toLowerCase()
  const label = hasName ? `${icon.name} (${icon.ticker})` : icon.ticker
  const filename = icon.file.split("/").pop()

  async function handleCopy() {
    try {
      await copySvg(icon.file)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
      onCopy(icon, true)
    } catch {
      onCopy(icon, false)
    }
  }

  return (
    <li className="group relative">
      <button
        onClick={handleCopy}
        aria-label={`Copy ${label} SVG`}
        title={`${label} — click to copy SVG`}
        className={`flex aspect-square w-full flex-col items-center justify-center gap-2.5 rounded-xl border bg-card outline-none transition-[border-color,box-shadow] duration-150 hover:shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(0,0,0,0.15)] focus-visible:border-foreground ${
          copied ? "border-accent" : "border-border hover:border-border-strong"
        }`}
      >
        <img
          src={icon.file}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="h-10 w-10 transition-transform duration-200 group-hover:scale-110"
        />
        {/* Ticker slides up to reveal the full name on hover */}
        <span className="relative block h-4 w-full overflow-hidden text-[11px] leading-4">
          <span
            className={`block font-mono uppercase tracking-wide text-subtle transition-transform duration-200 ${
              hasName
                ? "group-hover:-translate-y-full"
                : "group-hover:text-foreground"
            }`}
          >
            {icon.ticker}
          </span>
          {hasName && (
            <span className="absolute inset-x-0 top-full truncate px-2 font-medium text-foreground transition-transform duration-200 group-hover:-translate-y-full">
              {icon.name}
            </span>
          )}
        </span>
      </button>

      <a
        href={icon.file}
        download={filename}
        aria-label={`Download ${label} SVG`}
        title="Download SVG"
        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg text-subtle opacity-0 outline-none transition-[opacity,color,background-color] duration-150 hover:bg-background hover:text-foreground focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-foreground group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <DownloadIcon className="h-3.5 w-3.5" />
      </a>
    </li>
  )
}

function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  )
}
