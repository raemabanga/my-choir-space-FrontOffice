import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import type { Role } from "@/types/portail"

const FULL_OPTIONS: [Role, string][] = [
  ["choriste", "Choriste"],
  ["commission_recette", "Commission recette"],
  ["commission_musicale", "Commission musicale"],
  ["bureau", "Bureau exécutif"],
  ["tresorier", "Trésorier(ère)"],
]
const LIMITED_OPTIONS: [Role, string][] = [
  ["choriste", "Choriste"],
  ["commission_recette", "Commission recette"],
  ["commission_musicale", "Commission musicale"],
]

export function CompteFormModal({
  onClose,
  onCreer,
  full,
}: {
  onClose: () => void
  onCreer: (form: { nom: string; email: string; role: Role }) => void
  full: boolean
}) {
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("choriste")
  const options = full ? FULL_OPTIONS : LIMITED_OPTIONS

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un compte</DialogTitle>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label>Nom complet</Label>
          <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Julie Nkomo" />
        </div>
        <div className="grid gap-1.5">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="julie.nkomo@mail.com" />
        </div>
        <div className="grid gap-1.5">
          <Label>Rôle initial</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!full && (
          <div className="text-[11.5px] text-muted-foreground">
            En tant que Secrétaire, l'attribution de mandats (Bureau/Trésorier)
            reste réservée à l'Admin de chorale.
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => nom && email && onCreer({ nom, email, role })}>
            <Check size={14} /> Créer le compte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
