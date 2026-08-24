import { Hono } from 'hono'
import { prisma } from './src/lib/db'

const app = new Hono()

// Seed sample data
app.post('/seed', async (c) => {
  // Check if data already exists
  const courseCount = await prisma.course.count()
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

// Simple hash function (SHA-256) for password storage
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Student signup — stores email, name, hashed password in DB
app.post('/auth/signup', async (c) => {
  const body = await c.req.json()
  const { email, password, name } = body

  if (!email || !password || !name) {
    return c.json({ error: 'Name, email, and password are required' }, 400)
  }

  if (password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return c.json({ error: 'An account with this email already exists' }, 409)
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email, name, passwordHash, role: 'student' },
  })

  return c.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
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

  const passwordHash = await hashPassword(password)
  if (passwordHash !== user.passwordHash) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  return c.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// Forgot password — generates a reset token (would send email in production)
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

  if (!isAdmin && !studentUser) {
    // Don't reveal whether the email exists — always return success
    return c.json({ ok: true, message: 'If an account with that email exists, a reset token has been generated.' })
  }

  // Invalidate any previous tokens for this email
  await prisma.passwordResetToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  })

  // Generate a secure reset token (expires in 1 hour)
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: { email, token, expiresAt },
  })

  // In production: send token via email
  // For now: return it in the response so user can copy it
  return c.json({
    ok: true,
    message: 'Reset token generated. In production this would be emailed to you.',
    resetToken: token,
    expiresAt: expiresAt.toISOString(),
  })
})

// Reset password — validates token and sets new password
app.post('/auth/reset-password', async (c) => {
  const body = await c.req.json()
  const { token, newPassword } = body

  if (!token || !newPassword) {
    return c.json({ error: 'Token and new password are required' }, 400)
  }

  if (newPassword.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400)
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

  if (isAdmin) {
    // Update admin password in .env (in production this would update a DB record)
    // For now, store the new admin password hash in the DB User record
    const adminUser = await prisma.user.findUnique({ where: { email: resetRecord.email } })
    if (adminUser) {
      await prisma.user.update({ where: { id: adminUser.id }, data: { passwordHash } })
    } else {
      // Create an admin user record to store the new password
      await prisma.user.create({
        data: { email: resetRecord.email, name: 'Admin', role: 'admin', passwordHash },
      })
    }
  } else {
    // Update student password in DB
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash },
    })
  }

  return c.json({ ok: true, message: 'Password has been reset successfully. You can now sign in with your new password.' })
})

// ========== ADMIN AUTH ==========

// In-memory session store (resets on server restart)
const adminSessions = new Map<string, { email: string; createdAt: number }>()

function createAdminSession(email: string): string {
  const token = crypto.randomUUID()
  adminSessions.set(token, { email, createdAt: Date.now() })
  return token
}

function verifyAdminSession(token: string): boolean {
  const session = adminSessions.get(token)
  if (!session) return false
  // Sessions expire after 24 hours
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    adminSessions.delete(token)
    return false
  }
  return true
}

// Admin login — validates email/password against .env, returns session token
app.post('/admin/auth', async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return c.json({ error: 'Admin credentials not configured on server' }, 500)
  }

  // Check DB first (in case admin password was reset)
  const adminUser = await prisma.user.findUnique({ where: { email } })
  if (adminUser?.passwordHash) {
    const passwordHash = await hashPassword(password)
    if (passwordHash === adminUser.passwordHash) {
      const token = createAdminSession(email)
      return c.json({ ok: true, token, email })
    }
  }

  // Fall back to .env credentials
  if (email !== adminEmail || password !== adminPassword) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const token = createAdminSession(email)
  return c.json({ ok: true, token, email })
})

// Admin logout — invalidates session
app.post('/admin/logout', async (c) => {
  const token = c.req.header('x-admin-token')
  if (token) adminSessions.delete(token)
  return c.json({ ok: true })
})

// ========== ADMIN ROUTES ==========

// Admin auth check — verifies session token
app.use('/admin/*', async (c, next) => {
  const token = c.req.header('x-admin-token')
  if (!token || !verifyAdminSession(token)) {
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

export default app
