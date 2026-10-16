import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap tracking-[0.08em] uppercase transition-all focus-visible:ring-4 focus-visible:ring-[var(--ring)] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-[rgba(17,24,39,0.08)] bg-[rgba(17,24,39,0.04)] text-[var(--ink-soft)]",
        secondary: "border-[rgba(17,24,39,0.08)] bg-white/80 text-[var(--ink)]",
        outline:
          "border-[color-mix(in_srgb,var(--gold-strong)_45%,transparent)] bg-transparent text-[var(--gold-strong)]",
        success: "border-[rgba(31,138,91,0.18)] bg-[var(--success-bg)] text-[var(--success)]",
        warning: "border-[rgba(183,121,31,0.2)] bg-[var(--warning-bg)] text-[var(--warning)]",
        destructive:
          "border-[rgba(201,74,74,0.2)] bg-[rgba(201,74,74,0.06)] text-[var(--destructive)]",
        ghost: "border-transparent hover:bg-muted hover:text-muted-foreground",
        link: "border-transparent text-[var(--ink)] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
