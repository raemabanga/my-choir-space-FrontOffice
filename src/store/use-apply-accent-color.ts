import { useEffect } from "react"

import { darkenHex, lightenHex } from "@/lib/color"
import { useAppSettings } from "@/store/app-settings"

/** Pushes the configurable accent color onto :root so every component reading
 *  the shared --gold* CSS variables (buttons, badges, progress bars, sidebar…)
 *  re-themes together. */
export function useApplyAccentColor() {
  const accentColor = useAppSettings((s) => s.accentColor)

  useEffect(() => {
    const root = document.documentElement.style
    root.setProperty("--gold", accentColor)
    root.setProperty("--gold-strong", darkenHex(accentColor, 0.14))
    root.setProperty("--gold-soft", lightenHex(accentColor, 0.82))
    root.setProperty("--gold-soft-strong", lightenHex(accentColor, 0.68))
  }, [accentColor])
}
