import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionTitle, MonoLabel } from "@/components/portail/common"
import { fmt } from "@/lib/format"
import type { Evenement } from "@/types/portail"

export function BudgetModule({ evenements }: { evenements: Evenement[] }) {
  const totalCollecte = evenements.reduce((s, e) => s + e.cotisation.collecte, 0)
  const totalDepense = evenements.reduce(
    (s, e) => s + e.depenses.filter((d) => d.valide).reduce((a, d) => a + d.montant, 0),
    0
  )

  return (
    <>
      <SectionTitle subtitle="Vue consolidée des recettes et dépenses de l'association">
        Budget
      </SectionTitle>
      <div className="mb-5.5 grid grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <MonoLabel>Recettes totales</MonoLabel>
            <div className="font-heading text-[26px] text-teal">{fmt(totalCollecte)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <MonoLabel>Dépenses validées</MonoLabel>
            <div className="font-heading text-[26px] text-rust">{fmt(totalDepense)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <MonoLabel>Solde global</MonoLabel>
            <div className="font-heading text-[26px] text-gold">
              {fmt(totalCollecte - totalDepense)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              {["Événement", "Recettes", "Dépenses", "Solde"].map((h) => (
                <TableHead key={h} className="font-mono text-[10.5px] text-muted-foreground uppercase">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {evenements.map((e) => {
              const d = e.depenses.filter((x) => x.valide).reduce((a, x) => a + x.montant, 0)
              return (
                <TableRow key={e.id}>
                  <TableCell className="text-[13px] text-foreground">{e.titre}</TableCell>
                  <TableCell className="text-[13px] text-teal">{fmt(e.cotisation.collecte)}</TableCell>
                  <TableCell className="text-[13px] text-rust">{fmt(d)}</TableCell>
                  <TableCell className="text-[13px] font-semibold text-foreground">
                    {fmt(e.cotisation.collecte - d)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
