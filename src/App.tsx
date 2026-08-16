import icons from "./data/icons.json"
import IconExplorer from "./components/IconExplorer"

const FIGMA_URL = "https://www.figma.com/community"

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Header count={icons.length} />
        <IconExplorer icons={icons} />
        <Footer />
      </div>
    </div>
  )
}

function Header({ count }: { count: number }) {
  return (
    <header className="pt-14 pb-10 md:pt-24 md:pb-14 text-center">
      <a
        href={FIGMA_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        Free Figma community file
      </a>
      <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-6xl">
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
    <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border py-8 text-sm text-subtle md:flex-row">
      <p>Crypto Logos · {new Date().getFullYear()}</p>
      <a
        href={FIGMA_URL}
        target="_blank"
        rel="noreferrer"
        className="transition-colors hover:text-foreground"
      >
        Get the Figma file →
      </a>
    </footer>
  )
}
