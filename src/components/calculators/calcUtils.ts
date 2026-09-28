export const n = (v: string) => parseFloat(v) || 0
export const fmt = (v: number, d = 2) =>
  d === 0 ? Math.round(v).toString() : v.toFixed(d)
