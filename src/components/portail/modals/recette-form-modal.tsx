import { useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { MODE_REGLEMENT_LABEL, TYPE_RECETTE_LABEL } from "@/data/portail-mock"
import { cn } from "@/lib/utils"
import type { Evenement, ModeReglement, Recette, TypeRecette } from "@/types/portail"

export type RecetteForm = Pick<Recette, "date" | "type" | "libelle" | "montant" | "eventId" | "source" | "mode">

const SANS_EVENEMENT = "__general__"

const PLACEHOLDER: Record<TypeRecette, { libelle: string; source: string }> = {
  don: { libelle: "Ex. Don pour le concert", source: "Donateur (ou « Anonyme »)" },
  billetterie: { libelle: "Ex. Vente des billets à l'entrée", source: "Ex. Guichet, billetterie en ligne" },
  subvention: { libelle: "Ex. Subvention annuelle", source: "Organisme financeur" },
  autre: { libelle: "Ex. Vente de CD", source: "Origine de la recette" },
}

export function RecetteFormModal({
  evenements,
  eventIdInitial,
  onClose,
  onValider,
}: {
  evenements: Evenement[]
  eventIdInitial?: string
  onClose: () => void
  onValider: (form: RecetteForm) => void
}) {
  const [type, setType] = useState<TypeRecette>("don")
  const [libelle, setLibelle] = useState("")
  const [montant, setMontant] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [eventId, setEventId] = useState(eventIdInitial ?? SANS_EVENEMENT)
  const [source, setSource] = useState("")
  const [mode, setMode] = useState<ModeReglement>("especes")
  const [erreur, setErreur] = useState("")

  const evenementsItems = {
    [SANS_EVENEMENT]: "Aucun — recette générale",
    ...Object.fromEntries(evenements.map((e) => [e.id, e.titre])),
  }

  function enregistrer() {
    const m = Number(montant.replace(/\s/g, ""))
    if (!libelle.trim() || !m || m <= 0) {
      setErreur("Renseignez au moins un libellé et un montant valide.")
      return
    }
    onValider({
      type,
      libelle: libelle.trim(),
      montant: m,
      date,
      eventId: eventId === SANS_EVENEMENT ? undefined : eventId,
      source: source.trim() || (type === "don" ? "Anonyme" : "—"),
      mode,
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer une recette</DialogTitle>
          <DialogDescription>Dons, billetterie, subventions et autres entrées d'argent.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(TYPE_RECETTE_LABEL) as TypeRecette[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-[13px] font-medium text-[var(--ink-soft)] transition-colors hover:border-[var(--gold)]",
                type === t && "border-[var(--navy)] bg-[var(--navy)] text-white hover:border-[var(--navy)]"
              )}
            >
              {TYPE_RECETTE_LABEL[t]}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="rec-libelle">Libellé</Label>
            <Input id="rec-libelle" value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder={PLACEHOLDER[type].libelle} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rec-montant">Montant (F)</Label>
            <Input id="rec-montant" inputMode="numeric" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="10000" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rec-date">Date</Label>
            <Input id="rec-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rec-source">{type === "don" ? "Donateur" : "Provenance"}</Label>
            <Input id="rec-source" value={source} onChange={(e) => setSource(e.target.value)} placeholder={PLACEHOLDER[type].source} />
          </div>
          <div className="grid gap-1.5">
            <Label>Mode de règlement</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as ModeReglement)} items={MODE_REGLEMENT_LABEL}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(MODE_REGLEMENT_LABEL).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Événement</Label>
            <Select value={eventId} onValueChange={(v) => setEventId(v as string)} items={evenementsItems}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(evenementsItems).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {erreur && <p className="text-sm text-[var(--destructive)]" role="alert">{erreur}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={enregistrer}>
            <Check size={14} /> Enregistrer la recette
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
