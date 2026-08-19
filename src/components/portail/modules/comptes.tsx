import { Ban, History, RotateCcw, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionTitle } from "@/components/portail/common"
import { ROLE_COLOR_CLASS, ROLE_LABEL } from "@/data/portail-mock"
import type { Compte, Role } from "@/types/portail"

const COMMISSION_LABEL: Partial<Record<Role, string>> = {
  commission_recette: "Commission recette",
  commission_musicale: "Commission musicale",
}

export function ComptesModule({
  comptes,
  full,
  onCreer,
  onToggle,
  onRevoquer,
}: {
  comptes: Compte[]
  full: boolean
  onCreer: () => void
  onToggle: (id: string) => void
  onRevoquer: (id: string, role: Role) => void
}) {
  return (
    <>
      <div className="flex items-end justify-between">
        <SectionTitle
          subtitle={
            full
              ? "Création, désactivation et attribution des rôles"
              : "Création et désactivation des comptes choriste et commissions"
          }
        >
          Comptes & Rôles
        </SectionTitle>
        <Button onClick={onCreer}>
          <UserPlus size={14} /> Créer un compte
        </Button>
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="font-mono text-[10.5px] text-muted-foreground uppercase">
                Nom
              </TableHead>
              <TableHead className="font-mono text-[10.5px] text-muted-foreground uppercase">
                Rôles
              </TableHead>
              <TableHead className="font-mono text-[10.5px] text-muted-foreground uppercase">
                Statut
              </TableHead>
              <TableHead className="font-mono text-[10.5px] text-muted-foreground uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comptes.map((c) => {
              const peutGererSoiMeme =
                c.roles.includes("choriste") &&
                c.roles.length <= 2 &&
                !c.roles.some((r) =>
                  ["admin_chorale", "bureau", "tresorier"].includes(r)
                )
              return (
                <TableRow key={c.id}>
                  <TableCell className="whitespace-normal py-3">
                    <div className="text-[13px] font-medium text-foreground">
                      {c.nom}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground">
                      {c.email}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="flex flex-wrap gap-1.5">
                      {c.roles.map((r) => (
                        <Badge
                          key={r}
                          variant="outline"
                          className={ROLE_COLOR_CLASS[r]}
                        >
                          {COMMISSION_LABEL[r] ?? ROLE_LABEL[r]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        c.statut === "actif"
                          ? "text-teal border-teal/30 bg-teal-soft"
                          : "text-rust border-rust/30 bg-rust-soft"
                      }
                    >
                      {c.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {full ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onToggle(c.id)}
                        >
                          {c.statut === "actif" ? (
                            <Ban size={14} />
                          ) : (
                            <RotateCcw size={14} />
                          )}
                          {c.statut === "actif" ? "Désactiver" : "Réactiver"}
                        </Button>
                        {c.roles.some((r) => r !== "choriste") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onRevoquer(
                                c.id,
                                c.roles.find((r) => r !== "choriste")!
                              )
                            }
                          >
                            <History size={14} /> Révoquer rôle
                          </Button>
                        )}
                      </div>
                    ) : peutGererSoiMeme ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggle(c.id)}
                      >
                        {c.statut === "actif" ? (
                          <Ban size={14} />
                        ) : (
                          <RotateCcw size={14} />
                        )}
                        {c.statut === "actif" ? "Désactiver" : "Réactiver"}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
