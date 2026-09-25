import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CoinPrice {
  id: string
  symbol: string
  name: string
  price: number
  change: number
}

const COIN_IDS = 'bitcoin,ethereum,binancecoin,solana,ripple,dogecoin'
const FALLBACK: CoinPrice[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 0, change: 0 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 0, change: 0 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 0, change: 0 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 0, change: 0 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0, change: 0 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0, change: 0 },
]

const symbolMap: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  binancecoin: 'BNB',
  solana: 'SOL',
  ripple: 'XRP',
  dogecoin: 'DOGE',
}

const formatPrice = (n: number) => {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

export function CryptoTicker() {
  const [coins, setCoins] = useState<CoinPrice[]>([])
  const [status, setStatus] = useState<'loading' | 'live' | 'hidden'>('loading')

  useEffect(() => {
    let cancelled = false

    const fetchPrices = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Record<string, { usd?: number; usd_24h_change?: number }> = await res.json()
        if (cancelled) return
        const list: CoinPrice[] = FALLBACK.map((c) => ({
          ...c,
          symbol: symbolMap[c.id] || c.symbol,
          price: data[c.id]?.usd ?? 0,
          change: data[c.id]?.usd_24h_change ?? 0,
        })).filter((c) => c.price > 0)
        if (list.length === 0) throw new Error('empty prices')
        setCoins(list)
        setStatus('live')
      } catch {
        // First load failure: show nothing (ticker is optional enhancement).
        // Already showing: keep last good prices.
        if (!cancelled) setStatus((prev) => (prev === 'live' ? 'live' : 'hidden'))
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  if (status !== 'live') return null

  const items = [...coins, ...coins]

  return (
    <div className="border-b border-border bg-card/60 backdrop-blur-sm" aria-label="Live crypto prices">
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-[ticker_40s_linear_infinite] gap-8 py-2 whitespace-nowrap hover:[animation-play-state:paused]">
          {items.map((coin, i) => (
            <span key={`${coin.id}-${i}`} className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">{coin.symbol}</span>
              <span className="tabular-nums text-muted-foreground">${formatPrice(coin.price)}</span>
              <span
                className={`flex items-center gap-0.5 tabular-nums text-xs font-medium ${
                  coin.change >= 0 ? 'text-accent' : 'text-destructive'
                }`}
              >
                {coin.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(coin.change).toFixed(2)}%
              </span>
              <span className="ml-2 text-border">|</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  )
}
