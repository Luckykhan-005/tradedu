// Liquidation Heatmap — estimated liquidation zones from Binance Futures
// public market data (CORS-enabled, no API key). Client-side computation.

export const HEATMAP_SYMBOLS = [
  { symbol: 'BTCUSDT', label: 'BTC' },
  { symbol: 'ETHUSDT', label: 'ETH' },
  { symbol: 'SOLUSDT', label: 'SOL' },
  { symbol: 'BNBUSDT', label: 'BNB' },
  { symbol: 'XRPUSDT', label: 'XRP' },
  { symbol: 'DOGEUSDT', label: 'DOGE' },
] as const

export interface HeatmapStats {
  markPrice: number
  funding: number // e.g. 0.01 = 1% per 8h? no: raw rate (0.0001 = 0.01%)
  openInterestUsd: number
  longShortRatio: number
}

export interface Cluster {
  price: number
  intensity: number
  side: 'above' | 'below'
}

export interface HeatmapData {
  symbol: string
  columns: number
  bins: number
  priceLow: number
  priceHigh: number
  matrix: number[][] // [column][bin] normalized 0..1
  times: number[] // column timestamps (ms)
  stats: HeatmapStats
  clusters: Cluster[]
  updatedAt: number
}

const COLUMNS = 168 // 7 days x 1h
const BINS = 140

// [leverage, relative weight] — retail ka zyada hissa 10x-25x par hota hai.
const LEVERAGES: Array<[number, number]> = [
  [3, 0.5],
  [5, 0.8],
  [10, 1.0],
  [25, 0.95],
  [50, 0.7],
  [100, 0.45],
]

const BASE = 'https://fapi.binance.com'

const num = (v: unknown): number => {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN
  return Number.isFinite(n) ? n : NaN
}

async function getJson(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchLiquidationData(symbol: string): Promise<HeatmapData> {
  const [klines, funding, oiHist, lsHist] = await Promise.all([
    getJson(`${BASE}/fapi/v1/klines?symbol=${symbol}&interval=1h&limit=${COLUMNS}`),
    getJson(`${BASE}/fapi/v1/premiumIndex?symbol=${symbol}`),
    getJson(`${BASE}/futures/data/openInterestHist?symbol=${symbol}&period=1h&limit=${COLUMNS}`),
    getJson(
      `${BASE}/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1h&limit=${COLUMNS}`
    ),
  ])

  const times: number[] = []
  const closes: number[] = []
  const highs: number[] = []
  const lows: number[] = []
  for (const k of klines as any[]) {
    times.push(num(k[0]))
    highs.push(num(k[2]))
    lows.push(num(k[3]))
    closes.push(num(k[4]))
  }

  const markPrice = num(funding.markPrice)
  const fundingRate = num(funding.lastFundingRate)

  const oiValues: number[] = (oiHist as any[]).map((o) => num(o.sumOpenInterestValue))
  const openInterestUsd = oiValues.length ? oiValues[oiValues.length - 1] : 0
  const longShortRatio = lsHist.length ? num((lsHist as any[])[lsHist.length - 1].longShortRatio) : 1

  const n = closes.length
  if (n < 24 || !Number.isFinite(markPrice) || markPrice <= 0) {
    throw new Error('INSUFFICIENT_DATA')
  }

  // Price range: weekly span + padding dono taraf (clusters weekly range ke bahar bhi).
  const hi = Math.max(...highs.filter(Number.isFinite))
  const lo = Math.min(...lows.filter(Number.isFinite))
  const span = Math.max(hi - lo, markPrice * 0.02)
  const priceLow = lo - span * 0.75
  const priceHigh = hi + span * 0.75

  const maxOi = Math.max(...oiValues.filter((v) => v > 0), 1)

  const matrix: number[][] = []
  for (let t = 0; t < n; t++) {
    const col = new Array<number>(BINS).fill(0)
    const p = closes[t]
    const oiW = oiValues[t] > 0 ? oiValues[t] / maxOi : 0.6

    for (const [lev, lw] of LEVERAGES) {
      // Longs: entry neeche liquidate hote hain (side -1), Shorts: oopar (+1).
      for (const side of [-1, 1]) {
        const liqPrice = p * (1 + side / lev)
        const bin = Math.floor(((liqPrice - priceLow) / (priceHigh - priceLow)) * BINS)
        if (bin >= 0 && bin < BINS) {
          // Thoda spread taake ek hi line na ho — gaussian jaisa.
          const amp = lw * oiW
          if (bin > 0) col[bin - 1] += amp * 0.35
          col[bin] += amp
          if (bin < BINS - 1) col[bin + 1] += amp * 0.35
        }
      }
    }
    matrix.push(col)
  }

  // Persistence: positions kal tak bhi rehte hain — pichli column se decay ke sath carry.
  const DECAY = 0.88
  for (let t = 1; t < matrix.length; t++) {
    const prev = matrix[t - 1]
    const cur = matrix[t]
    for (let b = 0; b < BINS; b++) {
      cur[b] += prev[b] * DECAY
    }
  }

  // Normalize 0..1
  let max = 0
  for (const col of matrix) for (const v of col) if (v > max) max = v
  if (max > 0) for (const col of matrix) for (let b = 0; b < BINS; b++) col[b] /= max

  // Clusters: recent columns ka aggregated intensity → strongest zones.
  const recent = 6
  const agg = new Array<number>(BINS).fill(0)
  for (let t = Math.max(0, n - recent); t < n; t++) {
    for (let b = 0; b < BINS; b++) agg[b] += matrix[t][b]
  }
  const binPrice = (b: number) => priceLow + ((b + 0.5) / BINS) * (priceHigh - priceLow)
  const candidates = agg
    .map((v, b) => ({ price: binPrice(b), intensity: v / recent, b }))
    .filter((c) => c.intensity > 0.12)

  const pickTop = (filter: (c: (typeof candidates)[0]) => boolean): Cluster[] =>
    candidates
      .filter(filter)
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 3)
      .map((c) => ({
        price: c.price,
        intensity: Math.min(1, c.intensity),
        side: c.price >= markPrice ? 'above' : ('below' as const),
      }))

  const clusters: Cluster[] = [
    ...pickTop((c) => c.price < markPrice),
    ...pickTop((c) => c.price >= markPrice),
  ]

  return {
    symbol,
    columns: matrix.length,
    bins: BINS,
    priceLow,
    priceHigh,
    matrix,
    times,
    stats: {
      markPrice,
      funding: fundingRate,
      openInterestUsd,
      longShortRatio,
    },
    clusters,
    updatedAt: Date.now(),
  }
}
