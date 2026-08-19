import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SectionTitle, StaffLines } from "@/components/portail/common"
import type { Chant } from "@/types/portail"

export function ChantsModule({
  chants,
  peutGerer,
  onAjouter,
  onSupprimer,
}: {
  chants: Chant[]
  peutGerer: boolean
  onAjouter: () => void
  onSupprimer: (id: string) => void
}) {
  return (
    <>
      <div className="flex items-end justify-between">
        <SectionTitle subtitle={peutGerer ? "Ajout, modification et validation de suppression" : "Consultation du répertoire"}>
          Répertoire de chants
        </SectionTitle>
        {peutGerer && (
          <Button onClick={onAjouter}>
            <Plus size={14} /> Ajouter un chant
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {chants.map((c) => (
          <Card key={c.id}>
            <CardContent>
              <StaffLines opacity={0.25} />
              <div className="mt-1.5 flex justify-between">
                <div>
                  <div className="font-heading text-[15px] font-semibold text-foreground">
                    {c.titre}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {c.compositeur} · {c.tonalite} · {c.categorie}
                  </div>
                </div>
                {peutGerer && (
                  <button
                    onClick={() => onSupprimer(c.id)}
                    className="h-fit cursor-pointer text-muted-foreground hover:text-rust"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
