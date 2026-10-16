import { ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MiniStat } from "@/components/portail/common"
import { STATUT_DEPENSE } from "@/components/portail/budget/budget-shared"
import { fmt } from "@/lib/format"
import { bilanEvenement } from "@/lib/finances"
import type { Depense, Evenement, Recette } from "@/types/portail"

export function EvenementsModule({
  evenements,
  depenses,
  recettes,
  onVoir,
  onSupprimer,
  onDepense,
}: {
  evenements: Evenement[]
  depenses: Depense[]
  recettes: Recette[]
  onVoir: (id: string) => void
  onSupprimer: (id: string) => void
  onDepense: (evId: string) => void
}) {
  return (
    <>
      <div className="grid gap-3.5">
        {evenements.map((e) => {
          const bilan = bilanEvenement(e, depenses, recettes)
          return (
            <Card key={e.id}>
              <CardContent>
                <div className="flex flex-wrap justify-between gap-2">
                  <button type="button" onClick={() => onVoir(e.id)} className="group text-left">
                    <div className="font-heading text-[17px] font-semibold text-foreground group-hover:underline">
                      {e.titre}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {e.date} · {e.type}
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onSupprimer(e.id)}>
                      <Trash2 size={14} /> Supprimer
                    </Button>
                    <Button size="sm" onClick={() => onVoir(e.id)}>
                      Voir le détail <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-6">
                  <MiniStat label="Cotisation / choriste" value={fmt(e.cotisation.montant)} />
                  <MiniStat label="Recettes" value={fmt(bilan.recettesTotal)} className="text-teal" />
                  <MiniStat label="Dépenses validées" value={fmt(bilan.validees)} className="text-rust" />
                  <MiniStat label="En attente" value={fmt(bilan.enAttente)} className="text-amber" />
                  <MiniStat label="Solde" value={fmt(bilan.solde)} className={bilan.solde < 0 ? "text-rust" : "text-teal"} />
                </div>

                {bilan.depenses.length > 0 && (
                  <div className="mt-3.5">
                    {bilan.depenses.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between border-t border-border py-1.5 text-[12.5px]"
                      >
                        <span className={d.statut === "rejetee" ? "text-muted-foreground line-through" : "text-muted-foreground"}>
                          {d.libelle} — {fmt(d.montant)}
                        </span>
                        <Badge variant={STATUT_DEPENSE[d.statut].variant}>{STATUT_DEPENSE[d.statut].label}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => onDepense(e.id)}>
                    <Plus size={14} /> Enregistrer une dépense
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
