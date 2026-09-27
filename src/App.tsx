import { useCallback, useRef, useState } from "react"
import icons from "./data/icons.json"
import IconExplorer, { type CryptoIcon } from "./components/IconExplorer"
import Toast, { type ToastMessage } from "./components/Toast"
import { KOFI_URL } from "./links"

// Ask for support once per visit, after someone has copied a few logos
const NUDGE_AFTER_COPIES = 2
const NUDGE_KEY = "kofi-nudge-shown"

function claimNudge() {
  try {
    if (sessionStorage.getItem(NUDGE_KEY)) return false
    sessionStorage.setItem(NUDGE_KEY, "1")
    return true
  } catch {
    return false
  }
}

export default function App() {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const copies = useRef(0)
  const toastId = useRef(0)

  const handleCopy = useCallback((icon: CryptoIcon, ok: boolean) => {
    if (ok) copies.current += 1
    const nudge = ok && copies.current >= NUDGE_AFTER_COPIES && claimNudge()
    setToast({
      id: ++toastId.current,
      kind: ok ? "copied" : "error",
      filename: icon.file.split("/").pop() ?? icon.ticker,
      nudge,
    })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <TopBar />
        <Header count={icons.length} />
        <IconExplorer icons={icons} onCopy={handleCopy} />
        <Footer />
      </div>
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}

function TopBar() {
  return (
    <nav className="flex items-center justify-between py-5">
      <a
        href="/"
        className="flex items-center gap-2.5 font-display text-[15px] font-semibold tracking-[-0.01em]"
      >
        <LogoMark className="h-6 w-6" />
        Crypto Logos
      </a>
      <a
        href={KOFI_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-border-strong"
      >
        <CoffeeIcon className="h-4 w-4 text-[#ff5e5b]" />
        Buy me a coffee
      </a>
    </nav>
  )
}

function Header({ count }: { count: number }) {
  return (
    <header className="pt-10 pb-10 text-center md:pt-16 md:pb-12">
      <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-6xl">
        {count} crypto logos,
        <br className="hidden md:block" /> ready to copy.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted">
        A clean set of SVG icons for wallets, exchanges, and anything crypto.
        Search, click, paste.
      </p>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-10 text-sm text-subtle">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-medium text-foreground">Crypto Logos</p>
          <p className="leading-relaxed">
            Made by Iosi Pratama. All logos are trademarks of their respective
            owners and are shown for identification only.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Buy me a coffee
          </a>
        </div>
      </div>
      <p className="mt-8 text-xs">© {new Date().getFullYear()} Crypto Logos</p>
    </footer>
  )
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="7" fill="currentColor" />
      <circle
        cx="12"
        cy="12"
        r="5"
        fill="none"
        stroke="var(--color-background)"
        strokeWidth="2"
      />
    </svg>
  )
}

function CoffeeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M6 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
    </svg>
  )
}
