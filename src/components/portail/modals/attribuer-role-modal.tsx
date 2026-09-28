import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLE_LABEL } from "@/data/portail-mock"
import type { Compte, Role } from "@/types/portail"

const ASSIGNABLE_ROLES: Role[] = [
  "commission_recette",
  "commission_musicale",
  "bureau",
  "tresorier",
]

export function AttribuerRoleModal({
  compte,
  onClose,
  onAttribuer,
}: {
  compte: Compte
  onClose: () => void
  onAttribuer: (id: string, role: Role) => void
}) {
  const options = ASSIGNABLE_ROLES.filter((r) => !compte.roles.includes(r))
  const [role, setRole] = useState<Role | "">(options[0] ?? "")

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attribuer un rôle — {compte.nom}</DialogTitle>
        </DialogHeader>

        {options.length === 0 ? (
          <div className="text-[12.5px] text-muted-foreground">
            Ce compte détient déjà tous les rôles attribuables.
          </div>
        ) : (
          <div className="grid gap-1.5">
            <Label>Nouveau rôle</Label>
            <Select value={role} onValueChange={(v) => v && setRole(v as Role)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button disabled={!role} onClick={() => role && onAttribuer(compte.id, role)}>
            <Check size={14} /> Attribuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
