import { useId } from "react"
import { FileText, Paperclip, X } from "lucide-react"

import { tailleFichier } from "@/lib/finances"
import type { Justificatif } from "@/types/portail"

/** Sélection d'un justificatif (facture, reçu, devis…) — conservé pour la session. */
export function JustificatifInput({
  value,
  onChange,
}: {
  value?: Justificatif
  onChange: (j: Justificatif | undefined) => void
}) {
  const id = useId()

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white px-3.5 py-2.5">
        <FileText className="size-4 shrink-0 text-[var(--ink-light)]" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium text-[var(--ink)]">{value.nom}</div>
          <div className="text-[11px] text-[var(--ink-light)]">{tailleFichier(value.taille)}</div>
        </div>
        <button
          type="button"
          aria-label="Retirer le justificatif"
          onClick={() => {
            if (value.url) URL.revokeObjectURL(value.url)
            onChange(undefined)
          }}
          className="inline-flex size-7 items-center justify-center rounded-lg text-[var(--ink-light)] hover:bg-[var(--muted)] hover:text-[var(--ink)]"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--muted)]/50 px-3.5 py-3 text-[13px] text-[var(--ink-soft)] transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]/30"
    >
      <Paperclip className="size-4 shrink-0" />
      <span>
        Joindre une facture, un reçu ou un devis
        <span className="block text-[11px] text-[var(--ink-light)]">PDF ou image</span>
      </span>
      <input
        id={id}
        type="file"
        accept="application/pdf,image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          onChange({ nom: file.name, type: file.type, taille: file.size, url: URL.createObjectURL(file) })
        }}
      />
    </label>
  )
}
