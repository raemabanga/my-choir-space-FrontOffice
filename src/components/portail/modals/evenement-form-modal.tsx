import { useState } from "react"
import { Check, Plus, X } from "lucide-react"
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

export function EvenementFormModal({
  types,
  onCreerType,
  onClose,
  onCreer,
}: {
  types: string[]
  onCreerType: (type: string) => void
  onClose: () => void
  onCreer: (form: { titre: string; date: string; type: string; budget: string; cotisation: string }) => void
}) {
  const [titre, setTitre] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState(types[0] ?? "")
  const [creationType, setCreationType] = useState(false)
  const [nouveauType, setNouveauType] = useState("")
  const [erreurType, setErreurType] = useState("")
  const [budget, setBudget] = useState("")
  const [cotisation, setCotisation] = useState("")

  const annulerCreationType = () => {
    setCreationType(false)
    setNouveauType("")
    setErreurType("")
  }

  const ajouterType = () => {
    const libelle = nouveauType.trim().toLowerCase()
    if (!libelle) {
      setErreurType("Saisissez le nom du type.")
      return
    }
    const existant = types.find((t) => t.toLowerCase() === libelle)
    if (!existant) onCreerType(libelle)
    setType(existant ?? libelle)
    annulerCreationType()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvel événement</DialogTitle>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label>Titre</Label>
          <Input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex. Concert de Pâques" />
        </div>
        <div className="grid gap-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={creationType ? "nouveau-type" : undefined}>Type</Label>
          {creationType ? (
            <div className="grid gap-1.5">
              <div className="flex gap-2">
                <Input
                  id="nouveau-type"
                  autoFocus
                  value={nouveauType}
                  onChange={(e) => {
                    setNouveauType(e.target.value)
                    setErreurType("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      ajouterType()
                    }
                  }}
                  placeholder="Ex. baptême"
                  aria-invalid={erreurType ? true : undefined}
                />
                <Button type="button" variant="secondary" className="h-11" onClick={ajouterType}>
                  <Check size={14} /> Ajouter
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-11"
                  aria-label="Annuler la création du type"
                  onClick={annulerCreationType}
                >
                  <X size={16} />
                </Button>
              </div>
              {erreurType && (
                <p className="text-xs text-[var(--destructive)]" role="alert">
                  {erreurType}
                </p>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Select value={type} onValueChange={(v) => setType(v as string)}>
                <SelectTrigger className="w-full min-w-0 flex-1 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                className="h-11 shrink-0"
                onClick={() => setCreationType(true)}
              >
                <Plus size={14} /> Nouveau type
              </Button>
            </div>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label>Budget prévisionnel (F)</Label>
          <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="150000" />
        </div>
        <div className="grid gap-1.5">
          <Label>Cotisation par choriste (F)</Label>
          <Input value={cotisation} onChange={(e) => setCotisation(e.target.value)} placeholder="5000" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => titre && onCreer({ titre, date, type, budget, cotisation })}>
            <Check size={14} /> Créer l'événement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
