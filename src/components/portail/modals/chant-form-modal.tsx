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

const CATEGORIES = ["Louange", "Adoration", "Fête", "Deuil"]

export function ChantFormModal({
  onClose,
  onAjouter,
}: {
  onClose: () => void
  onAjouter: (form: { titre: string; compositeur: string; tonalite: string; categorie: string }) => void
}) {
  const [titre, setTitre] = useState("")
  const [compositeur, setCompositeur] = useState("")
  const [tonalite, setTonalite] = useState("")
  const [categorie, setCategorie] = useState("Louange")

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un chant</DialogTitle>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label>Titre</Label>
          <Input value={titre} onChange={(e) => setTitre(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Compositeur / auteur</Label>
          <Input value={compositeur} onChange={(e) => setCompositeur(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Tonalité</Label>
          <Input value={tonalite} onChange={(e) => setTonalite(e.target.value)} placeholder="Ex. Sol majeur" />
        </div>
        <div className="grid gap-1.5">
          <Label>Catégorie</Label>
          <Select value={categorie} onValueChange={(v) => setCategorie(v as string)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => titre && onAjouter({ titre, compositeur, tonalite, categorie })}>
            <Check size={14} /> Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
