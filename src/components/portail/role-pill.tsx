import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ROLE_COLOR_CLASS, ROLE_LABEL } from "@/data/portail-mock"
import type { Role } from "@/types/portail"

export function RolePill({ role, label }: { role: Role; label?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-[10px] font-medium tracking-wide uppercase",
        ROLE_COLOR_CLASS[role]
      )}
    >
      {label ?? ROLE_LABEL[role]}
    </Badge>
  )
}
