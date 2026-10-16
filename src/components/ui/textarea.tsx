import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full min-w-0 rounded-xl border border-[var(--line)] bg-white/80 px-3.5 py-3 text-sm text-[var(--ink)] shadow-[0_1px_0_rgba(17,24,39,0.02)] outline-none transition-all selection:bg-[var(--gold)]/20 placeholder:text-[var(--ink-light)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[var(--gold)] focus-visible:ring-4 focus-visible:ring-[var(--ring)]",
        "aria-invalid:border-[var(--destructive)] aria-invalid:ring-4 aria-invalid:ring-[rgba(201,74,74,0.12)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
