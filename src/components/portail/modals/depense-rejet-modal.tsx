import { useState } from "react"
import { Ban } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { fmt } from "@/lib/format"
import type { Depense } from "@/types/portail"

export function DepenseRejetModal({
  depense,
  onClose,
  onRejeter,
}: {
  depense: Depense
  onClose: () => void
  onRejeter: (id: string, motif: string) => void
}) {
  const [motif, setMotif] = useState("")
  const [erreur, setErreur] = useState("")

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeter la dépense</DialogTitle>
          <DialogDescription>
            « {depense.libelle} » — {fmt(depense.montant)}, saisie par {depense.saisiPar}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1.5">
          <Label htmlFor="motif-rejet">Motif du rejet</Label>
          <Textarea
            id="motif-rejet"
            autoFocus
            value={motif}
            onChange={(e) => {
              setMotif(e.target.value)
              setErreur("")
            }}
            placeholder="Ex. Justificatif manquant, montant supérieur au devis…"
            aria-invalid={erreur ? true : undefined}
          />
          {erreur && <p className="text-xs text-[var(--destructive)]" role="alert">{erreur}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button
            variant="destructive"
            onClick={() => (motif.trim() ? onRejeter(depense.id, motif.trim()) : setErreur("Le motif est obligatoire."))}
          >
            <Ban size={14} /> Rejeter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
