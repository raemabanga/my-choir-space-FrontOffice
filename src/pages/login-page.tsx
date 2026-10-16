import * as React from "react"
import { Eye, EyeOff, LockKeyhole, Music2, Phone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEMO_ACCOUNTS, DEMO_LOGIN_PASSWORD, ROLE_LABEL } from "@/data/portail-mock"
import { useAppSettings } from "@/store/app-settings"
import type { DemoAccount } from "@/types/portail"

function normalizePhone(value: string) {
  return value.replace(/\s+/g, "")
}

export function LoginPage({ onLogin }: { onLogin: (accountId: string) => void }) {
  const [telephone, setTelephone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const appName = useAppSettings((s) => s.appName)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!telephone.trim() || !password.trim()) {
      setError("Veuillez renseigner votre téléphone et votre mot de passe.")
      return
    }
    const account = DEMO_ACCOUNTS.find(
      (a) => normalizePhone(a.telephone) === normalizePhone(telephone)
    )
    if (!account || password !== DEMO_LOGIN_PASSWORD) {
      setError("Identifiants incorrects. Utilisez un compte de démonstration ci-dessous.")
      return
    }
    setError("")
    onLogin(account.id)
  }

  function quickLogin(account: DemoAccount) {
    setError("")
    onLogin(account.id)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4 py-8">
      <div className="flex w-full max-w-md justify-center">
        <Card className="relative w-full border-[var(--line)] bg-white shadow-[0_12px_36px_rgba(15,23,42,0.08)]">
          <CardHeader className="justify-items-center px-7 pt-8 text-center sm:px-10 sm:pt-10">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[var(--navy)] text-[var(--gold-soft)]">
              <Music2 size={27} />
            </div>
            <CardTitle className="text-3xl tracking-[-0.04em]">Bienvenue</CardTitle>
            <CardDescription className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--ink-soft)]">
              Connectez-vous à votre espace chorale.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-7 pb-8 sm:px-10 sm:pb-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ink-light)]" />
                  <Input
                    id="telephone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="07 01 02 03 04"
                    value={telephone}
                    onChange={(event) => setTelephone(event.target.value)}
                    className="h-11 bg-white/80 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Mot de passe</Label>
                  <button type="button" className="text-xs font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ink-light)]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 bg-white/80 px-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--ink-light)] transition-colors hover:text-[var(--ink)]"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-[var(--destructive)]" role="alert">{error}</p>}

              <Button type="submit" size="lg" className="h-11 w-full text-sm">
                Se connecter
              </Button>
            </form>

            <div className="mt-7 border-t border-[var(--line)] pt-5">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-soft)] uppercase">
                  Comptes de démonstration
                </span>
                <span className="text-[11px] text-[var(--ink-light)]">
                  Mot de passe : {DEMO_LOGIN_PASSWORD}
                </span>
              </div>
              <div className="grid gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => quickLogin(account)}
                    className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white px-3.5 py-2.5 text-left transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]/35"
                  >
                    <span>
                      <span className="block text-[13px] font-medium text-[var(--ink)]">
                        {account.nom}
                      </span>
                      <span className="block text-[11px] text-[var(--ink-light)]">
                        {account.telephone}
                      </span>
                    </span>
                    <Badge variant="outline">{ROLE_LABEL[account.roles[0]]}</Badge>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-7 text-center text-[11px] text-[var(--ink-light)]">{appName} · Espace chorale</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
