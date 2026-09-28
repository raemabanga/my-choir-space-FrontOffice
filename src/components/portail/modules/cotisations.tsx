import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOIS } from "@/data/portail-mock"
import { fmt } from "@/lib/format"
import type { Evenement, Statutaire } from "@/types/portail"

export function CotisationsModule({
  statutaire,
  evenements,
  onPaiement,
  canPaiement,
}: {
  statutaire: Statutaire
  evenements: Evenement[]
  onPaiement: (pre: { choriste?: string; eventId?: string; type?: string }) => void
  canPaiement: boolean
}) {
  return (
    <>
      <Tabs defaultValue="statutaire" className="mb-4.5">
        <TabsList>
          <TabsTrigger value="statutaire">Statutaire</TabsTrigger>
          <TabsTrigger value="evenementielle">Événementielle</TabsTrigger>
        </TabsList>

        <TabsContent value="statutaire" className="mt-4.5">
          <Card>
            <CardContent>
              <div className="mb-4 text-[12.5px] text-muted-foreground">
                Montant annuel {fmt(statutaire.montantAnnuel)} réparti en{" "}
                {fmt(statutaire.mensualite)}/mois — case cochée dès réception
                du paiement, comme sur la carte physique.
              </div>
              {Object.entries(statutaire.suivis).map(([nom, mois]) => (
                <div
                  key={nom}
                  className="flex items-center gap-3.5 border-t border-border py-2.5"
                >
                  <div className="w-32 shrink-0 text-[13px] font-medium text-foreground">
                    {nom}
                  </div>
                  <div className="flex gap-1.5">
                    {mois.map((paid, i) => (
                      <div
                        key={i}
                        title={MOIS[i]}
                        className={
                          "flex h-[26px] w-[26px] items-center justify-center rounded border font-mono text-[9.5px] " +
                          (paid
                            ? "border-gold bg-gold text-white"
                            : "border-border bg-muted text-muted-foreground")
                        }
                      >
                        {MOIS[i][0]}
                      </div>
                    ))}
                  </div>
                  {canPaiement && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPaiement({ choriste: nom, type: "statutaire" })}
                    >
                      <Plus size={14} /> Encaisser
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evenementielle" className="mt-4.5">
          <div className="grid gap-3">
            {evenements.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {e.titre}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {fmt(e.cotisation.montant)} / choriste ·{" "}
                      {fmt(e.cotisation.collecte)} collecté
                    </div>
                  </div>
                  {canPaiement && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onPaiement({ eventId: e.id, type: "evenementielle" })
                      }
                    >
                      <Plus size={14} /> Encaisser
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
