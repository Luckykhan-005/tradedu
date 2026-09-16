import { Hono } from 'hono'
import { prisma } from './src/lib/db'
import { sendEmail, passwordResetEmail, isValidEmail } from './server/email'

const app = new Hono()

const STUDENT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
const PBKDF2_ITERATIONS = 100_000
const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''

function sessionCookie(token: string, clear = false) {
  return `tradeed_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secureFlag}; ${clear ? 'Max-Age=0' : `Max-Age=${Math.floor(STUDENT_SESSION_TTL_MS / 1000)}`}`
}

function readSession(c: any) {
  const cookie = c.req.header('Cookie') || ''
  const item = cookie.split(';').map((v: string) => v.trim()).find((v: string) => v.startsWith('tradeed_session='))
  return item ? decodeURIComponent(item.slice('tradeed_session='.length)) : ''
}

// A paid plan only counts while it is unexpired; otherwise the user falls back
// to FREE. Admins/instructors always resolve to PREMIUM (rank 2).
function effectivePlanOf(user: any): string {
  if (user?.role === 'admin' || user?.role === 'instructor') return 'PREMIUM'

  const plan = String(user?.plan || 'FREE').toUpperCase()
  if (plan === 'FREE') return 'FREE'

  const expiresAt = user?.planExpiresAt
  if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) return 'FREE'

  return plan
}

// Sessions are persisted (hashed) in the database so they survive restarts and
// match production behavior. Only a SHA-256 hash of the token is stored.
async function getAuthenticatedUser(c: any) {
  const token = readSession(c)
  if (!token) return null

  const session = await prisma.studentSession.findUnique({ where: { tokenHash: await sha256(token) } })
  if (!session || session.revokedAt) return null

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await prisma.studentSession.updateMany({ where: { id: session.id, revokedAt: null }, data: { revokedAt: new Date() } })
    return null
  }

  return prisma.user.findUnique({ where: { id: session.userId } })
}

async function issueStudentSession(c: any, userId: string) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)))
  await prisma.studentSession.create({
    data: {
      tokenHash: await sha256(token),
      userId,
      expiresAt: new Date(Date.now() + STUDENT_SESSION_TTL_MS),
    },
  })
  c.header('Set-Cookie', sessionCookie(token))
}

// Allow credentials for the same-origin session cookie.
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin') || '*'
  c.header('Access-Control-Allow-Origin', origin)
  c.header('Access-Control-Allow-Credentials', 'true')
  c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token')
  c.header('Access-Control-Max-Age', '86400')
  if (c.req.method === 'OPTIONS') return c.body(null, 204)
  await next()
})

// Seed sample data
app.post('/seed', async (c) => {
  // Check if data already exists
  const courseCount = await prisma.course.count()

  // ===== Ensure core courses exist (runs every time, even if seeded) =====
  async function ensureCourse(data: any) {
    const existing = await prisma.course.findFirst({ where: { title: data?.data?.title } as any })
    if (existing) return existing
    return await prisma.course.create(data)
  }

  await Promise.all([
    ensureCourse({
      data: {
        title: 'Crypto Trading Mastery (Beginner to Advanced)',
        description: 'Complete crypto trading education — 37 lectures across 3 phases. Learn blockchain fundamentals, technical analysis, order blocks, FVG, and professional SMC strategies.',
        level: 'beginner',
        price: 0,
        isPublished: true,
        duration: '12 weeks',
        rating: 4.9,
        studentCount: 0,
        modules: {
          create: [
            {
              title: 'Phase 1: Crypto Fundamentals',
              order: 0,
              lessons: {
                create: [
                  { title: 'What is Crypto? Bitcoin Story', type: 'video', duration: '15 min', order: 0, content: 'Learn the history of Bitcoin, what cryptocurrency is, and how it differs from traditional money.' },
                  { title: 'Blockchain Technology', type: 'video', duration: '18 min', order: 1, content: 'How blockchain works — blocks, chains, mining, and decentralization.' },
                  { title: 'Wallets & Security', type: 'video', duration: '20 min', order: 2, content: 'Hot vs cold wallets, private keys, seed phrases, and how to keep your coins safe.' },
                  { title: 'Exchanges & Order Types', type: 'video', duration: '16 min', order: 3, content: 'How to buy/sell on exchanges, market vs limit orders, stop-loss and take-profit.' },
                  { title: 'Candlestick Charts', type: 'video', duration: '14 min', order: 4, content: 'Reading candlestick charts — OHLC, green vs red candles, wicks and timeframes.' },
                  { title: 'Fundamental vs Technical Analysis', type: 'video', duration: '12 min', order: 5, content: 'When to use FA vs TA and how to combine them.' },
                  { title: 'Crypto Scams & Security', type: 'video', duration: '22 min', order: 6, content: 'How to avoid phishing, pump-and-dump, rug pulls, and keep your crypto safe.' },
                ],
              },
            },
            {
              title: 'Phase 2: Technical Analysis',
              order: 1,
              lessons: {
                create: [
                  { title: 'Support & Resistance', type: 'video', duration: '18 min', order: 0, content: 'Identify key support and resistance levels — the foundation of all technical analysis.' },
                  { title: 'Moving Averages (SMA, EMA)', type: 'video', duration: '16 min', order: 1, content: 'Simple and exponential moving averages — golden cross and death cross strategies.' },
                  { title: 'RSI & MACD Indicators', type: 'video', duration: '20 min', order: 2, content: 'RSI overbought/oversold, divergence, MACD crossovers, and histogram analysis.' },
                  { title: 'Bollinger Bands & Fibonacci', type: 'video', duration: '18 min', order: 3, content: 'Volatility bands, squeeze setups, and Fibonacci retracement levels (38.2%, 50%, 61.8%).' },
                  { title: 'Candlestick Patterns', type: 'video', duration: '25 min', order: 4, content: 'Hammer, engulfing, doji, morning star, shooting star — single, double, and triple patterns.' },
                  { title: 'Chart Patterns', type: 'video', duration: '22 min', order: 5, content: 'Head and shoulders, triangles, flags, cup and handle — continuation and reversal patterns.' },
                  { title: 'Volume Analysis', type: 'video', duration: '14 min', order: 6, content: 'How volume confirms breakouts, divergence, and price moves.' },
                  { title: 'Multi-Timeframe Analysis', type: 'video', duration: '16 min', order: 7, content: 'Using higher timeframe for trend, lower for entry — the MTA framework.' },
                  { title: 'Building a Trading Plan', type: 'text', duration: '12 min', order: 8, content: 'Create a complete trading plan — entry rules, risk management, and journaling.' },
                ],
              },
            },
            {
              title: 'Phase 3: Advanced Strategies & SMC',
              order: 2,
              lessons: {
                create: [
                  { title: 'Risk Management (The 2% Rule)', type: 'video', duration: '20 min', order: 0, content: 'Position sizing, risk per trade, risk-reward ratios — the most important lesson.' },
                  { title: 'Trading Psychology', type: 'video', duration: '18 min', order: 1, content: 'FOMO, revenge trading, greed — how to control emotions and stay disciplined.' },
                  { title: 'Market Structure (HH/HL, LH/LL)', type: 'video', duration: '16 min', order: 2, content: 'Higher highs and higher lows — identifying trend direction and structure.' },
                  { title: 'BOS & CHOCH (Structure Breaks)', type: 'video', duration: '14 min', order: 3, content: 'Break of Structure and Change of Character — trend reversal signals.' },
                  { title: 'Order Blocks', type: 'video', duration: '18 min', order: 4, content: 'Institutional order blocks — where smart money enters the market.' },
                  { title: 'FVG (Fair Value Gap)', type: 'video', duration: '16 min', order: 5, content: 'Identifying and trading fair value gaps and imbalances.' },
                  { title: 'Liquidity Concepts', type: 'video', duration: '18 min', order: 6, content: 'Liquidity pools, sweeps, stop hunts — how smart money hunts stop losses.' },
                  { title: 'Leverage & Margin Trading', type: 'video', duration: '22 min', order: 7, content: 'Understanding leverage, liquidation, and when to use margin.' },
                  { title: 'Futures & Perpetual Contracts', type: 'video', duration: '20 min', order: 8, content: 'Perpetual swaps, funding rates, and futures trading strategies.' },
                  { title: 'Advanced Strategies', type: 'video', duration: '25 min', order: 9, content: 'Scalping, swing trading, position trading, DCA — choosing the right strategy for your style.' },
                ],
              },
            },
          ],
        },
      },
    }),

    ensureCourse({
      data: {
        title: 'Forex Trading Fundamentals',
        description: 'Complete forex trading course — from currency pairs to advanced strategies. Learn pip calculations, lot sizing, and forex-specific analysis techniques.',
        level: 'beginner',
        price: 0,
        isPublished: true,
        duration: '6 weeks',
        rating: 4.7,
        studentCount: 0,
        modules: {
          create: [
            {
              title: 'Forex Basics',
              order: 0,
              lessons: {
                create: [
                  { title: 'What is Forex?', type: 'video', duration: '14 min', order: 0, content: 'The foreign exchange market — how currency pairs work and why it is the largest market.' },
                  { title: 'Major Currency Pairs', type: 'video', duration: '12 min', order: 1, content: 'EUR/USD, GBP/USD, USD/JPY — understanding the most traded pairs.' },
                  { title: 'Pips & Lot Sizes', type: 'video', duration: '15 min', order: 2, content: 'Calculating pip values, position sizing for forex, and understanding leverage.' },
                ],
              },
            },
            {
              title: 'Forex Analysis',
              order: 1,
              lessons: {
                create: [
                  { title: 'Fundamental Analysis for Forex', type: 'video', duration: '18 min', order: 0, content: 'Interest rates, economic indicators, central bank policies — how they move currency prices.' },
                  { title: 'Technical Analysis for Forex', type: 'video', duration: '16 min', order: 1, content: 'Applying TA to forex — support/resistance, trends, and indicators for currency trading.' },
                ],
              },
            },
          ],
        },
      },
    }),

    ensureCourse({
      data: {
        title: 'Advanced Trading Strategies',
        description: 'Professional-level trading strategies — price action, SMC, algorithmic approaches, and advanced risk management techniques.',
        level: 'advanced',
        price: 49,
        isPublished: true,
        duration: '8 weeks',
        rating: 4.8,
        studentCount: 0,
        modules: {
          create: [
            {
              title: 'Smart Money Concepts',
              order: 0,
              lessons: {
                create: [
                  { title: 'Market Structure Deep Dive', type: 'video', duration: '20 min', order: 0, content: 'Advanced market structure — BOS, CHOCH, MSB, and liquidity concepts.' },
                  { title: 'Order Block Trading', type: 'video', duration: '22 min', order: 1, content: 'Identifying and trading buy/sell order blocks with mitigation.' },
                  { title: 'FVG + OB Confluence', type: 'video', duration: '18 min', order: 2, content: 'Combining fair value gaps with order blocks for high-probability setups.' },
                ],
              },
            },
            {
              title: 'Advanced Techniques',
              order: 1,
              lessons: {
                create: [
                  { title: 'Scalping Strategies', type: 'video', duration: '25 min', order: 0, content: 'Fast-paced scalping techniques for short timeframes. Quick entries and exits.' },
                  { title: 'Swing Trading Blueprint', type: 'video', duration: '22 min', order: 1, content: 'Holding positions for days — structure-based swing trading with higher RR ratios.' },
                  { title: 'Algorithmic Trading Concepts', type: 'video', duration: '28 min', order: 2, content: 'Backtesting, automation, and building your own trading system.' },
                ],
              },
            },
          ],
        },
      },
    }),
  ])

  if (courseCount > 0) {
    return c.json({ message: 'Data already seeded', courses: courseCount })
  }

  // Create instructor
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@tradeed.com' },
    update: {},
    create: {
      email: 'instructor@tradeed.com',
      name: 'Alex Morgan',
      role: 'instructor',
    },
  })

  // Create courses with modules and lessons
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'Trading Foundations',
        description: 'Master the fundamentals of trading. Learn to read charts, understand market structure, and develop your first profitable strategy.',
        level: 'beginner',
        price: 0,
        isPublished: true,
        duration: '4 weeks',
        rating: 4.8,
        studentCount: 3240,
        modules: {
          create: [
            {
              title: 'Introduction to Markets',
              order: 0,
              lessons: {
                create: [
                  { title: 'What is Trading?', type: 'video', duration: '12 min', order: 0, content: 'Trading is the act of buying and selling financial instruments — stocks, currencies, commodities, or derivatives — with the goal of generating profit. Unlike long-term investing, trading typically involves shorter holding periods and relies on technical analysis, market timing, and risk management.\n\nIn this lesson, we explore the different types of markets and instruments available to traders.' },
                  { title: 'Stock Market Basics', type: 'video', duration: '18 min', order: 1, content: 'The stock market is a marketplace where shares of publicly traded companies are bought and sold. Understanding how exchanges work, what moves stock prices, and the difference between bulls and bears is essential foundation knowledge.' },
                  { title: 'Forex & Commodities', type: 'video', duration: '15 min', order: 2, content: 'The foreign exchange (forex) market is the largest financial market in the world, with daily trading volumes exceeding $6 trillion. Commodities like gold, oil, and agricultural products offer additional diversification.' },
                ],
              },
            },
            {
              title: 'Chart Reading 101',
              order: 1,
              lessons: {
                create: [
                  { title: 'Candlestick Patterns', type: 'video', duration: '20 min', order: 0, content: 'Japanese candlesticks are the most popular chart type for traders. Each candle shows the open, high, low, and close for a specific time period. Learning to read candlestick patterns helps you understand market sentiment.' },
                  { title: 'Support & Resistance', type: 'video', duration: '16 min', order: 1, content: 'Support and resistance levels are horizontal zones where buying or selling pressure tends to concentrate. These levels form the foundation of almost every trading strategy.' },
                  { title: 'Volume Analysis', type: 'text', duration: '10 min', order: 2, content: 'Volume tells you how much of an asset was traded in a given period. High volume confirms trends, while low volume suggests weakness. Learn to use volume as a confirmation tool.' },
                ],
              },
            },
            {
              title: 'Your First Strategy',
              order: 2,
              lessons: {
                create: [
                  { title: 'Moving Average Crossover', type: 'video', duration: '22 min', order: 0, content: 'The moving average crossover strategy is one of the simplest and most popular strategies for beginners. When a short-term moving average crosses above a long-term moving average, it generates a buy signal (golden cross). The reverse is a sell signal (death cross).' },
                  { title: 'Setting Up Your Chart', type: 'video', duration: '14 min', order: 1, content: 'Now it\'s time to apply what you\'ve learned. Follow along as we set up a TradingView chart with the exact indicators and layout used in the crossover strategy.' },
                  { title: 'Strategy Quiz', type: 'quiz', duration: '10 min', order: 2 },
                ],
              },
            },
          ],
        },
      },
    }),

    prisma.course.create({
      data: {
        title: 'Technical Analysis Mastery',
        description: 'Deep dive into technical indicators, chart patterns, and price action strategies used by professional traders.',
        level: 'intermediate',
        price: 49,
        isPublished: true,
        duration: '6 weeks',
        rating: 4.7,
        studentCount: 1850,
        modules: {
          create: [
            {
              title: 'Advanced Indicators',
              order: 0,
              lessons: {
                create: [
                  { title: 'RSI Deep Dive', type: 'video', duration: '25 min', order: 0, content: 'The Relative Strength Index (RSI) measures the speed and magnitude of price changes. Learn to identify overbought/oversold conditions, divergences, and how to combine RSI with other indicators.' },
                  { title: 'MACD Strategies', type: 'video', duration: '22 min', order: 1, content: 'Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator. Master signal line crossovers, histogram analysis, and divergence trading.' },
                  { title: 'Bollinger Bands', type: 'video', duration: '18 min', order: 2, content: 'Bollinger Bands consist of a middle band (SMA) and two outer bands (standard deviations). They expand and contract with volatility, creating tradeable patterns.' },
                ],
              },
            },
            {
              title: 'Chart Patterns',
              order: 1,
              lessons: {
                create: [
                  { title: 'Head & Shoulders', type: 'video', duration: '20 min', order: 0, content: 'The head and shoulders pattern is one of the most reliable reversal patterns. Learn to identify the formation, calculate price targets, and manage risk.' },
                  { title: 'Triangles & Wedges', type: 'video', duration: '18 min', order: 1, content: 'Ascending, descending, and symmetrical triangles — along with rising and falling wedges — are consolidation patterns that typically resolve with a breakout in the direction of the prior trend.' },
                ],
              },
            },
            {
              title: 'Price Action Trading',
              order: 2,
              lessons: {
                create: [
                  { title: 'Key Levels & Zones', type: 'video', duration: '24 min', order: 0, content: 'Price action traders rely on reading raw price movement rather than indicators. Learn to identify and trade from key support and resistance zones using candlestick formations.' },
                  { title: 'Trend Line Strategies', type: 'video', duration: '16 min', order: 1, content: 'Trend lines connect higher lows (uptrend) or lower highs (downtrend). Master drawing accurate trend lines and trading breakouts and bounces.' },
                ],
              },
            },
          ],
        },
      },
    }),

    prisma.course.create({
      data: {
        title: 'Risk Management & Psychology',
        description: 'The most important course for any trader. Learn position sizing, stop losses, and the psychological discipline needed for consistent profitability.',
        level: 'beginner',
        price: 0,
        isPublished: true,
        duration: '3 weeks',
        rating: 4.9,
        studentCount: 4120,
        modules: {
          create: [
            {
              title: 'Risk Management Fundamentals',
              order: 0,
              lessons: {
                create: [
                  { title: 'The 2% Rule', type: 'video', duration: '14 min', order: 0, content: 'Never risk more than 2% of your account on a single trade. This is the golden rule of risk management that protects you from catastrophic losses. Learn how to calculate position sizes based on your risk tolerance.' },
                  { title: 'Stop Loss Strategies', type: 'video', duration: '18 min', order: 1, content: 'A stop loss is your safety net. Learn the difference between fixed stops, trailing stops, and time-based stops. Understand where to place stops based on market structure rather than arbitrary percentages.' },
                  { title: 'Risk-Reward Ratios', type: 'video', duration: '12 min', order: 2, content: 'Always aim for at least a 1:2 risk-reward ratio. This means for every $1 you risk, you aim to make $2. Even with a 50% win rate, this mathematical edge leads to profitability over time.' },
                ],
              },
            },
            {
              title: 'Trading Psychology',
              order: 1,
              lessons: {
                create: [
                  { title: 'Managing Emotions', type: 'video', duration: '20 min', order: 0, content: 'Fear and greed are every trader\'s worst enemies. Learn to recognize emotional triggers, develop routines that keep you disciplined, and build a trading plan that removes emotions from decision-making.' },
                  { title: 'Dealing with Losses', type: 'video', duration: '16 min', order: 1, content: 'Every trader takes losses. The difference between successful and unsuccessful traders is how they handle them. Learn to view losses as the cost of doing business, not personal failures.' },
                  { title: 'Building Discipline', type: 'text', duration: '8 min', order: 2, content: 'Discipline is the bridge between goals and accomplishment. A well-defined trading plan executed with consistency will always outperform impulsive decisions, no matter how smart you are.' },
                ],
              },
            },
          ],
        },
      },
    }),

    prisma.course.create({
      data: {
        title: 'Options Trading Masterclass',
        description: 'Comprehensive options education covering calls, puts, spreads, and advanced strategies for income generation and hedging.',
        level: 'advanced',
        price: 99,
        isPublished: true,
        duration: '8 weeks',
        rating: 4.6,
        studentCount: 920,
        modules: {
          create: [
            {
              title: 'Options Fundamentals',
              order: 0,
              lessons: {
                create: [
                  { title: 'Calls & Puts Explained', type: 'video', duration: '25 min', order: 0, content: 'Options give you the right, but not the obligation, to buy (call) or sell (put) an asset at a predetermined price before a specific date. Understand the mechanics of options contracts.' },
                  { title: 'The Greeks', type: 'video', duration: '30 min', order: 1, content: 'Delta, Gamma, Theta, Vega, and Rho — these are the metrics that drive options pricing. Understanding how each Greek affects your position is essential for options trading.' },
                ],
              },
            },
            {
              title: 'Spread Strategies',
              order: 1,
              lessons: {
                create: [
                  { title: 'Vertical Spreads', type: 'video', duration: '22 min', order: 0, content: 'Vertical spreads involve buying and selling options of the same type and expiration but different strikes. They limit both risk and reward while reducing cost basis.' },
                  { title: 'Iron Condors', type: 'video', duration: '28 min', order: 1, content: 'The iron condor is a popular neutral strategy that profits when the underlying stays within a range. It combines a bull put spread with a bear call spread.' },
                ],
              },
            },
          ],
        },
      },
    }),

    prisma.course.create({
      data: {
        title: 'Algorithmic Trading Concepts',
        description: 'Introduction to systematic and algorithmic trading. Learn the concepts behind quantitative strategies without needing to code.',
        level: 'advanced',
        price: 149,
        isPublished: true,
        duration: '6 weeks',
        rating: 4.5,
        studentCount: 640,
        modules: {
          create: [
            {
              title: 'Quantitative Foundations',
              order: 0,
              lessons: {
                create: [
                  { title: 'What is Algo Trading?', type: 'video', duration: '18 min', order: 0, content: 'Algorithmic trading uses computer programs to execute trades based on predefined criteria. It removes human emotion and can process market data much faster than manual trading.' },
                  { title: 'Backtesting Basics', type: 'video', duration: '24 min', order: 1, content: 'Before risking real money, test your strategy on historical data. Learn about backtesting frameworks, common pitfalls like overfitting, and how to evaluate strategy performance.' },
                ],
              },
            },
          ],
        },
      },
    }),

    prisma.course.create({
      data: {
        title: 'Day Trading Intensive',
        description: 'Fast-paced strategies for active day traders. Learn to scalp, momentum trade, and manage positions intraday.',
        level: 'intermediate',
        price: 79,
        isPublished: true,
        duration: '4 weeks',
        rating: 4.7,
        studentCount: 1340,
        modules: {
          create: [
            {
              title: 'Day Trading Setup',
              order: 0,
              lessons: {
                create: [
                  { title: 'Choosing a Broker', type: 'video', duration: '15 min', order: 0, content: 'Not all brokers are created equal for day traders. Learn what to look for in commissions, execution speed, platform features, and margin requirements.' },
                  { title: 'Pre-Market Routine', type: 'video', duration: '20 min', order: 1, content: 'Successful day traders prepare before the market opens. Develop a pre-market routine that includes scanning for setups, reviewing overnight news, and planning your day.' },
                ],
              },
            },
          ],
        },
      },
    }),
  ])


  // Create live sessions
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(14, 0, 0, 0)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 5)
  nextWeek.setHours(18, 0, 0, 0)

  const nextMonth = new Date()
  nextMonth.setDate(nextMonth.getDate() + 12)
  nextMonth.setHours(15, 0, 0, 0)

  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  lastWeek.setHours(16, 0, 0, 0)

  await Promise.all([
    prisma.liveSession.create({
      data: {
        title: 'Live Market Analysis',
        description: 'Weekly market analysis and live trading setups',
        date: tomorrow,
        duration: '1.5 hours',
        meetLink: 'https://meet.example.com/trading',
        courseId: courses[0].id,
        instructorId: instructor.id,
      },
    }),
    prisma.liveSession.create({
      data: {
        title: 'Options Strategy Workshop',
        description: 'Hands-on workshop building iron condors and vertical spreads',
        date: nextWeek,
        duration: '2 hours',
        courseId: courses[3].id,
        instructorId: instructor.id,
      },
    }),
    prisma.liveSession.create({
      data: {
        title: 'Q&A Session: Ask a Pro Trader',
        description: 'Bring your questions about any trading topic',
        date: nextMonth,
        duration: '1 hour',
        instructorId: instructor.id,
      },
    }),
    prisma.liveSession.create({
      data: {
        title: 'Technical Analysis Review',
        description: 'Review of last week\'s chart patterns and trade setups',
        date: lastWeek,
        duration: '1 hour',
        courseId: courses[1].id,
        instructorId: instructor.id,
      },
    }),
  ])

  return c.json({ message: 'Seed data created', courses: courses.length })
})

// Dashboard data endpoint
app.get('/dashboard', async (c) => {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        include: { lessons: true },
        orderBy: { order: 'asc' },
      },
      sessions: {
        orderBy: { date: 'asc' },
        include: { instructor: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const sessions = await prisma.liveSession.findMany({
    orderBy: { date: 'asc' },
    include: { instructor: true, course: true },
  })

  return c.json({ courses, sessions })
})

// Course detail endpoint
app.get('/courses/:id/detail', async (c) => {
  const { id } = c.req.param()
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: { lessons: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) {
    return c.json({ error: 'Course not found' }, 404)
  }

  return c.json(course)
})

// ========== AUTH ENDPOINTS ==========

function toHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return toHex(digest)
}

async function pbkdf2Hex(password: string, saltHex: string, iterations: number): Promise<string> {
  const salt = new Uint8Array((saltHex.match(/.{2}/g) || []).map((h) => parseInt(h, 16)))
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  return toHex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256))
}

async function hashPassword(password: string): Promise<string> {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${await pbkdf2Hex(password, salt, PBKDF2_ITERATIONS)}`
}

async function verifyPassword(password: string, stored: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (!stored) return { ok: false, needsRehash: false }
  if (stored.startsWith('pbkdf2$')) {
    const [, iterations, salt, expected] = stored.split('$')
    const actual = await pbkdf2Hex(password, salt, Number(iterations) || PBKDF2_ITERATIONS)
    return { ok: actual === expected, needsRehash: false }
  }
  const ok = (await sha256(password)) === stored
  return { ok, needsRehash: ok }
}

// Student signup — stores email, name, hashed password in DB
app.post('/auth/signup', async (c) => {
  const body = await c.req.json()
  const { email, password, name } = body

  if (!email || !password || !name) {
    return c.json({ error: 'Name, email, and password are required' }, 400)
  }

  if (password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return c.json({ error: 'An account with this email already exists' }, 409)
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email, name, passwordHash, role: 'student' },
  })

  await issueStudentSession(c, user.id)
  return c.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan } })
})

// Student login — validates email/password against DB
app.post('/auth/login', async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordHash) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const verification = await verifyPassword(password, user.passwordHash || '')
  if (!verification.ok) return c.json({ error: 'Invalid email or password' }, 401)
  if (verification.needsRehash) await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } })
  await issueStudentSession(c, user.id)
  return c.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: effectivePlanOf(user) },
  })
})

app.get('/auth/me', async (c) => {
  const user = await getAuthenticatedUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)
  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: effectivePlanOf(user),
      planExpiresAt: (user as any).planExpiresAt || null,
    },
  })
})

app.post('/auth/logout', async (c) => {
  const token = readSession(c)
  if (token) {
    await prisma.studentSession.updateMany({ where: { tokenHash: await sha256(token), revokedAt: null }, data: { revokedAt: new Date() } })
  }
  c.header('Set-Cookie', sessionCookie('', true))
  return c.json({ ok: true })
})

// Forgot password — generates a single-use token without disclosing it by default.
app.post('/auth/forgot-password', async (c) => {
  const body = await c.req.json()
  const { email } = body

  if (!email) {
    return c.json({ error: 'Email is required' }, 400)
  }

  // Check if user exists (admin email or student in DB)
  const adminEmail = process.env.ADMIN_EMAIL
  const isAdmin = email === adminEmail
  const studentUser = await prisma.user.findUnique({ where: { email } })

  // The response below is byte-for-byte identical whether or not the email
  // exists, so this endpoint cannot be used to enumerate registered accounts.
  const genericResponse = {
    ok: true,
    message: 'If an account exists for that email, a reset link has been generated. Contact support if you do not receive it.',
  }

  if (!isAdmin && !studentUser) {
    return c.json(genericResponse)
  }

  // Invalidate any previous tokens for this email
  await prisma.passwordResetToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  })

  // Generate a secure reset token (expires in 1 hour)
  const token = toHex(crypto.getRandomValues(new Uint8Array(24)))
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  })

  // Deliver the token by email. `sendEmail` never throws: if no provider is
  // configured, or the provider rejects the message, the HTTP response below is
  // still the generic one. That is intentional — an email failure must not tell
  // a stranger whether the address has an account.
  if (!isValidEmail(email)) {
    console.warn('[forgot-password] stored a reset token for a malformed address; not attempting delivery')
  } else {
    const message = passwordResetEmail(email, token)
    const result = await sendEmail({ to: email, ...message })
    if (result.ok) {
      console.log(`[forgot-password] reset email sent via ${result.provider}`)
    } else if (result.skipped) {
      console.warn(`[forgot-password] email NOT sent (${result.error}). Reset tokens cannot reach the user until a provider is configured — see README → "Email delivery".`)
    } else {
      console.error(`[forgot-password] email delivery failed (${result.error})`)
    }
  }

  // ALLOW_TOKEN_IN_RESPONSE is a local-development / owner-recovery escape hatch
  // only. Returning the token to the browser lets any visitor reset any account
  // simply by requesting a reset and reading the token out of the response, so
  // production must leave this unset now that email delivery exists.
  const expose = String(process.env.ALLOW_TOKEN_IN_RESPONSE || '').toLowerCase() === 'true'
  return c.json(expose ? { ...genericResponse, resetToken: token, expiresAt: expiresAt.toISOString() } : genericResponse)
})

// Reset password — validates token and sets new password
app.post('/auth/reset-password', async (c) => {
  const body = await c.req.json()
  const { token, newPassword } = body

  if (!token || !newPassword) {
    return c.json({ error: 'Token and new password are required' }, 400)
  }

  if (newPassword.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400)
  }

  const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token } })

  if (!resetRecord || resetRecord.used || new Date() > resetRecord.expiresAt) {
    return c.json({ error: 'Invalid or expired reset token' }, 400)
  }

  // Mark token as used
  await prisma.passwordResetToken.update({
    where: { id: resetRecord.id },
    data: { used: true },
  })

  const passwordHash = await hashPassword(newPassword)
  const adminEmail = process.env.ADMIN_EMAIL
  const isAdmin = resetRecord.email === adminEmail

  let resetUserId: string | null = null
  if (isAdmin) {
    // The admin password is defined by ADMIN_PASSWORD in the environment, not
    // by a database row. There is nothing safe to write here, so the reset is
    // recorded but the effective credential is unchanged — the owner must
    // update ADMIN_PASSWORD directly so a reset can never silently override it.
    const adminUser = await prisma.user.findUnique({ where: { email: resetRecord.email } })
    resetUserId = adminUser?.id || null
  } else {
    // Update student password in DB
    const updated = await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash },
    })
    resetUserId = updated.id
  }

  // Changing a password must end every session that was opened with the old
  // one, otherwise a stolen session keeps working after the victim resets.
  if (resetUserId) {
    await prisma.studentSession.updateMany({
      where: { userId: resetUserId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }
  await prisma.adminSession.updateMany({
    where: { email: resetRecord.email, revokedAt: null },
    data: { revokedAt: new Date() },
  })

  if (isAdmin) {
    return c.json({ ok: true, message: 'Your request has been recorded. Because the admin password is configured on the server, please contact the site owner to complete the change.' })
  }

  return c.json({ ok: true, message: 'Password has been reset successfully. You can now sign in with your new password.' })
})

// ========== ADMIN AUTH ==========

// ========== ADMIN SESSIONS (DB-backed, expiring, revocable) ==========
// Previously admin sessions lived in an in-memory Map keyed by a random UUID:
// every session was lost on restart and the map grew without bound. They are
// now persisted with a hashed 256-bit token and an explicit expiry, so they
// survive restarts and can be revoked.
const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

/**
 * Constant-time string comparison. `a !== b` short-circuits on the first
 * differing byte, which leaks how much of a secret the caller guessed. Used
 * for the admin credentials so a wrong password cannot be probed by timing.
 */
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const ab = enc.encode(a)
  const bb = enc.encode(b)
  let diff = ab.length ^ bb.length
  const len = Math.max(ab.length, bb.length)
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0)
  }
  return diff === 0
}

/**
 * Normalise a credential that was pasted into a hosting dashboard or a `.env`
 * file, so an invisible character cannot cause a login failure.
 *
 * A stray trailing newline, a leading space, a byte-order mark or a pair of
 * wrapping quotes are invisible in the Vercel UI but break an exact string
 * comparison — which is why the settings can look correct while the login is
 * still rejected. Trimming only removes whitespace, so it cannot turn a wrong
 * password into a right one. Mirrors `cleanEnv` in api/index.ts.
 */
function cleanEnv(value: unknown): string {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^["']|["']$/g, '')
    .trim()
}

async function createAdminSession(email: string): Promise<string> {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)))
  await prisma.adminSession.create({
    data: {
      tokenHash: await sha256(token),
      email,
      expiresAt: new Date(Date.now() + ADMIN_SESSION_TTL_MS),
    },
  })
  return token
}

async function verifyAdminSession(token: string): Promise<boolean> {
  if (!token) return false
  try {
    const session = await prisma.adminSession.findUnique({ where: { tokenHash: await sha256(token) } })
    if (!session || session.revokedAt) return false
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      await prisma.adminSession.updateMany({ where: { id: session.id, revokedAt: null }, data: { revokedAt: new Date() } })
      return false
    }
    return true
  } catch {
    return false
  }
}

async function destroyAdminSession(token: string) {
  if (!token) return
  try {
    await prisma.adminSession.updateMany({
      where: { tokenHash: await sha256(token), revokedAt: null },
      data: { revokedAt: new Date() },
    })
  } catch { /* best effort */ }
}

// Admin login — validates email/password against the environment, returns session token
app.post('/admin/auth', async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  // Both sides are cleaned so an invisible newline or a wrapping quote that came
  // in with a paste cannot cause a failure that is impossible to see.
  const adminEmail = cleanEnv(process.env.ADMIN_EMAIL)
  const adminPassword = cleanEnv(process.env.ADMIN_PASSWORD)

  // A missing variable and a wrong password used to be the same 401, which made
  // a deployment mistake look like a typo.
  if (!adminEmail || !adminPassword) {
    return c.json(
      { error: 'Admin login is not configured on the server yet. Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment, then restart.' },
      500,
    )
  }

  // The admin account is NOT a database row — it is defined by ADMIN_EMAIL and
  // ADMIN_PASSWORD. Production (api/index.ts) compares only those two values, so
  // local development must do the same or a login that works here can fail there.
  //
  // This block used to auto-accept the login whenever the submitted email matched
  // an existing user row and the password matched that row's hash. Because the row
  // hash was a different algorithm from this function, a stale row for the admin
  // email silently defeated the real check. Removed deliberately: one code path,
  // one source of truth.
  const submittedEmail = String(email).trim().toLowerCase()
  const submittedPassword = String(password)
  const emailOk = safeEqual(submittedEmail, adminEmail.trim().toLowerCase())
  const passOk = safeEqual(submittedPassword, adminPassword)

  if (!emailOk || !passOk) {
    // Which field failed and how long each side is — never the values themselves.
    console.warn(
      `[admin-auth] rejected: emailMatch=${emailOk} passwordMatch=${passOk} ` +
      `emailLenSubmitted=${submittedEmail.length} emailLenConfigured=${adminEmail.length} ` +
      `passwordLenSubmitted=${submittedPassword.length} passwordLenConfigured=${adminPassword.length}`,
    )
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const token = await createAdminSession(adminEmail)
  return c.json({ ok: true, token, email: adminEmail })
})

// Admin logout — revokes the session
app.post('/admin/logout', async (c) => {
  const token = c.req.header('x-admin-token')
  if (token) await destroyAdminSession(token)
  return c.json({ ok: true })
})

// ========== ADMIN ROUTES ==========

// Admin auth check — verifies session token
app.use('/admin/*', async (c, next) => {
  const token = c.req.header('x-admin-token')
  if (!token || !(await verifyAdminSession(token))) {
    return c.json({ error: 'Forbidden: valid admin session required' }, 403)
  }
  await next()
})

// Admin: get all courses (including unpublished)
app.get('/admin/courses', async (c) => {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: { lessons: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return c.json(courses)
})

// Admin: create course
app.post('/admin/courses', async (c) => {
  const body = await c.req.json()
  const course = await prisma.course.create({
    data: {
      title: body.title,
      description: body.description,
      level: body.level || 'beginner',
      price: body.price || 0,
      duration: body.duration || '',
      isPublished: body.isPublished ?? false,
      thumbnail: body.thumbnail || null,
    },
  })
  return c.json(course, 201)
})

// Admin: update course
app.patch('/admin/courses/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const course = await prisma.course.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.level !== undefined && { level: body.level }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.duration !== undefined && { duration: body.duration }),
      ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
    },
  })
  return c.json(course)
})

// Admin: delete course
app.delete('/admin/courses/:id', async (c) => {
  const { id } = c.req.param()
  await prisma.course.delete({ where: { id } })
  return c.json({ ok: true })
})

// Admin: create module
app.post('/admin/courses/:courseId/modules', async (c) => {
  const { courseId } = c.req.param()
  const body = await c.req.json()
  const maxOrder = await prisma.module.findFirst({
    where: { courseId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })
  const module = await prisma.module.create({
    data: {
      title: body.title,
      description: body.description || '',
      order: (maxOrder?.order ?? -1) + 1,
      courseId,
    },
  })
  return c.json(module, 201)
})

// Admin: update module
app.patch('/admin/modules/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const module = await prisma.module.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.order !== undefined && { order: body.order }),
    },
  })
  return c.json(module)
})

// Admin: delete module
app.delete('/admin/modules/:id', async (c) => {
  const { id } = c.req.param()
  await prisma.module.delete({ where: { id } })
  return c.json({ ok: true })
})

// Admin: create lesson
app.post('/admin/modules/:moduleId/lessons', async (c) => {
  const { moduleId } = c.req.param()
  const body = await c.req.json()
  const maxOrder = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })
  const lesson = await prisma.lesson.create({
    data: {
      title: body.title,
      content: body.content || '',
      videoUrl: body.videoUrl || '',
      duration: body.duration || '',
      type: body.type || 'video',
      order: (maxOrder?.order ?? -1) + 1,
      moduleId,
    },
  })
  return c.json(lesson, 201)
})

// Admin: update lesson
app.patch('/admin/lessons/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
      ...(body.duration !== undefined && { duration: body.duration }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.order !== undefined && { order: body.order }),
    },
  })
  return c.json(lesson)
})

// Admin: delete lesson
app.delete('/admin/lessons/:id', async (c) => {
  const { id } = c.req.param()
  await prisma.lesson.delete({ where: { id } })
  return c.json({ ok: true })
})

// Admin: create live session
app.post('/admin/sessions', async (c) => {
  const body = await c.req.json()
  // Get or create an instructor user
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@tradeed.com' },
    update: {},
    create: {
      email: 'instructor@tradeed.com',
      name: 'Alex Morgan',
      role: 'instructor',
    },
  })
  const session = await prisma.liveSession.create({
    data: {
      title: body.title,
      description: body.description || '',
      date: new Date(body.date),
      duration: body.duration || '',
      meetLink: body.meetLink || '',
      courseId: body.courseId || null,
      instructorId: instructor.id,
    },
  })
  return c.json(session, 201)
})

// Admin: update live session
app.patch('/admin/sessions/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  const session = await prisma.liveSession.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.date !== undefined && { date: new Date(body.date) }),
      ...(body.duration !== undefined && { duration: body.duration }),
      ...(body.meetLink !== undefined && { meetLink: body.meetLink }),
      ...(body.courseId !== undefined && { courseId: body.courseId || null }),
    },
  })
  return c.json(session)
})

// Admin: delete live session
app.delete('/admin/sessions/:id', async (c) => {
  const { id } = c.req.param()
  await prisma.liveSession.delete({ where: { id } })
  return c.json({ ok: true })
})

// Admin: stats overview
app.get('/admin/stats', async (c) => {
  const [courseCount, lessonCount, studentCount, sessionCount] = await Promise.all([
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.user.count({ where: { role: 'student' } }),
    prisma.liveSession.count(),
  ])
  return c.json({ courseCount, lessonCount, studentCount, sessionCount })
})

// ========== TRADING JOURNAL ==========

// Get journal entries for a user
app.get('/journal', async (c) => {
  const user = await getAuthenticatedUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)

  const entries = await prisma.journalEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  })
  return c.json({ entries })
})

// Create a journal entry
app.post('/journal', async (c) => {
  const user = await getAuthenticatedUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)

  const body = await c.req.json()
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      pair: body.pair || 'BTC/USDT',
      direction: body.direction || 'long',
      entry: parseFloat(body.entry) || 0,
      exit: body.exit ? parseFloat(body.exit) : null,
      stopLoss: body.stopLoss ? parseFloat(body.stopLoss) : null,
      takeProfit: body.takeProfit ? parseFloat(body.takeProfit) : null,
      size: body.size ? parseFloat(body.size) : null,
      setup: body.setup || null,
      notes: body.notes || null,
      pnl: body.pnl ? parseFloat(body.pnl) : null,
    },
  })
  return c.json(entry, 201)
})

// Update a journal entry
app.patch('/journal/:id', async (c) => {
  const { id } = c.req.param()
  const user = await getAuthenticatedUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)
  const owned = await prisma.journalEntry.findFirst({ where: { id, userId: user.id } })
  if (!owned) return c.json({ error: 'Journal entry not found' }, 404)
  const body = await c.req.json()
  const entry = await prisma.journalEntry.update({
    where: { id },
    data: {
      ...(body.pair !== undefined && { pair: body.pair }),
      ...(body.direction !== undefined && { direction: body.direction }),
      ...(body.entry !== undefined && { entry: parseFloat(body.entry) }),
      ...(body.exit !== undefined && { exit: body.exit ? parseFloat(body.exit) : null }),
      ...(body.stopLoss !== undefined && { stopLoss: body.stopLoss ? parseFloat(body.stopLoss) : null }),
      ...(body.takeProfit !== undefined && { takeProfit: body.takeProfit ? parseFloat(body.takeProfit) : null }),
      ...(body.size !== undefined && { size: body.size ? parseFloat(body.size) : null }),
      ...(body.setup !== undefined && { setup: body.setup }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.pnl !== undefined && { pnl: body.pnl ? parseFloat(body.pnl) : null }),
    },
  })
  return c.json(entry)
})

// Delete a journal entry
app.delete('/journal/:id', async (c) => {
  const { id } = c.req.param()
  const user = await getAuthenticatedUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)
  const deleted = await prisma.journalEntry.deleteMany({ where: { id, userId: user.id } })
  if (!deleted.count) return c.json({ error: 'Journal entry not found' }, 404)
  return c.json({ ok: true })
})

// ===== ENROLLMENTS + LESSON PROGRESS (dev parity with api/index.ts) =====
// Mirrors the production routes so dev behaves identically. Both are always
// scoped to the caller's own authenticated session; plan approval is the only
// way a student gains access to a priced course.

async function callerUser(c: any) {
  return getAuthenticatedUser(c)
}

// The caller's own enrollments
app.get('/enrollments', async (c) => {
  const user = await callerUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    select: { id: true, courseId: true, status: true, enrolledAt: true, completedAt: true },
    orderBy: { enrolledAt: 'desc' },
  })
  return c.json({ enrollments })
})

// Enroll the caller in a course (idempotent on the (userId, courseId) unique)
app.post('/enrollments', async (c) => {
  const user = await callerUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)

  const body = await c.req.json().catch(() => ({}))
  const courseId = String((body as any)?.courseId || '').trim()
  if (!courseId) return c.json({ error: 'courseId is required' }, 400)

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) return c.json({ error: 'Course not found' }, 404)

  const courseIsFree = Number((course as any).price || 0) <= 0
  if (!courseIsFree && (await callerPlanRank(c)) < 1) {
    return c.json({ error: 'This course requires a paid plan. Send your fee, then wait for approval.', requiredPlan: 'STARTER' }, 403)
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    create: { userId: user.id, courseId, status: 'active' },
    update: {},
  })
  return c.json({ ok: true, courseId })
})

// The caller's own lesson completion state. courseId is included so the client
// can rebuild its per-course view in one round trip.
app.get('/progress', async (c) => {
  const user = await callerUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)
  const progress = await prisma.progress.findMany({
    where: { userId: user.id },
    select: {
      lessonId: true,
      completed: true,
      completedAt: true,
      lesson: { select: { module: { select: { courseId: true } } } },
    },
  })
  return c.json({
    progress: progress.map((p: any) => ({
      lessonId: p.lessonId,
      courseId: p.lesson?.module?.courseId || null,
      completed: !!p.completed,
      completedAt: p.completedAt,
    })),
  })
})

// Mark one lesson complete/incomplete for the caller
app.post('/progress', async (c) => {
  const user = await callerUser(c)
  if (!user) return c.json({ error: 'Authentication required' }, 401)

  const body = await c.req.json().catch(() => ({}))
  const lessonId = String((body as any)?.lessonId || '').trim()
  if (!lessonId) return c.json({ error: 'lessonId is required' }, 400)
  const completed = (body as any)?.completed === false ? false : true

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson) return c.json({ error: 'Lesson not found' }, 404)

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: { userId: user.id, lessonId, completed, completedAt: completed ? new Date() : null },
    update: { completed, completedAt: completed ? new Date() : null },
  })

  // A course only flips to "completed" when every one of its lessons is done
  // for this specific student, so certificates never overstate progress.
  const courseId = await courseIdOfLesson(lessonId)
  const lessons = courseId
    ? await prisma.lesson.findMany({ where: { module: { courseId } }, select: { id: true } })
    : []
  const done = await prisma.progress.count({
    where: { userId: user.id, completed: true, lessonId: { in: lessons.map((l: { id: string }) => l.id) } },
  })
  const courseDone = lessons.length > 0 && done >= lessons.length

  if (courseId) {
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    })
    if (existing) {
      await prisma.enrollment.update({
        where: { id: existing.id },
        data: { status: courseDone ? 'completed' : 'active', completedAt: courseDone ? new Date() : null },
      })
    }
  }

  return c.json({ ok: true, lessonId, completed, courseCompleted: courseDone })
})

/** Resolves the course a lesson belongs to (lesson -> module -> course). */
async function courseIdOfLesson(lessonId: string): Promise<string | null> {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { moduleId: true } })
  if (!lesson) return null
  const mod = await prisma.module.findUnique({ where: { id: lesson.moduleId }, select: { courseId: true } })
  return mod?.courseId || null
}

// ===== BOOKS (dev parity with api/index.ts) =====
// Paid books live outside public/ so they can be access-controlled. This mirrors
// the production serverless route so local development behaves identically:
// unbundled here (read from books/) to keep the dev transform fast, but gated by
// exactly the same plan check.
const BOOK_PLAN: Record<string, string> = {
  'crypto-intermediate': 'STARTER',
  'crypto-advanced': 'STARTER',
  'smc-book': 'STARTER',
  'forex-book': 'STARTER',
  'price-action': 'STARTER',
  'trading-strategies': 'STARTER',
  'professional-trading': 'STARTER',
  'technical-analysis': 'STARTER',
  'risk-management': 'STARTER',
  'trading-psychology': 'STARTER',
}

const PLAN_RANK: Record<string, number> = { FREE: 0, STARTER: 1, PREMIUM: 2 }
const planRankOf = (plan?: string | null) => PLAN_RANK[String(plan || 'FREE').toUpperCase()] || 0

async function callerPlanRank(c: any): Promise<number> {
  try {
    const user = await getAuthenticatedUser(c)
    if (!user) return 0
    if (user.role === 'admin' || user.role === 'instructor') return 2

    // Expired paid plans degrade to FREE, matching production behavior.
    const expiresAt = (user as any).planExpiresAt
    if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) return 0

    return planRankOf((user as any).plan)
  } catch {
    return 0
  }
}

// Chapters link back with href="../index.html", which no longer resolves from
// /api/books/<id>/<file>. Point it at the site root instead.
const rewriteBookLinks = (html: string) => html.replace(/href=(["'])(?:\.\.\/)+index\.html\1/g, 'href="/"')

app.get('/books', async (c) => c.json({ books: Object.entries(BOOK_PLAN).map(([id, requiredPlan]) => ({ id, requiredPlan })) }))

app.get('/books/:id/:file?', async (c) => {
  const { id, file } = c.req.param()
  const requiredPlan = BOOK_PLAN[id]
  if (!requiredPlan) return c.json({ error: 'Book not found' }, 404)

  const rank = await callerPlanRank(c)
  if (rank < planRankOf(requiredPlan)) {
    return c.html(
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Locked</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0d1b2a;color:#eee;font-family:system-ui;padding:24px">
<div style="max-width:560px;text-align:center;border:3px solid #e0a800;border-radius:20px;padding:44px 32px;background:linear-gradient(145deg,#0d1b2a,#1b263b)">
<h1 style="color:#e0a800;margin:0 0 12px">This book is locked</h1>
<p style="color:#bbb;line-height:1.7">It belongs to the paid library and is not included in your current plan.</p>
<div style="margin-top:18px;background:#00b4d8;color:#062033;font-weight:700;border-radius:10px;padding:10px 20px;display:inline-block">${requiredPlan} PLAN REQUIRED</div>
</div></body></html>`,
      403
    )
  }

  // Only allow plain relative chapter filenames. Reject traversal, absolute
  // paths, sub-directories, and encoded separators so callers cannot escape the
  // book directory even if the route is reached directly.
  const rel = String(file || 'index.html').replace(/^\/+/, '')
  const safeName = /^[A-Za-z0-9._-]+$/.test(rel) && !rel.includes('..') && rel !== '.' && rel !== ''

  if (!safeName) {
    return c.json({ error: 'Chapter not found' }, 404)
  }

  const { readFile } = await import('fs/promises')
  const baseDir = (await import('path')).join(process.cwd(), 'books', id)
  const path = (await import('path')).resolve(baseDir, rel)

  if (!path.startsWith(baseDir + (await import('path')).sep)) {
    return c.json({ error: 'Chapter not found' }, 404)
  }

  try {
    const html = await readFile(path, 'utf8')
    c.header('Content-Type', 'text/html; charset=utf-8')
    c.header('Cache-Control', 'private, no-store')
    return c.body(rewriteBookLinks(html))
  } catch {
    return c.json({ error: 'Chapter not found' }, 404)
  }
})

export default app
