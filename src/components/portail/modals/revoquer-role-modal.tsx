import { useState } from "react"
import { History } from "lucide-react"
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

export function RevoquerRoleModal({
  compte,
  onClose,
  onRevoquer,
}: {
  compte: Compte
  onClose: () => void
  onRevoquer: (id: string, role: Role) => void
}) {
  const revocables = compte.roles.filter((r) => r !== "choriste")
  const [role, setRole] = useState<Role | undefined>(revocables[0])

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Révoquer un rôle — {compte.nom}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label>Rôle à révoquer</Label>
          <Select value={role} onValueChange={(v) => v && setRole(v as Role)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {revocables.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-[11.5px] text-muted-foreground">
          Le compte repasse au statut Choriste pour ce mandat. Cette action est
          tracée dans l'historique.
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            disabled={!role}
            onClick={() => role && onRevoquer(compte.id, role)}
          >
            <History size={14} /> Révoquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
