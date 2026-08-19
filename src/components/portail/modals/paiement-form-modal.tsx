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
import { CHORISTES, MOIS } from "@/data/portail-mock"
import type { Evenement } from "@/types/portail"

export function PaiementFormModal({
  onClose,
  onValider,
  evenements,
  pre,
}: {
  onClose: () => void
  onValider: (form: {
    choriste: string
    montant: string
    mois?: number
    eventId?: string
    type: string
  }) => void
  evenements: Evenement[]
  pre: { choriste?: string; type?: string; eventId?: string }
}) {
  const [choriste, setChoriste] = useState(pre.choriste || CHORISTES[0])
  const [mode, setMode] = useState<"statutaire" | "evenementielle">(
    pre.eventId ? "evenementielle" : (pre.type as "statutaire" | "evenementielle") || "statutaire"
  )
  const [mois, setMois] = useState(0)
  const [eventId, setEventId] = useState(pre.eventId || evenements[0]?.id)
  const [montant, setMontant] = useState(
    mode === "statutaire" ? "1000" : String(evenements[0]?.cotisation.montant || "")
  )

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label>Choriste</Label>
          <Select value={choriste} onValueChange={(v) => setChoriste(v as string)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHORISTES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label>Type de cotisation</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as "statutaire" | "evenementielle")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="statutaire">Statutaire</SelectItem>
              <SelectItem value="evenementielle">Événementielle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === "statutaire" ? (
          <div className="grid gap-1.5">
            <Label>Mois concerné</Label>
            <Select value={String(mois)} onValueChange={(v) => setMois(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOIS.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="grid gap-1.5">
            <Label>Événement</Label>
            <Select
              value={eventId}
              onValueChange={(v) => {
                setEventId(v as string)
                const ev = evenements.find((x) => x.id === v)
                setMontant(String(ev?.cotisation.montant || ""))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {evenements.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.titre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid gap-1.5">
          <Label>Montant (F)</Label>
          <Input value={montant} onChange={(e) => setMontant(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={() =>
              onValider(
                mode === "statutaire"
                  ? { choriste, montant, mois, type: `Statutaire — mois de ${MOIS[mois]}` }
                  : {
                      choriste,
                      montant,
                      eventId,
                      type: `Événementielle — ${evenements.find((e) => e.id === eventId)?.titre}`,
                    }
              )
            }
          >
            <Check size={14} /> Enregistrer et générer le reçu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
