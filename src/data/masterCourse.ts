// ============================================================
// Master Crypto Trading — landing page ka single source of truth.
// Saara content/ configuration yahan centralized hai taake aage
// Supabase CMS se swap karne par components na badalne parden.
// (Koi bhi value edit karo — page apne aap update ho jayega.)
// ============================================================

export interface MasterCourseConfig {
  badge: string
  title: string
  tagline: string
  description: string
  ctaPrimary: string
  ctaPrimaryHref: string
  ctaSecondary: string
  ctaSecondaryHref: string
  /** Agar null ho to pricing block plan-based messaging dikhata hai */
  price: number | null
  currency: string
  enrollmentStatus: 'OPEN' | 'CLOSED' | 'WAITLIST'
  duration: string
  classesPerWeek: string
  classDuration: string
  selfStudy: string
  practicalWork: string
  learningMode: string
  cohortNote: string
}

export interface MentorInfo {
  name: string
  image: string
  role: string
  bio: string[]
  philosophy: string
}

export const masterCourse: MasterCourseConfig = {
  badge: 'TRADEED | PROFESSIONAL CRYPTO EDUCATION',
  title: 'Master Crypto Trading: Beginner to Advanced',
  tagline: 'Zero se Professional Trading Process Tak',
  description:
    'Ek structured mentor-led crypto trading program jahan aap sirf indicators ya signals nahi, balkay market ko samajhna, trade plan banana, risk calculate karna, chart read karna, strategies test karna aur apni performance evaluate karna seekhte hain.',
  ctaPrimary: 'Enroll Now',
  ctaPrimaryHref: '/pricing',
  ctaSecondary: 'Explore Full Curriculum',
  ctaSecondaryHref: '#curriculum',
  price: null, // jaise hi asli course price final ho, yahan number daal dein
  currency: 'PKR',
  enrollmentStatus: 'OPEN',
  duration: '24 Weeks',
  classesPerWeek: '3 Live Classes/Week',
  classDuration: '90 Minutes/Class',
  selfStudy: '60–90 Minutes/Day',
  practicalWork: '4–5 Hours/Week',
  learningMode: 'Live + Practical + Assignments + Review',
  cohortNote: 'Live cohort based — har class mein mentor ke sath sawal aur jawab.',
}

export const mentor: MentorInfo = {
  name: 'M. Aslam Khan',
  image: '/profile/aslam-khan.webp',
  role: 'Founder & Instructor — TradeEd',
  bio: [
    'TradeEd ke founder jo trading education ko Urdu/ Roman Urdu mein structured banana ka kaam dekh rahe hain — 40+ books, courses aur daily educational content ke sath.',
    'Kaam ka usool simple hai: concepts ko plain language mein samjhana, chart par live demonstrate karna, aur student ko khud analyze karne par majboor karna.',
    'Teaching focus: market structure, risk management, price action aur disciplined trading process — bina signals ke.',
  ],
  philosophy:
    'Students ko signals par dependent banane ke bajaye unhein khud market read karna aur disciplined decisions lena sikhana.',
}

export const trustStrip: string[] = [
  'Beginner → Advanced',
  'Live Mentor Training',
  'TradingView Practice',
  'Binance Practical Sessions',
  'Backtesting',
  'Paper Trading',
  'Final Assessment',
]

export const problems: string[] = [
  'Random YouTube learning — topic kabhi bhi, order kabhi nahi',
  'Strategy hopping — har hafte nayi strategy',
  'Indicators ka overload — 12 indicators, 12 raiyan',
  'Entry pata hoti hai, risk management nahi',
  'Stop Loss ka proper use nahi',
  'Leverage ka misuse',
  'Market structure ki understanding weak',
  'Backtesting nahi — strategy par bharosa bin data ke',
  'Journal maintain nahi hota — mistakes repeat hoti hain',
  'Emotional trading — FOMO aur revenge',
  'Profit ke peeche bhaagna, plan ke baghair',
  'Signals par dependency — khud kabhi seekha nahi',
]

export const solutionLoop: string[] = [
  'Learn',
  'Understand',
  'See on Chart',
  'Practice',
  'Backtest',
  'Paper Trade',
  'Journal',
  'Review',
  'Improve',
]

export const whatYouGet: { num: string; title: string; desc: string }[] = [
  { num: '01', title: 'Structured Curriculum', desc: 'Beginner se Advanced tak properly sequenced roadmap — koi random order nahi.' },
  { num: '02', title: 'Live Mentor Teaching', desc: 'Concepts ko live explain karna, charts par demonstrate karna aur practical questions solve karna.' },
  { num: '03', title: 'TradingView Chart Lab', desc: 'Historical aur live market charts par concepts identify karna — dekh kar nahi, kar ke.' },
  { num: '04', title: 'Binance Practical Training', desc: 'Spot, Futures, orders, risk controls aur trading interface ka practical use.' },
  { num: '05', title: 'Risk Management System', desc: 'Position sizing, Stop Loss, Take Profit, R:R, drawdown aur risk limits ka complete system.' },
  { num: '06', title: 'Strategy Development', desc: 'Rules-based strategies ko samajhna, test karna aur evaluate karna.' },
  { num: '07', title: 'Backtesting', desc: 'Historical data par strategy performance evaluate karna — data se faisla.' },
  { num: '08', title: 'Paper Trading', desc: 'Real capital risk kiye baghair execution practice.' },
  { num: '09', title: 'Trading Journal', desc: 'Har trade ko record, analyze aur review karna — improvement ka engine.' },
  { num: '10', title: 'Final Trader Assessment', desc: 'Theory + chart analysis + trade planning + backtesting + paper trading evaluation.' },
]

export interface CoursePhase {
  id: string
  phase: string
  title: string
  topics: string[]
}

export const curriculum: CoursePhase[] = [
  {
    id: 'phase-01',
    phase: 'PHASE 01',
    title: 'Trader Foundation',
    topics: ['Trading Kya Hai?', 'Trader vs Investor vs Gambler', 'Probability', 'Risk & Reward', 'Trading Edge', 'Professional Trading Workflow', 'Why Traders Fail', 'Realistic Expectations'],
  },
  {
    id: 'phase-02',
    phase: 'PHASE 02',
    title: 'Crypto Foundation',
    topics: ['Bitcoin', 'Blockchain', 'Ethereum', 'Coins vs Tokens', 'Stablecoins', 'Layer 1 / Layer 2', 'DeFi', 'DEX', 'NFT / Web3', 'Tokenomics', 'Crypto Scams', 'Wallets', 'Seed Phrase Security'],
  },
  {
    id: 'phase-03',
    phase: 'PHASE 03',
    title: 'Binance Mastery',
    topics: ['Binance Interface', 'Account Security', 'Spot Wallet', 'Trading Pairs', 'Market Orders', 'Limit Orders', 'Stop Orders', 'Stop Loss', 'Take Profit', 'OCO', 'Futures Interface', 'Isolated vs Cross Margin', 'Mark Price', 'Index Price', 'Last Price', 'Liquidation', 'Funding Rate', 'Advanced Orders'],
  },
  {
    id: 'phase-04',
    phase: 'PHASE 04',
    title: 'TradingView Mastery',
    topics: ['TradingView Interface', 'Candlestick Charts', 'Timeframes', 'Drawing Tools', 'Support & Resistance', 'Trendlines', 'Channels', 'Fibonacci', 'Volume', 'Indicators', 'Templates', 'Alerts', 'Multi-Timeframe Analysis', 'Bar Replay'],
  },
  {
    id: 'phase-05',
    phase: 'PHASE 05',
    title: 'Candlestick & Price Action',
    topics: ['Candle Anatomy', 'Bullish/Bearish Candles', 'Rejection', 'Momentum', 'Engulfing', 'Pin Bar', 'Inside Bar', 'Breakout Candles', 'Continuation', 'Reversal', 'Price Action Reading'],
  },
  {
    id: 'phase-06',
    phase: 'PHASE 06',
    title: 'Technical Analysis',
    topics: ['SMA', 'EMA', 'VWAP', 'RSI', 'MACD', 'Bollinger Bands', 'ATR', 'Volume', 'Divergence', 'Indicator Confluence', 'Indicator Limitations'],
  },
  {
    id: 'phase-07',
    phase: 'PHASE 07',
    title: 'Market Structure',
    topics: ['HH', 'HL', 'LH', 'LL', 'Trend Structure', 'BOS', 'CHOCH', 'MSS', 'Internal Structure', 'External Structure', 'Multi-Timeframe Structure', 'Continuation vs Reversal'],
  },
  {
    id: 'phase-08',
    phase: 'PHASE 08',
    title: 'Liquidity',
    topics: ['Liquidity', 'Buy-Side Liquidity', 'Sell-Side Liquidity', 'Equal Highs', 'Equal Lows', 'Stop Hunts', 'Liquidity Sweeps', 'Liquidity Pools', 'False Breakouts'],
  },
  {
    id: 'phase-09',
    phase: 'PHASE 09',
    title: 'SMC / ICT Concepts',
    topics: ['Order Blocks', 'Fair Value Gaps', 'Imbalance', 'Displacement', 'Premium / Discount', 'Breakers', 'Mitigation', 'Inducement', 'Kill Zones', 'Confluence'],
  },
  {
    id: 'phase-10',
    phase: 'PHASE 10',
    title: 'Trading Strategies',
    topics: ['Trend Following', 'Pullback Trading', 'Breakout & Retest', 'Range Trading', 'Liquidity Sweep', 'EMA + Market Structure', 'RSI Divergence', 'Momentum Trading', 'SMC + FVG', 'Session Breakout'],
  },
  {
    id: 'phase-11',
    phase: 'PHASE 11',
    title: 'Risk Management',
    topics: ['Risk Per Trade', 'Position Sizing', 'Stop Loss', 'Take Profit', 'Risk/Reward', 'R-Multiple', 'Win Rate', 'Expectancy', 'Drawdown', 'Losing Streaks', 'Risk of Ruin', 'Daily Loss Limit', 'Weekly Loss Limit', 'Portfolio Exposure', 'Correlation', 'Professional Risk Plan'],
  },
  {
    id: 'phase-12',
    phase: 'PHASE 12',
    title: 'Futures Trading',
    topics: ['Spot vs Futures', 'Leverage', 'Margin', 'Liquidation', 'Isolated Margin', 'Cross Margin', 'Position Size', 'Notional Value', 'Partial Take Profit', 'Break Even', 'Trailing Stop', 'Scaling', 'Hedging', 'Futures Risk'],
  },
  {
    id: 'phase-13',
    phase: 'PHASE 13',
    title: 'Fundamental & Macro Analysis',
    topics: ['Tokenomics', 'Supply & Demand', 'Token Unlocks', 'Bitcoin Halving', 'ETF', 'Federal Reserve', 'Interest Rates', 'CPI', 'PPI', 'NFP', 'DXY', 'Bond Yields', 'Risk-On / Risk-Off', 'Macro + Technical Confluence'],
  },
  {
    id: 'phase-14',
    phase: 'PHASE 14',
    title: 'On-Chain & Market Data',
    topics: ['Exchange Inflows', 'Exchange Outflows', 'Whale Activity', 'Open Interest', 'Funding', 'Liquidation Data', 'Long/Short Data', 'BTC Dominance', 'Stablecoin Liquidity', 'Market Sentiment'],
  },
  {
    id: 'phase-15',
    phase: 'PHASE 15',
    title: 'Trading Psychology',
    topics: ['FOMO', 'Fear', 'Greed', 'Revenge Trading', 'Overtrading', 'Loss Aversion', 'Discipline', 'Patience', 'Emotional Control', 'Process Over Outcome'],
  },
  {
    id: 'phase-16',
    phase: 'PHASE 16',
    title: 'Backtesting',
    topics: ['Why Backtest', 'Define Strategy Rules', 'Historical Testing', 'Sample Size', 'Win Rate', 'Average Win', 'Average Loss', 'Expectancy', 'Drawdown', 'Profit Factor', 'Strategy Evaluation'],
  },
  {
    id: 'phase-17',
    phase: 'PHASE 17',
    title: 'Trading Journal',
    topics: ['Trade Documentation', 'Screenshots', 'Setup', 'Entry', 'SL', 'TP', 'Risk', 'Result', 'R-Multiple', 'Emotion', 'Mistake', 'Lesson', 'Weekly Review'],
  },
  {
    id: 'phase-18',
    phase: 'PHASE 18',
    title: 'Paper Trading',
    topics: ['Execution practice', 'Risk tracking', 'Result tracking', 'Discipline', 'Mistake log', 'Performance review'],
  },
  {
    id: 'phase-19',
    phase: 'PHASE 19',
    title: 'Advanced Trader Development',
    topics: ['Multi-Timeframe Confluence', 'Market Regimes', 'Strategy Selection', 'Portfolio Exposure', 'Correlation', 'Advanced Trade Management', 'Performance Optimization', 'Trader Development Plan'],
  },
  {
    id: 'phase-20',
    phase: 'PHASE 20',
    title: 'Final Trader Assessment',
    topics: ['Theory', 'Chart Reading', 'Market Structure', 'Trade Planning', 'Risk Management', 'Strategy Rules', 'Backtesting', 'Paper Trading', 'Journal Quality', 'Final Presentation / Defense'],
  },
]

export const teachingLoop: { step: string; desc: string }[] = [
  { step: 'CONCEPT', desc: 'Concept ko simple language mein explain kiya jayega.' },
  { step: 'VISUAL', desc: 'Diagram / workflow / chart se concept visualize kiya jayega.' },
  { step: 'LIVE CHART', desc: 'TradingView par real aur historical chart examples dekhe jayenge.' },
  { step: 'PRACTICE', desc: 'Student khud chart par setup identify karega.' },
  { step: 'BACKTEST', desc: 'Historical examples par strategy test hogi.' },
  { step: 'PAPER TRADE', desc: 'Execution practice, capital risk baghair.' },
  { step: 'JOURNAL', desc: 'Results document honge.' },
  { step: 'REVIEW', desc: 'Mistakes aur performance analyze hogi.' },
]

export const classWorkflow: { min: string; label: string }[] = [
  { min: '10 min', label: 'Previous lesson revision' },
  { min: '15 min', label: 'New concept' },
  { min: '15 min', label: 'Visual explanation' },
  { min: '25 min', label: 'TradingView practical' },
  { min: '15 min', label: 'Historical examples' },
  { min: '7 min', label: 'Student exercise' },
  { min: '3 min', label: 'Assignment + next lecture' },
]

export const tools: { name: string; desc: string }[] = [
  { name: 'TradingView', desc: 'Chart analysis, indicators, drawings, alerts, replay aur multi-timeframe analysis.' },
  { name: 'Binance', desc: 'Spot aur Futures interface, order types, risk controls aur execution.' },
  { name: 'Trading Journal', desc: 'Structured trade documentation aur performance review.' },
  { name: 'Backtesting', desc: 'Historical strategy evaluation — data par test, andaza nahi.' },
  { name: 'Market Data', desc: 'Open Interest, Funding, Liquidation, Dominance aur relevant market data.' },
]

export const tradeWorkflow: string[] = [
  'Market Context',
  'Market Structure',
  'Liquidity',
  'Setup',
  'Entry',
  'Stop Loss',
  'Take Profit',
  'Position Size',
  'Execution',
  'Journal',
  'Review',
]

export const riskExample = {
  account: '$1,000',
  risk: '1%',
  maxLoss: '$10',
  target: '$20',
  rr: '1:2',
}

export const backtestFlow: string[] = [
  'Strategy Idea',
  'Rules',
  'Historical Backtest',
  'Performance Data',
  'Paper Trading',
  'Review',
  'Refinement',
]

export const backtestMetrics: string[] = [
  'Sample size',
  'Win rate',
  'Average win',
  'Average loss',
  'Expectancy',
  'Drawdown',
  'Profit factor',
  'Rule consistency',
]

export const studentJourney: string[] = [
  'BEGINNER',
  'Market Understanding',
  'Chart Reader',
  'Technical Analyst',
  'Strategy Builder',
  'Risk-Controlled Trader',
  'Backtester',
  'Paper Trader',
  'Independent Trader',
]

export const outcomes: string[] = [
  'Explain how crypto markets work',
  'Navigate Binance confidently',
  'Use TradingView professionally',
  'Read candlestick charts',
  'Identify market structure',
  'Identify liquidity',
  'Apply technical analysis',
  'Build a trade plan',
  'Calculate position size',
  'Define Stop Loss and Take Profit',
  'Understand Futures and leverage risks',
  'Build rules-based strategies',
  'Backtest strategies',
  'Paper trade',
  'Maintain a trading journal',
  'Evaluate performance',
  'Identify common psychological mistakes',
  'Develop a personal trading process',
]

export const notPromised: string[] = [
  'Guaranteed profits',
  'Guaranteed win rates',
  'Guaranteed income',
  'Shortcut to becoming a successful trader',
]

export const materials: { title: string; desc: string }[] = [
  { title: 'Complete lecture slides', desc: 'Har class ke slides — revise karne ke liye.' },
  { title: 'Trading checklists', desc: 'Entry se pehle ka pre-trade checklist.' },
  { title: 'Trade planning templates', desc: 'Setup, entry, SL, TP — ek structured plan har trade ke liye.' },
  { title: 'Risk management worksheet', desc: 'Risk per trade, limits aur exposure ka worksheet.' },
  { title: 'Position sizing calculator', desc: 'Risk se position size nikalne ka tool.' },
  { title: 'Trading journal template', desc: 'Har trade log karne ka ready template.' },
  { title: 'Backtesting framework', desc: 'Rules define se lekar evaluation tak ka framework.' },
  { title: 'Strategy testing sheets', desc: 'Performance data record karne ki sheets.' },
  { title: 'Homework + quizzes', desc: 'Har module ke baad practice aur concept check.' },
  { title: 'Chart exercises', desc: 'Live chart par identify karne wali exercises.' },
  { title: 'Final assessment', desc: 'Theory + practical + paper trading evaluation.' },
  { title: 'Course completion certificate', desc: 'Assessment pass karne par certificate.' },
]

export const whyTradeEd = {
  generic: ['Watch', 'Forget', 'Watch Another Video', 'Try Random Strategy'],
  tradeed: ['Learn', 'Understand', 'Practice', 'Backtest', 'Paper Trade', 'Journal', 'Review', 'Improve'],
}

export const faq: { q: string; a: string }[] = [
  { q: 'Is this course beginner-friendly?', a: 'Haan. Program fundamentals se start hota hai aur progressively advanced trading concepts tak jata hai — pehle se trading ki knowledge ki zaroorat nahi.' },
  { q: 'Kya mujhe pehle se trading aani chahiye?', a: 'Nahi. Curriculum foundation se shuru hota hai — Phase 01 hi trading ki bunyad par hai.' },
  { q: 'Kya live classes hongi?', a: `Haan. Format: ${masterCourse.duration} • ${masterCourse.classesPerWeek} • ${masterCourse.classDuration} — live mentor teaching ke sath, sawal jawab session ke andar hi.` },
  { q: 'Kya Binance practically sikhaya jayega?', a: 'Haan — Binance interface, order types, Spot/Futures aur risk controls practical curriculum ka hissa hain.' },
  { q: 'Kya TradingView sikhaya jayega?', a: 'Haan — charts, drawing tools, indicators, multi-timeframe analysis aur Bar Replay tak, sab practical exercises ke sath.' },
  { q: 'Kya Futures trading bhi course mein hai?', a: 'Haan — leverage, margin, liquidation, position sizing aur trade management, risk management ke sath samjhe jate hain.' },
  { q: 'Kya mujhe profitable trader banne ki guarantee hai?', a: 'Nahi. Koi legitimate course future profitability ki guarantee nahi de sakta. Ye course structured process sikhata hai: market samajhna, risk manage karna, strategy test karna aur data se improve karna.' },
  { q: 'Kya real money se trade karna zaroori hai?', a: 'Nahi. Students pehle chart exercises, backtesting aur paper trading se practice karte hain — real capital tab jab tayyar hon.' },
  { q: 'Kya course mein risk management hai?', a: 'Haan — position sizing se lekar daily loss limits tak, program ka core component hai.' },
  { q: 'Kya course complete karne par certificate milega?', a: 'Haan — final assessment (theory + practical + paper trading) pass karne par course completion certificate milta hai. Certificate completion confirm karta hai, future trading performance ki guarantee nahi.' },
  { q: 'Kya course Urdu mein hai?', a: 'Haan — sari teaching Roman Urdu mein hai, technical terms English ke sath (jaise har TradeEd content mein).' },
  { q: 'Kya course lifetime access deta hai?', a: 'Access aap ke enrollment ke saath shuru hota hai aur plan policy ke mutabiq active rehta hai — details enrollment ke waqt show hoti hain.' },
]

export const masterSeo = {
  title: 'Master Crypto Trading: Beginner to Advanced | TradeEd',
  description:
    'TradeEd ka structured Crypto Trading Master Program. Beginner se advanced tak market structure, technical analysis, risk management, Futures, strategies, backtesting, paper trading aur professional trading process seekhein.',
  ogImage: '/blog/crypto-trading-shuru-karein-pakistan.webp',
}
