import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap outline-none select-none transition-colors duration-150 focus-visible:ring-4 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[var(--navy)] text-white hover:bg-[var(--navy-strong)]",
        outline:
          "border border-[var(--line-strong)] bg-white/70 text-[var(--ink)] hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]/35 aria-expanded:bg-[var(--gold-soft)]/35",
        secondary:
          "bg-[var(--gold-soft)] text-[var(--ink)] hover:bg-[var(--gold-soft-strong)] aria-expanded:bg-[var(--gold-soft)]",
        ghost:
          "bg-transparent text-[var(--ink-soft)] hover:bg-[var(--muted)] hover:text-[var(--ink)] aria-expanded:bg-[var(--muted)]",
        destructive:
          "bg-[rgba(201,74,74,0.1)] text-[var(--destructive)] hover:bg-[rgba(201,74,74,0.14)]",
        gold: "bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold-strong)] hover:text-white",
        link: "bg-transparent p-0 text-[var(--ink)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5",
        xs: "h-7 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-2.5 text-[13px] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 px-4 text-sm",
        icon: "size-9",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
