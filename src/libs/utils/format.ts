export function formatFloat(f: number, fraction = 3, percent = false) {
  if (percent)
    return `${(f * 100).toFixed(fraction)}%`
  return f.toFixed(fraction)
}
