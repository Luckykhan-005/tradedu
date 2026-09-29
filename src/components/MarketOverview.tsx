import { useCallback, useEffect, useState } from 'react'
import { TrendingUp, RefreshCw, AlertCircle, Gauge, Globe, Bitcoin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

const REFRESH_MS = 60_000

interface MarketCoin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number | null
  price_change_percentage_7d_in_currency: number | null
}

interface GlobalData {
  totalMarketCap: number
  totalVolume: number
  btcDominance: number
  ethDominance: number
  marketCapChange24h: number
}

interface FngData {
  value: number
  classification: string
}

const fmtPrice = (p: number): string => {
  if (p >= 1000) return `$${p.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (p >= 1) return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return `$${p.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`
}

const fmtCompact = (v: number): string => {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
  return `$${Math.round(v).toLocaleString('en-US')}`
}

const fmtPct = (v: number | null | undefined): string => {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
}

const FNG_LABELS: Array<[number, string]> = [
  [25, 'Extreme Fear — Intehai Ghhabrahat'],
  [45, 'Fear — Ghhabrahat'],
  [55, 'Neutral — Bay Rangi'],
  [75, 'Greed — Lalach'],
  [101, 'Extreme Greed — Intehai Lalach'],
]

const fngLabelUrdu = (v: number): string => FNG_LABELS.find(([max]) => v < max)?.[1] ?? ''

const COIN_NAMES: Record<string, string> = {
  BTC: 'Bitcoin', ETH: 'Ethereum', BNB: 'BNB', SOL: 'Solana', XRP: 'XRP', DOGE: 'Dogecoin',
  ADA: 'Cardano', AVAX: 'Avalanche', LINK: 'Chainlink', TRX: 'TRON', DOT: 'Polkadot',
  TON: 'Toncoin', SHIB: 'Shiba Inu', LTC: 'Litecoin', BCH: 'Bitcoin Cash', NEAR: 'NEAR',
  APT: 'Aptos', ARB: 'Arbitrum', OP: 'Optimism', UNI: 'Uniswap', ATOM: 'Cosmos',
  FIL: 'Filecoin', ETC: 'Ethereum Classic', XLM: 'Stellar', HBAR: 'Hedera', ALGO: 'Algorand',
  AAVE: 'Aave', GRT: 'The Graph', INJ: 'Injective', SUI: 'Sui', SEI: 'Sei', ICP: 'Internet Computer',
  POL: 'Polygon', MKR: 'Maker', RUNE: 'THORChain', VET: 'VeChain', EIGEN: 'EigenLayer',
  PEPE: 'Pepe', WIF: 'dogwifhat', RENDER: 'Render', STX: 'Stacks', TIA: 'Celestia',
}

const STABLE_BASES = new Set(['USDC', 'USDT', 'FDUSD', 'TUSD', 'BUSD', 'DAI', 'USD1', 'USDE', 'PYUSD', 'USDD'])
const isLeverageToken = (base: string): boolean =>
  /(UP|DOWN|BULL|BEAR|3L|3S|5L|5S)$/.test(base)

// Binance fallback: CoinGecko block ho to top coins 24h volume se
async function fetchBinanceTop(): Promise<MarketCoin[]> {
  const res = await fetch('https://api.binance.com/api/v3/ticker/24hr')
  if (!res.ok) throw new Error(`binance ${res.status}`)
  const rows = (await res.json()) as Array<{ symbol: string; lastPrice: string; priceChangePercent: string; quoteVolume: string }>
  return rows
    .filter((r) => r.symbol.endsWith('USDT'))
    .map((r) => ({ base: r.symbol.slice(0, -4), ...r }))
    .filter(({ base }) => !STABLE_BASES.has(base) && !isLeverageToken(base) && base.length >= 2)
    .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
    .slice(0, 12)
    .map(({ base, symbol, lastPrice, priceChangePercent, quoteVolume }) => ({
      id: symbol,
      name: COIN_NAMES[base] ?? base,
      symbol: base,
      image: '',
      current_price: Number(lastPrice),
      market_cap: 0,
      total_volume: Number(quoteVolume),
      price_change_percentage_24h: Number(priceChangePercent),
      price_change_percentage_7d_in_currency: null,
    }))
}

export function MarketOverview() {
  const [coins, setCoins] = useState<MarketCoin[]>([])
  const [source, setSource] = useState('')
  const [global, setGlobal] = useState<GlobalData | null>(null)
  const [fng, setFng] = useState<FngData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updated, setUpdated] = useState<string>('')
  const [tick, setTick] = useState(0)

  const load = useCallback(async () => {
    try {
      const [coinsResult, globalRes, fngRes] = await Promise.allSettled([
        (async () => {
          try {
            const res = await fetch(
              'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&price_change_percentage=24h,7d'
            )
            if (res.ok) {
              const data = (await res.json()) as MarketCoin[]
              if (Array.isArray(data) && data.length > 0) return { coins: data, source: 'CoinGecko' }
            }
          } catch {
            // niche Binance fallback
          }
          return { coins: await fetchBinanceTop(), source: 'Binance' }
        })(),
        fetch('https://api.coingecko.com/api/v3/global'),
        fetch('https://api.alternative.me/fng/?limit=1'),
      ])

      if (coinsResult.status === 'fulfilled') {
        setCoins(coinsResult.value.coins)
        setSource(coinsResult.value.source)
      } else {
        setError('Coin data load nahi ho saka — CoinGecko aur Binance dono unavailable lag rahe hain. Thodi der baad Refresh karein.')
      }

      if (globalRes.status === 'fulfilled' && globalRes.value.ok) {
        const g = ((await globalRes.value.json()) as { data: Record<string, unknown> }).data
        const cap = g.total_market_cap as Record<string, number>
        const pct = g.market_cap_percentage as Record<string, number>
        setGlobal({
          totalMarketCap: cap.usd ?? 0,
          totalVolume: (g.total_volume as Record<string, number>).usd ?? 0,
          btcDominance: pct.btc ?? 0,
          ethDominance: pct.eth ?? 0,
          marketCapChange24h: (g.market_cap_change_percentage_24h_usd as number) ?? 0,
        })
      }

      if (fngRes.status === 'fulfilled' && fngRes.value.ok) {
        const d = ((await fngRes.value.json()) as { data: Array<{ value: string; value_classification: string }> }).data
        if (d?.[0]) setFng({ value: Number(d[0].value), classification: d[0].value_classification })
      }

      setError('')
      setUpdated(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      )
    } catch {
      setError('Market data load nahi ho saka — internet connection check karein ya thodi der baad retry karein.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load, tick])

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
              <p className="text-muted-foreground">
                Live crypto market — prices, dominance aur fear &amp; greed index
                {updated && <span className="ml-2 text-xs">· Updated {updated}</span>}
                {source && <span className="ml-1 text-xs">· {source}</span>}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setTick((t) => t + 1)} disabled={loading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {loading && coins.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-24 p-5" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Global stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" /> Total Market Cap
                  </div>
                  <div className="mt-1 text-2xl font-bold">{global ? fmtCompact(global.totalMarketCap) : '—'}</div>
                  {global && (
                    <div className={cn('text-sm', global.marketCapChange24h >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                      {fmtPct(global.marketCapChange24h)} 24h
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4" /> 24h Volume
                  </div>
                  <div className="mt-1 text-2xl font-bold">{global ? fmtCompact(global.totalVolume) : '—'}</div>
                  <div className="text-sm text-muted-foreground">Traded in last 24 hours</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bitcoin className="h-4 w-4" /> BTC Dominance
                  </div>
                  <div className="mt-1 text-2xl font-bold">{global ? `${global.btcDominance.toFixed(1)}%` : '—'}</div>
                  {global && <div className="text-sm text-muted-foreground">ETH: {global.ethDominance.toFixed(1)}%</div>}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gauge className="h-4 w-4" /> Fear &amp; Greed
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span
                      className={cn(
                        'text-2xl font-bold',
                        fng && fng.value < 45 ? 'text-red-500' : fng && fng.value > 55 ? 'text-emerald-600' : 'text-amber-500'
                      )}
                    >
                      {fng ? fng.value : '—'}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{fng ? fngLabelUrdu(fng.value) : 'Loading…'}</div>
                  {fng && (
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500">
                      <div className="relative h-full">
                        <div
                          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-background bg-foreground"
                          style={{ left: `calc(${fng.value}% - 6px)` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top coins table */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="text-lg font-semibold">
                    {source === 'Binance'
                      ? 'Top Coins — 24h Volume ke Hisab Se'
                      : 'Top 12 Cryptocurrencies — Live Prices'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {source === 'Binance'
                      ? 'Binance ke USDT pairs — stablecoins aur leverage tokens chhore hue'
                      : 'Market cap ke hisab se sab se baray coins'}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                        <th className="px-5 py-3">#</th>
                        <th className="px-3 py-3">Coin</th>
                        <th className="px-3 py-3 text-right">Price</th>
                        <th className="px-3 py-3 text-right">24h</th>
                        <th className="hidden px-3 py-3 text-right sm:table-cell">7d</th>
                        <th className="hidden px-3 py-3 text-right md:table-cell">Market Cap</th>
                        <th className="hidden px-5 py-3 text-right lg:table-cell">24h Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coins.map((c, i) => (
                        <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                          <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              {c.image && <img src={c.image} alt={c.name} className="h-6 w-6 rounded-full" loading="lazy" />}
                              <span className="font-medium">{c.name}</span>
                              <span className="text-xs uppercase text-muted-foreground">{c.symbol}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right font-medium">{fmtPrice(c.current_price)}</td>
                          <td
                            className={cn(
                              'px-3 py-3 text-right font-medium',
                              (c.price_change_percentage_24h ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'
                            )}
                          >
                            {fmtPct(c.price_change_percentage_24h)}
                          </td>
                          <td
                            className={cn(
                              'hidden px-3 py-3 text-right font-medium sm:table-cell',
                              c.price_change_percentage_7d_in_currency === null
                                ? 'text-muted-foreground'
                                : c.price_change_percentage_7d_in_currency >= 0
                                  ? 'text-emerald-600'
                                  : 'text-red-500'
                            )}
                          >
                            {fmtPct(c.price_change_percentage_7d_in_currency)}
                          </td>
                          <td className="hidden px-3 py-3 text-right md:table-cell">
                            {c.market_cap > 0 ? fmtCompact(c.market_cap) : '—'}
                          </td>
                          <td className="hidden px-5 py-3 text-right lg:table-cell">{fmtCompact(c.total_volume)}</td>
                        </tr>
                      ))}
                      {coins.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                            Data load nahi ho saka — Refresh button dabayein.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Educational content */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <h2 className="mb-2 text-lg font-semibold">Market Overview Kya Batata Hai?</h2>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Market overview ek jagah se poore crypto market ka haal dekhne ka tareeqa hai — kitni bari
                    qeemat hai, kitna paisa chal raha hai, aur log dar rahe hain ya lalach kar rahe hain.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li><strong>Total Market Cap:</strong> poori crypto market ki qeemat — market ki sehat</li>
                    <li><strong>Dominance:</strong> Bitcoin ka market par pakar — zyada dominance = altcoins kamzor</li>
                    <li><strong>Fear &amp; Greed:</strong> log ka jazba — extreme fear aksar khareedne, extreme greed bechne ka paitra</li>
                    <li><strong>24h Volume:</strong> kitna paisa chal raha — kam volume = kamzor harkat</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h2 className="mb-2 text-lg font-semibold">Isay Trading Mein Kaise Istemal Karein?</h2>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Yeh page sirf maloomat hai — signal nahi. Lekin overall market parh kar aap apna risk
                    behtar set kar sakte hain:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>Extreme Greed mein naya buying FOMO se bachein — qeemat pehle se barhi hoti hai</li>
                    <li>Extreme Fear mein quality coins sab se sasta milte hain — lekin girawat jaari bhi ho sakti hai</li>
                    <li>Dominance barh raha hai to altcoins ka relative pressure barhta hai</li>
                    <li>Hamesha apni research karein — <a className="text-primary underline" href="/glossary/dyor/">DYOR</a></li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Data: CoinGecko aur Alternative.me se live — har 60 second mein refresh hota hai.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          Educational purposes ke liye — investment advice nahi. Trading mein risk hota hai, apni research zaroor karein.{' '}
          <a href="/disclaimer" className="underline">
            Risk disclaimer
          </a>
        </p>
      </div>
    </div>
  )
}
