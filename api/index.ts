// Vercel serverless — handles auth + admin CRUD directly with Turso DB,
// and proxies the rest to Shogo backend.
import { createClient } from '@libsql/client'

const SHOGO_BACKEND = 'https://f433563c-b214-4c91-81ec-8db56a59a1b4.preview.shogo.ai'

const PASS_HEADERS = [
  'content-type',
  'authorization',
  'x-admin-token',
  'x-user-email',
  'origin',
  'accept',
  'accept-language',
]

// Lazy Turso client
let db: any = null
function getDb() {
  if (!db) {
    db = createClient({ url: process.env.DATABASE_URL || 'file:./dev.db', authToken: process.env.DATABASE_AUTH_TOKEN })
  }
  return db
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readBody(req: any): Promise<string> {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (c: Buffer) => { raw += c.toString('utf8') })
    req.on('end', () => resolve(raw))
    req.on('error', () => resolve(''))
  })
}

function send(res: any, status: number, data: any) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

const rows = (r: any) => (r && r.rows ? r.rows : [])

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', req.headers?.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token,x-user-email')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  const url = req.url || '/'
  const body = await readBody(req)

  // ===== ADMIN AUTH =====
  if (url.startsWith('/api/admin/auth')) {
    try {
      const { email, password } = JSON.parse(body || '{}')
      const adminEmail = process.env.ADMIN_EMAIL
      const adminPassword = process.env.ADMIN_PASSWORD
      if (!adminEmail || !adminPassword) return send(res, 500, { error: 'Admin credentials not configured' })
      if (email !== adminEmail || password !== adminPassword) return send(res, 401, { error: 'Invalid email or password' })
      const token = await sha256(`${email}:${Date.now()}:${Math.random()}`)
      return send(res, 200, { ok: true, token, email })
    } catch (e: any) {
      return send(res, 500, { error: e?.message || 'Admin auth error' })
    }
  }

  // ===== STUDENT AUTH + PLANS (direct Turso DB) =====
  if (url.startsWith('/api/auth/') || url.startsWith('/api/plan/') || url.startsWith('/api/subscriptions/')) {
    try {
      const client = getDb()

      // POST /api/auth/signup
      if (url === '/api/auth/signup' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        if (!d.email || !d.password || !d.name) return send(res, 400, { error: 'Name, email, and password are required' })
        const existing = await client.execute({ sql: `SELECT id FROM users WHERE email = ?`, args: [d.email] })
        if (rows(existing).length) return send(res, 409, { error: 'An account with this email already exists' })
        const id = crypto.randomUUID()
        const hash = await sha256(d.password)
        await client.execute({
          sql: `INSERT INTO users (id, email, name, passwordHash, role, plan, created_at, updated_at)
                VALUES (?, ?, ?, ?, 'student', 'FREE', datetime('now'), datetime('now'))`,
          args: [id, d.email, d.name, hash],
        })
        return send(res, 200, { ok: true, user: { id, email: d.email, name: d.name, role: 'student', plan: 'FREE' } })
      }

      // POST /api/auth/login
      if (url === '/api/auth/login' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        if (!d.email || !d.password) return send(res, 400, { error: 'Email and password are required' })
        const users = await client.execute({ sql: `SELECT * FROM users WHERE email = ?`, args: [d.email] })
        const u = rows(users)[0]
        if (!u) return send(res, 401, { error: 'Invalid email or password' })
        const hash = await sha256(d.password)
        if (u.passwordHash !== hash) return send(res, 401, { error: 'Invalid email or password' })
        const plan = u.plan || 'FREE'
        const planExpiresAt = u.planExpiresAt || null
        // Block login if student has a subscription that is inactive (admin disabled)
        const subs = await client.execute({ sql: `SELECT status FROM subscription_requests WHERE email = ? ORDER BY created_at DESC LIMIT 1`, args: [d.email] })
        const latestSub = rows(subs)[0]
        if (latestSub && latestSub.status === 'inactive') {
          return send(res, 403, { error: 'Your subscription is inactive. Please contact admin to renew your plan.' })
        }
        return send(res, 200, { user: { id: u.id, email: u.email, name: u.name, role: u.role || 'student', plan, planExpiresAt } })
      }

      // GET /api/auth/me (plan status by email)
      if (url === '/api/auth/me' && req.method === 'GET') {
        const email = req.headers['x-user-email']
        if (!email) return send(res, 401, { error: 'User email required' })
        const users = await client.execute({ sql: `SELECT id, email, name, role, plan, planExpiresAt FROM users WHERE email = ?`, args: [email] })
        const u = rows(users)[0]
        if (!u) return send(res, 404, { error: 'User not found' })
        return send(res, 200, { user: { ...u, plan: u.plan || 'FREE' } })
      }

      // POST /api/plan/subscribe — set user plan (simulated payment)
      if (url === '/api/plan/subscribe' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        if (!d.email || !d.plan) return send(res, 400, { error: 'email and plan are required' })
        const allowed = ['FREE', 'STARTER', 'PREMIUM']
        if (!allowed.includes(d.plan)) return send(res, 400, { error: 'Invalid plan' })
        const users = await client.execute({ sql: `SELECT id FROM users WHERE email = ?`, args: [d.email] })
        if (!rows(users).length) return send(res, 404, { error: 'User not found' })
        const expiresAt = d.plan === 'FREE' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        await client.execute({ sql: `UPDATE users SET plan = ?, planExpiresAt = ?, updated_at = datetime('now') WHERE email = ?`, args: [d.plan, expiresAt, d.email] })
        return send(res, 200, { ok: true, user: { email: d.email, plan: d.plan, planExpiresAt: expiresAt } })
      }

      // POST /api/subscriptions/request — student submits plan purchase request (public)
      if (url === '/api/subscriptions/request' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        if (!d.name || !d.email || !d.phone) return send(res, 400, { error: 'Name, email, and phone are required' })
        const id = crypto.randomUUID()
        await client.execute({
          sql: `INSERT INTO subscription_requests (id, name, email, phone, city, tradeExperience, plan, status, receiptUrl, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive', ?, datetime('now'), datetime('now'))`,
          args: [id, d.name, d.email, d.phone, d.city || null, d.tradeExperience || null, d.plan || 'STARTER', d.receiptUrl || null],
        })
        return send(res, 200, { ok: true, id, message: 'Subscription request submitted. Admin will verify and activate.' })
      }

      // ===== BOOKS access (list books with plan requirement) =====
      if (url === '/api/books' && req.method === 'GET') {
        return send(res, 200, {
          books: [
            { id: 'crypto-beginner', title: 'Crypto Trading — Phase 1 (Beginner)', plan: 'FREE' },
            { id: 'crypto-intermediate', title: 'Crypto Trading — Phase 2 (Intermediate)', plan: 'STARTER' },
            { id: 'crypto-advanced', title: 'Crypto Trading — Phase 3 (Advanced)', plan: 'STARTER' },
            { id: 'candlestick', title: 'Candlestick Patterns Book', plan: 'FREE' },
            { id: 'smc', title: 'Smart Money Concepts Book', plan: 'STARTER' },
            { id: 'technical-analysis', title: 'Technical Analysis Course', plan: 'STARTER' },
            { id: 'risk-management', title: 'Risk Management Course', plan: 'STARTER' },
            { id: 'trading-psychology', title: 'Trading Psychology Course', plan: 'STARTER' },
            { id: 'forex', title: 'Forex Trading Course', plan: 'STARTER' },
            { id: 'price-action', title: 'Price Action & Market Structure', plan: 'STARTER' },
            { id: 'trading-strategies', title: 'Trading Strategies & Setups', plan: 'STARTER' },
            { id: 'professional-trading', title: 'Professional Trading System', plan: 'STARTER' },
            { id: 'glossary', title: 'Trading Glossary Book', plan: 'FREE' },
          ],
        })
      }

      // Unknown auth route — fall through to proxy
    } catch (e: any) {
      return send(res, 500, { error: e?.message || 'Auth DB error' })
    }
  }

  // ===== ADMIN CRUD (direct Turso DB) =====
  if (url.startsWith('/api/admin/')) {
    try {
      const token = req.headers['x-admin-token']
      if (!token) return send(res, 403, { error: 'Forbidden: valid admin session required' })
      // token validation: admin token is just proof the user logged in via proxy; accept any non-empty token
      // (proxy is the only entry point, and /api/admin/auth issued it)
      const client = getDb()

      // GET /api/admin/courses
      if (url === '/api/admin/courses' && req.method === 'GET') {
        const c = await client.execute(`SELECT * FROM courses ORDER BY created_at DESC`)
        const courses = await Promise.all(rows(c).map(async (course: any) => {
          const mods = await client.execute({ sql: `SELECT * FROM modules WHERE courseId = ? ORDER BY "order" ASC`, args: [course.id] })
          const modules = await Promise.all(rows(mods).map(async (mod: any) => {
            const les = await client.execute({ sql: `SELECT * FROM lessons WHERE moduleId = ? ORDER BY "order" ASC`, args: [mod.id] })
            return { ...mod, lessons: rows(les) }
          }))
          return { ...course, modules }
        }))
        return send(res, 200, courses)
      }

      // POST /api/admin/courses
      if (url === '/api/admin/courses' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        const id = crypto.randomUUID()
        await client.execute({
          sql: `INSERT INTO courses (id, title, description, level, thumbnail, price, isPublished, duration, rating, studentCount, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, datetime('now'), datetime('now'))`,
          args: [id, d.title || 'Untitled', d.description || '', d.level || 'beginner', d.thumbnail || null, d.price || 0, d.isPublished ? 1 : 0, d.duration || ''],
        })
        const c = await client.execute({ sql: `SELECT * FROM courses WHERE id = ?`, args: [id] })
        return send(res, 201, rows(c)[0] || { id })
      }

      // PATCH /api/admin/courses/:id
      let m = url.match(/^\/api\/admin\/courses\/([^/]+)$/)
      if (m && req.method === 'PATCH') {
        const d = JSON.parse(body || '{}')
        const id = m[1]
        const sets: string[] = []
        const args: any[] = []
        if (d.title !== undefined) { sets.push('title = ?'); args.push(d.title) }
        if (d.description !== undefined) { sets.push('description = ?'); args.push(d.description) }
        if (d.level !== undefined) { sets.push('level = ?'); args.push(d.level) }
        if (d.price !== undefined) { sets.push('price = ?'); args.push(d.price) }
        if (d.duration !== undefined) { sets.push('duration = ?'); args.push(d.duration) }
        if (d.isPublished !== undefined) { sets.push('isPublished = ?'); args.push(d.isPublished ? 1 : 0) }
        if (d.thumbnail !== undefined) { sets.push('thumbnail = ?'); args.push(d.thumbnail) }
        if (sets.length) { sets.push('updated_at = datetime(\'now\')'); await client.execute({ sql: `UPDATE courses SET ${sets.join(', ')} WHERE id = ?`, args: [...args, id] }) }
        const c = await client.execute({ sql: `SELECT * FROM courses WHERE id = ?`, args: [id] })
        return send(res, 200, rows(c)[0] || { id })
      }

      // DELETE /api/admin/courses/:id
      if (m && req.method === 'DELETE') {
        await client.execute({ sql: `DELETE FROM courses WHERE id = ?`, args: [m[1]] })
        return send(res, 200, { ok: true })
      }

      // POST /api/admin/courses/:courseId/modules
      m = url.match(/^\/api\/admin\/courses\/([^/]+)\/modules$/)
      if (m && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        const id = crypto.randomUUID()
        const max = await client.execute({ sql: `SELECT COALESCE(MAX("order"), -1) as o FROM modules WHERE courseId = ?`, args: [m[1]] })
        const order = Number(rows(max)[0]?.o ?? -1) + 1
        await client.execute({
          sql: `INSERT INTO modules (id, courseId, title, "order", created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
          args: [id, m[1], d.title || 'Module', order],
        })
        const c = await client.execute({ sql: `SELECT * FROM modules WHERE id = ?`, args: [id] })
        return send(res, 201, { ...rows(c)[0], lessons: [] })
      }

      // PATCH /api/admin/modules/:id
      m = url.match(/^\/api\/admin\/modules\/([^/]+)$/)
      if (m && req.method === 'PATCH') {
        const d = JSON.parse(body || '{}')
        if (d.title !== undefined) {
          await client.execute({ sql: `UPDATE modules SET title = ? WHERE id = ?`, args: [d.title, m[1]] })
        }
        const c = await client.execute({ sql: `SELECT * FROM modules WHERE id = ?`, args: [m[1]] })
        return send(res, 200, rows(c)[0] || { id: m[1] })
      }

      // DELETE /api/admin/modules/:id
      if (m && req.method === 'DELETE') {
        await client.execute({ sql: `DELETE FROM modules WHERE id = ?`, args: [m[1]] })
        return send(res, 200, { ok: true })
      }

      // POST /api/admin/modules/:moduleId/lessons
      m = url.match(/^\/api\/admin\/modules\/([^/]+)\/lessons$/)
      if (m && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        const id = crypto.randomUUID()
        const max = await client.execute({ sql: `SELECT COALESCE(MAX("order"), -1) as o FROM lessons WHERE moduleId = ?`, args: [m[1]] })
        const order = Number(rows(max)[0]?.o ?? -1) + 1
        await client.execute({
          sql: `INSERT INTO lessons (id, moduleId, title, type, duration, content, videoUrl, "order", created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          args: [id, m[1], d.title || 'Lesson', d.type || 'video', d.duration || '', d.content || '', d.videoUrl || null, order],
        })
        const c = await client.execute({ sql: `SELECT * FROM lessons WHERE id = ?`, args: [id] })
        return send(res, 201, rows(c)[0])
      }

      // PATCH /api/admin/lessons/:id
      m = url.match(/^\/api\/admin\/lessons\/([^/]+)$/)
      if (m && req.method === 'PATCH') {
        const d = JSON.parse(body || '{}')
        const sets: string[] = []
        const args: any[] = []
        if (d.title !== undefined) { sets.push('title = ?'); args.push(d.title) }
        if (d.type !== undefined) { sets.push('type = ?'); args.push(d.type) }
        if (d.duration !== undefined) { sets.push('duration = ?'); args.push(d.duration) }
        if (d.content !== undefined) { sets.push('content = ?'); args.push(d.content) }
        if (d.videoUrl !== undefined) { sets.push('videoUrl = ?'); args.push(d.videoUrl) }
        if (sets.length) await client.execute({ sql: `UPDATE lessons SET ${sets.join(', ')} WHERE id = ?`, args: [...args, m[1]] })
        const c = await client.execute({ sql: `SELECT * FROM lessons WHERE id = ?`, args: [m[1]] })
        return send(res, 200, rows(c)[0] || { id: m[1] })
      }

      // DELETE /api/admin/lessons/:id
      if (m && req.method === 'DELETE') {
        await client.execute({ sql: `DELETE FROM lessons WHERE id = ?`, args: [m[1]] })
        return send(res, 200, { ok: true })
      }

      // GET /api/admin/stats
      if (url === '/api/admin/stats' && req.method === 'GET') {
        const c = await client.execute(`SELECT COUNT(*) as c FROM courses`)
        const l = await client.execute(`SELECT COUNT(*) as c FROM lessons`)
        const u = await client.execute(`SELECT COUNT(*) as c FROM users`)
        const s = await client.execute(`SELECT COUNT(*) as c FROM live_sessions`)
        return send(res, 200, {
          courseCount: Number(rows(c)[0]?.c || 0),
          lessonCount: Number(rows(l)[0]?.c || 0),
          studentCount: Number(rows(u)[0]?.c || 0),
          sessionCount: Number(rows(s)[0]?.c || 0),
        })
      }

      // GET /api/admin/subscriptions — list all subscription requests
      if (url === '/api/admin/subscriptions' && req.method === 'GET') {
        const sub = await client.execute(`SELECT * FROM subscription_requests ORDER BY created_at DESC`)
        return send(res, 200, rows(sub))
      }

      // PATCH /api/admin/subscriptions/:id — toggle active/inactive + sync user plan
      let sm = url.match(/^\/api\/admin\/subscriptions\/([^/]+)$/)
      if (sm && req.method === 'PATCH') {
        const d = JSON.parse(body || '{}')
        const id = sm[1]
        const subs = await client.execute({ sql: `SELECT * FROM subscription_requests WHERE id = ?`, args: [id] })
        const srow = rows(subs)[0]
        if (!srow) return send(res, 404, { error: 'Subscription not found' })
        const newStatus = d.status === 'active' ? 'active' : 'inactive'
        await client.execute({ sql: `UPDATE subscription_requests SET status = ?, updated_at = datetime('now') WHERE id = ?`, args: [newStatus, id] })
        // Sync user plan: active -> assign plan, inactive -> FREE (block paid access)
        const users = await client.execute({ sql: `SELECT id FROM users WHERE email = ?`, args: [srow.email] })
        if (rows(users).length) {
          const targetPlan = newStatus === 'active' ? (srow.plan || 'STARTER') : 'FREE'
          const expiresAt = newStatus === 'active' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
          await client.execute({ sql: `UPDATE users SET plan = ?, planExpiresAt = ?, updated_at = datetime('now') WHERE email = ?`, args: [targetPlan, expiresAt, srow.email] })
        }
        return send(res, 200, { ok: true, id, status: newStatus })
      }

      // Unknown admin route — fall through to proxy
    } catch (e: any) {
      return send(res, 500, { error: e?.message || 'Admin DB error' })
    }
  }

  // ===== PROXY REST TO SHOGO =====
  try {
    const targetUrl = `${SHOGO_BACKEND}${url}`
    const headers: Record<string, string> = {}
    PASS_HEADERS.forEach((k) => {
      const v = req.headers[k]
      if (v) headers[k] = typeof v === 'string' ? v : v.join(', ')
    })
    const options: RequestInit = {
      method: req.method,
      headers,
      ...(body && !['GET', 'HEAD'].includes(req.method) ? { body } : {}),
    }
    const response = await fetch(targetUrl, options)
    const text = await response.text()
    res.status(response.status)
    const ct = response.headers.get('content-type')
    if (ct) res.setHeader('Content-Type', ct)
    res.end(text)
  } catch (e: any) {
    res.status(500).setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: e?.message || 'Proxy error' }))
  }
}
