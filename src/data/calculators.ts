import {
  ArrowLeftRight,
  Gauge,
  Layers,
  PiggyBank,
  Scale,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export interface CalculatorDef {
  slug: string
  title: string
  shortDesc: string
  icon: LucideIcon
  seoTitle: string
  seoDesc: string
  whatH2: string
  intro: string[]
  formula: string
  example: string
  howTo: string[]
}

export const calculators: CalculatorDef[] = [
  {
    slug: 'futures',
    title: 'Futures Calculator',
    shortDesc: 'Position size, liquidation, P&L, fees aur R:R — sab ek jagah',
    icon: Gauge,
    seoTitle: 'Futures Calculator — Position, Liquidation & P&L | TradeEd',
    seoDesc:
      'Free futures calculator: position value, liquidation price, P&L, fees aur risk-reward — trade se pehle poora hisaab Roman Urdu ke sath.',
    whatH2: 'Futures Calculator Kya Hai?',
    intro: [
      'Futures trading mein har trade se pehle aapko pata hona chahiye ke position kitni badi hogi, liquidation price kahan hai, aur take profit / stop loss par kitna profit ya loss hoga. Yeh calculator woh sab kuch ek jagah nikal deta hai.',
      'Account balance, trade size, leverage, entry, TP aur SL daalein — calculator position value, quantity, liquidation price, net profit (fees aur funding ke baad) aur risk-reward ratio foran dikha dega. Stop loss liquidation ke peeche ho to warning bhi milegi.',
    ],
    formula:
      'Position Value = Trade Size × Leverage\nQuantity = Position Value ÷ Entry\nLiquidation (Long) = Entry × (1 − 1 ÷ Leverage)\nLiquidation (Short) = Entry × (1 + 1 ÷ Leverage)\nNet P&L = (Exit − Entry) × Quantity − Fees − Funding\nR:R = |Profit at TP| ÷ |Loss at SL|',
    example:
      'Example: Account $1000, trade size $100, leverage 10x → position value $1000. Entry $100 par quantity 10 coin. Long liquidation price $90 hogi. TP $110 par gross profit (110−100) × 10 = $100 — lekin fees aur funding ke baad net thora kam.',
    howTo: [
      'Upar Long ya Short select karein — aap trade kis taraf khol rahe hain.',
      'Account Balance, Trade Size (margin USDT), Leverage aur Entry Price bharein.',
      'Take Profit aur Stop Loss ke prices daalein; chahen to Fees & Slippage section mein maker/taker fee, slippage aur funding rate adjust karein.',
      'Calculate dabayein — position value, quantity, liquidation price, TP/SL par net P&L, R:R, fees aur account risk ek saath mil jayenge.',
      'Red warning dikhe to aapka SL liquidation price ke peeche hai — SL ko liquidation ke idhar taraf move karein.',
    ],
  },
  {
    slug: 'position-size',
    title: 'Position Size Calculator',
    shortDesc: 'Balance aur risk % se sahi trade size nikalein',
    icon: Scale,
    seoTitle: 'Position Size Calculator — Risk Per Trade | TradeEd',
    seoDesc:
      'Free position size calculator: account balance, risk% aur stop loss se exact trade size aur quantity calculate karein — 1% risk rule ke sath.',
    whatH2: 'Position Size Kya Hai?',
    intro: [
      'Position size ka matlab hai ke ek trade mein aap kitna paisa risk par laga rahe hain. Professional traders har trade par account ka sirf 1% risk karte hain — is tarah ek losing streak bhi account khatam nahi karti.',
      'Yeh calculator aapka balance, chosen risk % aur stop loss distance le kar woh trade size nikalta hai jo bilkul aapke risk par fit ho. Position sizing trading ka sab se important discipline hai.',
    ],
    formula:
      'Risk Amount = Balance × Risk %\nQuantity = Risk Amount ÷ |Entry − Stop Loss|\nPosition Size = Quantity × Entry',
    example:
      'Example: Balance $1000, risk 1%, entry $100, stop loss $95. Risk Amount = $10. Distance $5 hai → quantity 2 coin, position size $200. Agar stop loss hit hua, sirf $10 (1%) gaya — baaki capital safe.',
    howTo: [
      'Account Balance (apna total capital) bharein.',
      'Risk Per Trade % set karein — professional traders har trade par 1% se zyada nahi lete.',
      'Entry Price aur Stop Loss Price daalein.',
      'Calculator foran trade size, quantity aur har trade par kitna amount risk par hai wo dikha dega.',
    ],
  },
  {
    slug: 'risk-reward',
    title: 'Risk : Reward Calculator',
    shortDesc: 'R:R ratio aur break-even win rate check karein',
    icon: Target,
    seoTitle: 'Risk Reward Ratio Calculator — R:R & Win Rate | TradeEd',
    seoDesc:
      'Free risk-reward calculator: entry, SL aur TP se R:R ratio aur required win rate calculate karein — 1:2 rule se consistently profitable banein.',
    whatH2: 'Risk : Reward Ratio Kya Hai?',
    intro: [
      'Risk-reward ratio batata hai ke har $1 risk par aap kitna profit kama rahe hain. 1:2 ka matlab: $1 risk karke $2 ka target. Isi hisaab se profitable hone ke liye har trade ka target stop loss se bara hona chahiye.',
      'Yeh calculator sirf ratio nahi, woh win rate bhi nikalta hai jo break-even ke liye zaroori hai. 1:2 par sirf 33% trades theek hon to bhi aap net profitable rahenge — probability aapke saath kaam karti hai.',
    ],
    formula:
      'R:R = |TP − Entry| ÷ |Entry − SL|\nRequired Win % = 1 ÷ (1 + R:R) × 100',
    example:
      'Example: Entry $100, SL $95 (risk $5), TP $110 (reward $10) → R:R 1:2. Break-even win rate = 1 ÷ 3 = 33.3% — teen mein se ek trade bhi sahi ho to account barh raha hai.',
    howTo: [
      'Entry Price, Stop Loss aur Take Profit ke prices bharein.',
      'R:R ratio aur break-even win rate foran nikal jayega.',
      'Har trade par 1:2 ya us se behtar ratio rakhein aur required win % check karte rahein.',
    ],
  },
  {
    slug: 'leverage',
    title: 'Leverage & Margin Calculator',
    shortDesc: 'Buying power, margin aur liquidation distance',
    icon: Layers,
    seoTitle: 'Leverage & Margin Calculator — Buying Power | TradeEd',
    seoDesc:
      'Free leverage calculator: capital se buying power, margin requirement aur liquidation distance nikalein — leverage ka asli kharcha samjhein.',
    whatH2: 'Leverage Aur Margin Kya Hai?',
    intro: [
      'Leverage aapke capital ka multiplier hai — 10x leverage par $100 se $1000 ka position khola ja sakta hai. Lekin profit multiplies hone ke saath loss aur liquidation ka khatra bhi utna hi barhta hai.',
      'Yeh calculator batata hai ke aapka capital kitna buying power deta hai, position ka kitna margin lagta hai, aur price kitne percent chalne par liquidation hogi. Leverage samajh ke hi use karein.',
    ],
    formula:
      'Buying Power = Capital × Leverage\nMargin = Position Size ÷ Leverage\nLiq Distance ≈ 1 ÷ Leverage × 100 %',
    example:
      'Example: Capital $500, leverage 20x → buying power $10,000. $2000 ke position par margin sirf $100. Lekin liquidation distance ~5% — 5% ulti move par poora margin ja sakta hai. Isi liye kam leverage + stop loss zaroori.',
    howTo: [
      'Apna Capital / Balance bharein.',
      'Leverage (x) aur Position Size (notional USDT) daalein.',
      'Buying power, margin requirement aur liquidation distance mil jayega — leverage badhane se pehle liquidation distance zaroor check karein.',
    ],
  },
  {
    slug: 'profit-loss',
    title: 'P&L Calculator',
    shortDesc: 'Trade ka profit, loss aur ROI foran',
    icon: TrendingUp,
    seoTitle: 'Profit & Loss Calculator — Trade P&L + ROI | TradeEd',
    seoDesc:
      'Free P&L calculator: direction, entry, exit aur quantity se trade ka profit ya loss aur ROI calculate karein — long aur short dono ke liye.',
    whatH2: 'Trade Ka P&L Kaise Nikalte Hain?',
    intro: [
      'Har trade ka natija simple hai: entry aur exit ke darmiyan ka farq × quantity. Long mein kamne se, short mein girne se profit hota hai — aur ulta hona par loss.',
      'Yeh calculator long aur short dono ke liye P&L, percentage return aur ROI (capital ke muqable) nikalta hai — trade plan karte waqt pata chalta hai ke target par kitna milega aur risk kitna hai.',
    ],
    formula:
      'Long P&L = (Exit − Entry) × Quantity\nShort P&L = (Entry − Exit) × Quantity\nROI = P&L ÷ Capital × 100',
    example:
      'Example: Long 5 BTC, entry $60,000, exit $62,000 → P&L = 2000 × 5 = $10,000. Capital $20,000 tha → ROI 50%. Wahi move agar short hoti to loss $10,000 hota — direction ka faisle par asar padta hai.',
    howTo: [
      'Long ya Short direction select karein.',
      'Entry Price, Exit Price aur Quantity bharein.',
      'ROI nikalne ke liye Capital Deployed (USDT) bhi daal dein.',
      'P&L, ROI % aur position value foran mil jayenge — yeh gross P&L hai, fees alag se kaat lein.',
    ],
  },
  {
    slug: 'futures-pnl',
    title: 'Futures PnL & Open Price Calculator',
    shortDesc: 'Trade ka net PnL — ya reverse mein desired profit se entry price',
    icon: ArrowLeftRight,
    seoTitle: 'Futures PnL & Open Price Calculator — Reverse Entry | TradeEd',
    seoDesc:
      'Free futures PnL calculator with reverse open-price mode: entry, exit, quantity, leverage aur fees se net profit/ROI — ya desired profit se required entry price nikalein.',
    whatH2: 'Futures PnL Aur Open Price Calculator Kya Hai?',
    intro: [
      'Normal mode mein entry, exit, quantity, leverage aur fee rate daalte hi net PnL, ROI %, initial margin, position value aur total fees foran nikal aate hain — long aur short dono ke liye, fees adjust karke.',
      'Open Price (reverse) mode ulta kaam karta hai: aap desired profit, exit price aur position size batate hain — calculator fees adjust karke nikalta hai ke position kis entry price par kholni chahiye. Trade plan banate waqt entry pehle se fix karne ke liye zabardast tool.',
    ],
    formula:
      'Net PnL = (Exit − Entry) × Qty − Fees (Long)\nMargin = Position Value ÷ Leverage\nEntry ≈ Exit − (Desired PnL + Fees) ÷ Qty (Long)',
    example:
      'Example (Normal): Long 0.1 BTC, entry $65,000, exit $68,000, leverage 10x, fee 0.04% → net PnL ~$294, ROI ~45%. Example (Reverse): $50 desired profit, exit $68,000, 0.1 qty → entry ~$67,446 par kholna hoga.',
    howTo: [
      'Upar Normal PnL ya Open Price (Reverse) tab choose karein.',
      'Long/Short, quantity ya position size (USDT), leverage aur fee rate bharein.',
      'Normal tab mein entry + exit daalein — Net PnL, ROI, margin aur fees nikal jayenge.',
      'Reverse tab mein desired PnL + exit price daalein — required entry price mil jayegi jahan trade kholni chahiye.',
    ],
  },
  {
    slug: 'compounding',
    title: 'Compounding Calculator',
    shortDesc: 'Monthly deposits ke sath paisa barhane ka hisaab',
    icon: PiggyBank,
    seoTitle: 'Compound Interest Calculator — Trading Growth | TradeEd',
    seoDesc:
      'Free compounding calculator: initial deposit, monthly contribution aur annual return se final balance nikalein — compound interest ka asar samjhein.',
    whatH2: 'Compounding Kya Hai?',
    intro: [
      'Compounding ka matlab hai ke aap sirf capital nahi, profit bhi dobara lagate hain — phir agle mahine profit par profit kamata hai. Waqt ke saath yeh golabarh tezi se barhta hai, isi liye isse "eighth wonder of the world" kaha jata hai.',
      'Yeh calculator initial deposit, har mahine ki saving aur realistic annual return par aakhir mein kitna final balance banega dikhata hai — saal ba saal breakdown ke sath, taake compounding ka asar khud dekh sakein.',
    ],
    formula: 'Balanceₙ = (Balanceₙ₋₁ + Monthly Deposit) × (1 + Annual Return ÷ 12)',
    example:
      'Example: $500 shuruat, $100 har mahina, 20% saalana return, 5 saal → kareeb $14,000+ final balance, jismein total deposit sirf $6,500 hoga. Fark compounding ka hai.',
    howTo: [
      'Initial Deposit, Monthly Deposit, Annual Return (%) aur Years bharein.',
      'Saal ba saal growth breakdown ke sath final balance nikal aayega — compounding ka asar saaf nazar aayega.',
    ],
  },
]

export const getCalculator = (slug: string): CalculatorDef | undefined =>
  calculators.find((c) => c.slug === slug)
