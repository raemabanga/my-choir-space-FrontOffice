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

export function DepenseFormModal({
  onClose,
  onValider,
}: {
  onClose: () => void
  onValider: (libelle: string, montant: string) => void
}) {
  const [libelle, setLibelle] = useState("")
  const [montant, setMontant] = useState("")

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer une dépense</DialogTitle>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label>Libellé</Label>
          <Input value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Ex. Location de chaises" />
        </div>
        <div className="grid gap-1.5">
          <Label>Montant (F)</Label>
          <Input value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="25000" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => libelle && montant && onValider(libelle, montant)}>
            <Check size={14} /> Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
