import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-[var(--line)] bg-white/80 px-3.5 py-2 text-sm text-[var(--ink)] shadow-[0_1px_0_rgba(17,24,39,0.02)] outline-none transition-all selection:bg-[var(--gold)]/20 placeholder:text-[var(--ink-light)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[var(--gold)] focus-visible:ring-4 focus-visible:ring-[var(--ring)]",
        "aria-invalid:border-[var(--destructive)] aria-invalid:ring-4 aria-invalid:ring-[rgba(201,74,74,0.12)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
