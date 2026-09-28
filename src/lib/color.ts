function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  )
}

/** Mixes `hex` toward white by `amount` (0-1). */
export function lightenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex([r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount])
}

/** Mixes `hex` toward black by `amount` (0-1). */
export function darkenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex([r * (1 - amount), g * (1 - amount), b * (1 - amount)])
}
