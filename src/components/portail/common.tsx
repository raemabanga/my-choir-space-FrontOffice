import type { ReactNode } from "react"

export function SectionTitle({
  children,
  subtitle,
}: {
  children: ReactNode
  subtitle?: ReactNode
}) {
  return (
    <div className="mb-5">
      <div className="font-heading text-2xl font-semibold text-foreground">
        {children}
      </div>
      {subtitle && (
        <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
      )}
    </div>
  )
}

export function MonoLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
      {children}
    </div>
  )
}

export function StaffLines({ opacity = 0.25 }: { opacity?: number }) {
  return (
    <svg width="100%" height="18" className="block" style={{ opacity }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={3 + i * 3.5}
          x2="100%"
          y2={3 + i * 3.5}
          stroke="var(--gold)"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

export function ProgressBar({
  value,
  colorClassName = "bg-gold",
  trackClassName = "bg-muted",
}: {
  value: number
  colorClassName?: string
  trackClassName?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={"h-1.5 w-full overflow-hidden rounded-full " + trackClassName}>
      <div
        className={"h-full rounded-full transition-[width] " + colorClassName}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function MiniStat({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div>
      <div className="font-mono text-[10.5px] text-muted-foreground uppercase">
        {label}
      </div>
      <div className={"mt-0.5 text-[15px] font-semibold text-foreground " + (className ?? "")}>
        {value}
      </div>
    </div>
  )
}
