import { Ban, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Compte } from "@/types/portail"

export function DesactiverCompteModal({
  compte,
  onClose,
  onConfirmer,
}: {
  compte: Compte
  onClose: () => void
  onConfirmer: (id: string) => void
}) {
  const desactivation = compte.statut === "actif"

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {desactivation ? "Désactiver" : "Réactiver"} le compte — {compte.nom}
          </DialogTitle>
        </DialogHeader>

        <p className="text-[12.5px] text-muted-foreground">
          {desactivation
            ? "Le compte perdra l'accès au portail jusqu'à sa réactivation. Ses rôles et son historique sont conservés."
            : "Le compte retrouvera l'accès au portail avec ses rôles actuels."}
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant={desactivation ? "destructive" : "default"}
            onClick={() => onConfirmer(compte.id)}
          >
            {desactivation ? <Ban size={14} /> : <RotateCcw size={14} />}
            {desactivation ? "Désactiver" : "Réactiver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
