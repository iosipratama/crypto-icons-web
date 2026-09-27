import { useEffect, useState } from "react"
import { KOFI_URL } from "../links"

export type ToastMessage = {
  id: number
  kind: "copied" | "error"
  filename: string
  nudge: boolean
}

export default function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage | null
  onDismiss: () => void
}) {
  // Keep the last message rendered while it fades out
  const [shown, setShown] = useState(toast)
  if (toast && toast !== shown) setShown(toast)

  // Hovering pauses dismissal so the Ko-fi link stays clickable
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!toast || paused) return
    const timer = setTimeout(onDismiss, toast.nudge ? 6000 : 2200)
    return () => clearTimeout(timer)
  }, [toast, paused, onDismiss])

  const visible = toast !== null

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {shown && (
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className={`flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-200 ease-out ${
            visible
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
        >
          <span className="flex items-center gap-2">
            {shown.kind === "copied" ? (
              <CheckIcon className="h-4 w-4 text-accent" />
            ) : (
              <AlertIcon className="h-4 w-4 text-[#f87171]" />
            )}
            {shown.kind === "copied" ? "Copied" : "Couldn’t copy"}
            <span className="font-mono text-xs opacity-70">
              {shown.filename}
            </span>
          </span>
          {shown.nudge && (
            <>
              <span
                className="hidden h-4 w-px bg-primary-foreground/20 sm:block"
                aria-hidden
              />
              <a
                href={KOFI_URL}
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap text-primary-foreground/70 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
              >
                Useful? Buy me a coffee ☕
              </a>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}
