import { useState } from 'react'
import { BookMarked, Search, ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'

interface Term {
  term: string
  definition: string
  urdu: string
  category: 'basic' | 'technical' | 'psychology' | 'advanced'
}

const categories: Record<Term['category'], string> = {
  basic: 'Basic Terms',
  technical: 'Technical Analysis',
  psychology: 'Trading Psychology',
  advanced: 'Advanced Concepts',
}

const terms: Term[] = [
  // ===== Basic =====
  { term: 'ATH', definition: 'All-Time High — the highest price an asset has ever reached.', urdu: 'آل ٹائم ہائی — کسی اثاثے کی اب تک کی سب سے زیادہ قیمت۔', category: 'basic' },
  { term: 'ATL', definition: 'All-Time Low — the lowest price an asset has ever reached.', urdu: 'آل ٹائم لو — کسی اثاثے کی اب تک کی سب سے کم قیمت۔', category: 'basic' },
  { term: 'Altcoin', definition: 'Any cryptocurrency other than Bitcoin (ETH, SOL, BNB, etc.).', urdu: 'الٹ کوائن — بٹ کوائن کے علاوہ کوئی بھی کریپٹو کرنسی (ایتھریم، سولانا، بی این بی وغیرہ)۔', category: 'basic' },
  { term: 'Stablecoin', definition: 'A coin pegged to a stable asset like the US dollar (USDT, USDC).', urdu: 'سٹیبل کوائن — وہ کوائن جو مستحکم اثاثے جیسے ڈالر سے جڑا ہو (یو ایس ڈی ٹی، یو ایس ڈی سی)۔', category: 'basic' },
  { term: 'HODL', definition: 'Hold On for Dear Life — holding coins long-term instead of selling.', urdu: 'ہوڈل — کوائنز کو لمبی مدت تک رکھنا، بیچنا نہیں۔', category: 'basic' },
  { term: 'DYOR', definition: 'Do Your Own Research — always research before investing.', urdu: 'ڈی وائی او آر — اپنی تحقیق خود کریں، سرمایہ کاری سے پہلے ہمیشہ تحقیق کریں۔', category: 'basic' },
  { term: 'Market Cap', definition: 'Total value of an asset = price × circulating supply.', urdu: 'مارکیٹ کیپ — کسی اثاثے کی کل قیمت = قیمت ضرب گردش میں موجود سپلائی۔', category: 'basic' },
  { term: 'Liquidity', definition: 'How easily an asset can be bought or sold without moving its price.', urdu: 'لیکویڈیٹی — کسی اثاثے کو قیمت بدلے بغیر کتنی آسانی سے خریدا یا بیچا جا سکتا ہے۔', category: 'basic' },
  { term: 'Wallet', definition: 'Software or hardware that stores your cryptocurrency keys.', urdu: 'والیٹ — وہ سافٹ ویئر یا ہارڈ ویئر جو آپ کی کریپٹو چابیاں محفوظ رکھتا ہے۔', category: 'basic' },
  { term: 'Exchange', definition: 'A platform where you buy, sell, and trade cryptocurrencies.', urdu: 'ایکسچینج — وہ پلیٹ فارم جہاں آپ کریپٹو خریدتے، بیچتے اور تجارت کرتے ہیں۔', category: 'basic' },
  { term: 'Bid / Ask', definition: 'Bid is the highest price a buyer will pay; Ask is the lowest price a seller will accept.', urdu: 'بولی/مانگ — بولی وہ سب سے زیادہ قیمت ہے جو خریدار دے سکتا ہے؛ مانگ وہ سب سے کم قیمت ہے جو بیچنے والا لے سکتا ہے۔', category: 'basic' },
  { term: 'Spread', definition: 'The difference between the Ask and Bid price.', urdu: 'اسپریڈ — مانگ اور بولی کی قیمت کے درمیان فرق۔', category: 'basic' },
  { term: 'Market Order', definition: 'An order executed immediately at the current market price.', urdu: 'مارکیٹ آرڈر — وہ آرڈر جو فوراً موجودہ مارکیٹ قیمت پر عمل میں آتا ہے۔', category: 'basic' },
  { term: 'Limit Order', definition: 'An order executed only at a specified price or better.', urdu: 'لمٹ آرڈر — وہ آرڈر جو صرف مخصوص قیمت پر یا اس سے بہتر پر عمل میں آتا ہے۔', category: 'basic' },
  { term: 'Stop-Loss (SL)', definition: 'An order to sell automatically when price reaches a level, to limit losses.', urdu: 'اسٹاپ لاس — وہ آرڈر جو قیمت ایک سطح تک پہنچنے پر خود بخود بیچ دے، نقصان محدود کرنے کے لیے۔', category: 'basic' },
  { term: 'Take-Profit (TP)', definition: 'An order to close a trade at a predetermined profit level.', urdu: 'ٹیک پرافٹ — وہ آرڈر جو تجارت کو مقررہ منافع کی سطح پر بند کر دے۔', category: 'basic' },
  { term: 'P2P', definition: 'Peer-to-Peer — buying crypto directly from another person.', urdu: 'پی ٹو پی — پیئر ٹو پیئر — کسی دوسرے شخص سے براہ راست کریپٹو خریدنا۔', category: 'basic' },
  { term: 'KYC', definition: 'Know Your Customer — identity verification required by exchanges.', urdu: 'کے وائی سی — نول یور کسٹمر — ایکسچینجز کے لیے شناخت کی تصدیق۔', category: 'basic' },
  { term: 'Fiat', definition: 'Government-issued currency like USD, PKR, EUR.', urdu: 'فیاٹ — حکومت جاری کردہ کرنسی جیسے ڈالر، پاکستانی روپیہ، یورو۔', category: 'basic' },
  { term: 'Volatility', definition: 'The degree of variation in price over time.', urdu: 'اتار چڑھاؤ — وقت کے ساتھ قیمت میں تبدیلی کی شرح۔', category: 'basic' },

  // ===== Technical =====
  { term: 'Support', definition: 'A price level where buying pressure stops a decline.', urdu: 'سپورٹ — وہ قیمت کی سطح جہاں خریداری کا دباؤ قیمت کو گرنے سے روکتا ہے۔', category: 'technical' },
  { term: 'Resistance', definition: 'A price level where selling pressure stops an advance.', urdu: 'ریزسٹنس — وہ قیمت کی سطح جہاں بیچنے کا دباؤ قیمت کو اوپر جانے سے روکتا ہے۔', category: 'technical' },
  { term: 'Candlestick', definition: 'A chart showing open, high, low, and close for a time period.', urdu: 'کینڈل سٹک — چارٹ جو ایک مدت کی کھلنے، اونچی، نیچی اور بند ہونے کی قیمت دکھاتا ہے۔', category: 'technical' },
  { term: 'RSI', definition: 'Relative Strength Index — momentum indicator (0-100). Overbought above 70, oversold below 30.', urdu: 'آر ایس آئی — ریلیٹو سٹرینتھ انڈیکس — رفتار کا انڈیکیٹر (0-100)۔ ستر سے اوپر مہنگی، تیس سے نیچے سستی۔', category: 'technical' },
  { term: 'MACD', definition: 'Moving Average Convergence Divergence — trend and momentum indicator.', urdu: 'ایم اے سی ڈی — رجحان اور رفتار کا انڈیکیٹر۔', category: 'technical' },
  { term: 'Moving Average', definition: 'Average price over a period — smooths out price noise (SMA, EMA).', urdu: 'موونگ ایوریج — ایک مدت کی اوسط قیمت — قیمت کے شور کو ہموار کرتی ہے (ایس ایم اے، ای ایم اے)۔', category: 'technical' },
  { term: 'Bollinger Bands', definition: 'Volatility bands around a moving average — expand and contract with volatility.', urdu: 'بولنگر بینڈز — موونگ ایوریج کے گرد اتار چڑھاؤ کی لکیریں — اتار چڑھاؤ کے ساتھ پھیلتی اور سکڑتی ہیں۔', category: 'technical' },
  { term: 'Fibonacci', definition: 'Retracement levels (38.2%, 50%, 61.8%) used to find pullback zones.', urdu: 'فبوناچی — واپسی کی سطحیں (38.2%، 50%، 61.8%) جو پل بیک کے علاقے تلاش کرنے کے لیے استعمال ہوتی ہیں۔', category: 'technical' },
  { term: 'Volume', definition: 'The amount of an asset traded in a given period — confirms moves.', urdu: 'حجم — ایک مدت میں تجارت ہونے والے اثاثے کی مقدار — حرکت کی تصدیق کرتا ہے۔', category: 'technical' },
  { term: 'Trendline', definition: 'A line connecting swing points to show market direction.', urdu: 'ٹرینڈ لائن — اونچائی/نیچائی کے نکات کو جوڑنے والی لکیر جو مارکیٹ کی سمت دکھاتی ہے۔', category: 'technical' },
  { term: 'Breakout', definition: 'Price moving beyond a support/resistance level or pattern boundary.', urdu: 'بریک آؤٹ — قیمت کا سپورٹ/ریزسٹنس یا نمونے کی حد سے باہر جانا۔', category: 'technical' },
  { term: 'Bullish Engulfing', definition: 'A large green candle engulfing the previous red candle — reversal signal.', urdu: 'بلش انگلفنگ — بڑی سبز کینڈل پچھلی سرخ کینڈل کو نگل جائے — الٹنے کا اشارہ۔', category: 'technical' },
  { term: 'Golden Cross', definition: 'Short MA crossing above long MA (e.g. MA50 × MA200) — bullish signal.', urdu: 'گولڈن کراس — چھوٹی موونگ ایوریج بڑی سے اوپر جائے — خریداری کا مضبوط اشارہ۔', category: 'technical' },
  { term: 'Death Cross', definition: 'Short MA crossing below long MA — bearish signal.', urdu: 'ڈیتھ کراس — چھوٹی موونگ ایوریج بڑی سے نیچے جائے — بیچنے کا اشارہ۔', category: 'technical' },
  { term: 'Divergence', definition: 'Price and indicator moving in opposite directions — potential reversal.', urdu: 'ڈائیورجنس — قیمت اور انڈیکیٹر مخالف سمت میں حرکت کریں — ممکنہ الٹ۔', category: 'technical' },
  { term: 'Cup and Handle', definition: 'A bullish continuation pattern shaped like a cup with a handle.', urdu: 'کپ اور ہینڈل — خریداری کا جاری رہنے والا نمونہ — کپ اور ہینڈل کی شکل کا۔', category: 'technical' },
  { term: 'Head and Shoulders', definition: 'A bearish reversal pattern with three peaks — the middle being the highest.', urdu: 'ہیڈ اینڈ شولڈرز — تین چوٹیوں والا بیئرش الٹنے والا نمونہ — درمیانی سب سے اونچی۔', category: 'technical' },
  { term: 'Candlestick Wick', definition: 'The thin lines above/below a candle body — show price rejection.', urdu: 'وِک — کینڈل کے جسم کے اوپر/نیچے پتلی لکیریں — قیمت کا رد دکھاتی ہیں۔', category: 'technical' },
  { term: 'SMA', definition: 'Simple Moving Average — equal weight to all prices in the period.', urdu: 'ایس ایم اے — سادہ موونگ ایوریج — مدت کی تمام قیمتوں کو برابر اہمیت۔', category: 'technical' },
  { term: 'EMA', definition: 'Exponential Moving Average — more weight to recent prices.', urdu: 'ای ایم اے — ایکسپونینشل موونگ ایوریج — حالیہ قیمتوں کو زیادہ اہمیت۔', category: 'technical' },

  // ===== Psychology =====
  { term: 'FOMO', definition: 'Fear Of Missing Out — buying out of fear that price will keep rising.', urdu: 'فوومو — موقع چھوٹ جانے کا ڈر — اس ڈر سے خریدنا کہ قیمت اوپر ہی جاتی رہے گی۔', category: 'psychology' },
  { term: 'FUD', definition: 'Fear, Uncertainty, Doubt — negative news meant to trigger selling.', urdu: 'فڈ — خوف، بے یقینی، شک — منفی خبریں جو بیچنے پر مجبور کرنے کے لیے پھیلائی جائیں۔', category: 'psychology' },
  { term: 'Revenge Trading', definition: 'Trading larger after a loss to "win back" money — a destructive habit.', urdu: 'انتقامی تجارت — نقصان کے بعد بڑی تجارت کر کے "واپس جیتنے" کی کوشش — تباہ کن عادت۔', category: 'psychology' },
  { term: 'Overtrading', definition: 'Trading too frequently without quality setups — reduces profits.', urdu: 'زیادہ تجارت — بغیر اچھے سیٹ اپ کے بار بار تجارت — منافع کم کرتی ہے۔', category: 'psychology' },
  { term: 'Trading Journal', definition: 'A record of your trades — essential for learning and improvement.', urdu: 'تجارتی جرنل — اپنی تجارتوں کا ریکارڈ — سیکھنے اور بہتری کے لیے ضروری۔', category: 'psychology' },
  { term: 'Discipline', definition: 'Following your trading plan consistently regardless of emotion.', urdu: 'نظم و ضبط — جذبات سے قطع نظر اپنے تجارتی منصوبے پر مسلسل عمل کرنا۔', category: 'psychology' },
  { term: 'Diamond Hands', definition: 'Holding positions even during strong declines — strong conviction.', urdu: 'ڈائمنڈ ہینڈز — شدید گراوٹ پر بھی پوزیشن رکھنا — مضبوط یقین۔', category: 'psychology' },
  { term: 'Paper Hands', definition: 'Selling quickly out of fear — weak conviction.', urdu: 'پیپر ہینڈز — ڈر سے جلدی بیچ دینا — کمزور یقین۔', category: 'psychology' },
  { term: 'Risk Management', definition: 'Protecting capital by limiting losses on each trade (1-2% rule).', urdu: 'خطرے کا انتظام — ہر تجارت پر نقصان محدود کر کے سرمائے کی حفاظت (1-2٪ اصول)۔', category: 'psychology' },
  { term: 'Position Sizing', definition: 'Calculating how much to trade based on account size and risk.', urdu: 'پوزیشن سائزنگ — اکاؤنٹ کے سائز اور خطرے کی بنیاد پر کتنا تجارت کرنا ہے۔', category: 'psychology' },
  { term: 'Risk-Reward Ratio', definition: 'Potential profit vs potential loss on a trade (aim for 1:2 or better).', urdu: 'رسک ریوارڈ تناسب — تجارت پر ممکنہ منافع بمقابلہ ممکنہ نقصان (1:2 یا بہتر کا ہدف)۔', category: 'psychology' },
  { term: 'Drawdown', definition: 'The decline from a peak to a low in your account.', urdu: 'ڈراؤن — آپ کے اکاؤنٹ میں عروج سے نیچے تک کی گراوٹ۔', category: 'psychology' },

  // ===== Advanced =====
  { term: 'Leverage', definition: 'Borrowed capital that multiplies position size — and risk.', urdu: 'لیوریج — ادھار سرمایہ جو پوزیشن کا سائز بڑھاتا ہے — اور خطرہ بھی۔', category: 'advanced' },
  { term: 'Margin', definition: 'The collateral required to open a leveraged position.', urdu: 'مارجن — لیوریج والی پوزیشن کھولنے کے لیے درکار ضمانت۔', category: 'advanced' },
  { term: 'Liquidation', definition: 'Forced closure of a position when margin is exhausted.', urdu: 'لیکویڈیشن — مارجن ختم ہونے پر پوزیشن کی زبردستی بندش۔', category: 'advanced' },
  { term: 'Short Selling', definition: 'Selling an asset you do not own to profit from a price decline.', urdu: 'شارٹ سیلنگ — قیمت گرنے سے منافع کے لیے ایسا اثاثہ بیچنا جو آپ کے پاس نہیں۔', category: 'advanced' },
  { term: 'Futures', definition: 'Contracts to buy/sell an asset at a set price on a future date.', urdu: 'فیوچرز — کسی اثاثے کو مستقبل کی تاریخ پر مقررہ قیمت پر خریدنے/بیچنے کے معاہدے۔', category: 'advanced' },
  { term: 'Perpetual Contract', definition: 'A futures contract with no expiry date.', urdu: 'پرپیچوئل کنٹریکٹ — بغیر میعاد کے فیوچرز معاہدہ۔', category: 'advanced' },
  { term: 'Funding Rate', definition: 'Periodic payment between long and short traders on perpetuals.', urdu: 'فنڈنگ ریٹ — پرپیچوئل پر لمبے اور چھوٹے تاجروں کے درمیان متواتر ادائیگی۔', category: 'advanced' },
  { term: 'Arbitrage', definition: 'Profiting from price differences of the same asset across markets.', urdu: 'آربیٹریج — مختلف مارکیٹوں میں ایک ہی اثاثے کی قیمت کے فرق سے منافع۔', category: 'advanced' },
  { term: 'Order Block', definition: 'A candle zone where institutional orders were placed — strong support/resistance.', urdu: 'آرڈر بلاک — وہ کینڈل کا علاقہ جہاں اداروں نے آرڈر رکھے — مضبوط سپورٹ/ریزسٹنس۔', category: 'advanced' },
  { term: 'FVG', definition: 'Fair Value Gap — an unfilled price range left by a fast move.', urdu: 'ایف وی جی — فیئر ویلیو گیپ — تیز حرکت سے چھوٹا گیا خالی قیمت کا علاقہ۔', category: 'advanced' },
  { term: 'BOS', definition: 'Break of Structure — price breaking a key swing level.', urdu: 'بی او ایس — بریک آف سٹرکچر — قیمت کا اہم سطح توڑنا۔', category: 'advanced' },
  { term: 'CHOCH', definition: 'Change of Character — first sign of a trend reversal.', urdu: 'سی ایچ او سی ایچ — چینج آف کریکٹر — رجحان بدلنے کا پہلا نشان۔', category: 'advanced' },
  { term: 'Liquidity Sweep', definition: 'Price briefly moving past a level to trigger stop losses, then reversing.', urdu: 'لیکویڈیٹی سویپ — قیمت کا مختصراً سطح سے پرے جا کر اسٹاپ لاس ٹرگر کرنا، پھر الٹ جانا۔', category: 'advanced' },
  { term: 'Staking', definition: 'Locking coins to support a network and earn rewards.', urdu: 'اسٹیکنگ — نیٹ ورک کو سپورٹ کرنے اور انعام کمانے کے لیے کوائنز بند کرنا۔', category: 'advanced' },
  { term: 'DeFi', definition: 'Decentralized Finance — financial services without banks.', urdu: 'ڈی فائی — وکندری قرتہ مالیات — بغیر بینکوں کے مالیاتی خدمات۔', category: 'advanced' },
  { term: 'Backtesting', definition: 'Testing a strategy on historical data before risking real money.', urdu: 'بیک ٹیسٹنگ — حقیقی پیسہ لگانے سے پہلے تاریخی ڈیٹا پر حکمت عملی کو آزمانا۔', category: 'advanced' },
  { term: 'Liquidation Price', definition: 'The price at which your position will be forcefully closed.', urdu: 'لیکویڈیشن پرائس — وہ قیمت جس پر آپ کی پوزیشن زبردستی بند ہو جائے گی۔', category: 'advanced' },
  { term: 'Open Interest', definition: 'Total number of open derivative contracts in the market.', urdu: 'اوپن انٹرسٹ — مارکیٹ میں کھلے ڈیریویٹوز معاہدوں کی کل تعداد۔', category: 'advanced' },
  { term: 'Slippage', definition: 'The difference between expected and actual execution price.', urdu: 'سلپیج — متوقع اور حاصل ہونے والی قیمت کے درمیان فرق۔', category: 'advanced' },
  { term: 'Basis', definition: 'The difference between futures price and spot price.', urdu: 'بیسس — فیوچرز کی قیمت اور سپاٹ قیمت کے درمیان فرق۔', category: 'advanced' },
  { term: 'Impermanent Loss', definition: 'Temporary loss in a liquidity pool when prices change.', urdu: 'عارضی نقصان — قیمت بدلنے پر لیکویڈیٹی پول میں عارضی نقصان۔', category: 'advanced' },
  { term: 'Rug Pull', definition: 'A scam where developers abandon a project and take investors funds.', urdu: 'رگ پل — اسکینڈل جس میں ڈویلپرز پروجیکٹ چھوڑ کر سرمایہ کاروں کا پیسہ لے جاتے ہیں۔', category: 'advanced' },
  { term: 'Tokenomics', definition: 'The economics of a token — supply, distribution, and inflation.', urdu: 'ٹوکنومکس — ٹوکن کی معیشت — سپلائی، تقسیم اور افراط زر۔', category: 'advanced' },
]

export function Glossary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | Term['category']>('all')

  const filtered = terms.filter((t) => {
    const matchesSearch =
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase()) ||
      t.urdu.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BookMarked className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trading Glossary</h1>
              <p className="text-muted-foreground">
                Quick reference for essential trading terms — {terms.length} definitions (English + Urdu)
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms..."
              className="pl-3 pr-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', ...Object.keys(categories)] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as typeof activeCategory)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
                )}
              >
                {cat === 'all' ? 'All' : categories[cat as Term['category']]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.term} className="h-full">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-primary">{t.term}</h3>
                  <Badge variant="secondary" className="shrink-0">
                    {categories[t.category]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t.definition}</p>
                <div className="mt-2 border-t border-border pt-2">
                  <p className="text-sm font-medium text-foreground" dir="rtl" lang="ur">
                    {t.urdu}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ChevronDown className="mb-4 h-10 w-10 opacity-40" />
            <p className="text-lg">No terms found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
