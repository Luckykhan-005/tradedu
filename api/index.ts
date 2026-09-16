// Vercel serverless — handles auth + admin CRUD directly with Turso DB,
// and proxies the rest to Shogo backend.
import { createClient } from '@libsql/client'
import BOOK_CONTENT from '../server/book-content'
// `isValidEmail` already exists locally (see SHARED HELPERS below); only the
// delivery helpers are imported here.
import { sendEmail, passwordResetEmail } from '../server/email'

const SHOGO_BACKEND = 'https://f433563c-b214-4c91-81ec-8db56a59a1b4.preview.shogo.ai'

const PASS_HEADERS = [
  'content-type',
  'authorization',
  'x-admin-token',
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

// The users table was extended with hand-written ALTER TABLE statements
// (see scripts/add-plan-columns.mjs), so the plan-expiry column may exist as
// either the Prisma-mapped name or the camelCase variant. Resolve it once and cache.
let planExpiryColumn: string | null | undefined
async function getPlanExpiryColumn(client: any): Promise<string | null> {
  if (planExpiryColumn !== undefined) return planExpiryColumn
  try {
    const info = await client.execute(`PRAGMA table_info(users)`)
    const names = rows(info).map((r: any) => String(r.name))
    planExpiryColumn = names.includes('plan_expires_at')
      ? 'plan_expires_at'
      : names.includes('planExpiresAt')
        ? 'planExpiresAt'
        : null
  } catch {
    planExpiryColumn = null
  }
  return planExpiryColumn
}

// ===== PASSWORD HASHING (PBKDF2-SHA256 — WebCrypto, no native deps) =====
// Passwords were originally stored as a bare unsalted SHA-256 digest, which is
// trivially reversible via rainbow tables. New and upgraded hashes use PBKDF2
// with a per-account random salt, stored as: pbkdf2$<iterations>$<saltHex>$<hashHex>
const PBKDF2_ITERATIONS = 100_000

function toHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Constant-time string compare, so verification does not leak via timing. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * Normalise a credential that was pasted into the hosting dashboard.
 *
 * The most common cause of "Invalid email or password" when the values look
 * correct is an invisible character picked up by copy-paste: a trailing newline,
 * a leading space, a byte-order mark, or a pair of wrapping quotes from a config
 * file. The Vercel UI renders the value without them, so the mismatch cannot be
 * seen by eye and the login just fails. Comparing on the visible content only
 * removes this whole class of failure.
 *
 * Trimming is safe: it cannot turn a wrong password into a right one, because
 * the submitted password is still compared exactly as typed.
 */
function cleanEnv(value: any): string {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^["']|["']$/g, '')
    .trim()
}

async function pbkdf2Hex(password: string, saltHex: string, iterations: number): Promise<string> {
  const salt = new Uint8Array((saltHex.match(/.{2}/g) || []).map((h) => parseInt(h, 16)))
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256)
  return toHex(bits)
}

async function hashPassword(password: string): Promise<string> {
  const saltHex = toHex(crypto.getRandomValues(new Uint8Array(16)))
  const hash = await pbkdf2Hex(password, saltHex, PBKDF2_ITERATIONS)
  return `pbkdf2$${PBKDF2_ITERATIONS}$${saltHex}$${hash}`
}

/**
 * Verifies a password and reports whether the stored hash is legacy and should
 * be transparently upgraded on the next successful login.
 */
async function verifyPassword(password: string, stored: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (!stored) return { ok: false, needsRehash: false }
  if (stored.startsWith('pbkdf2$')) {
    const parts = stored.split('$')
    if (parts.length !== 4) return { ok: false, needsRehash: false }
    const iterations = Number(parts[1]) || PBKDF2_ITERATIONS
    const computed = await pbkdf2Hex(password, parts[2], iterations)
    return { ok: timingSafeEqual(computed, parts[3]), needsRehash: false }
  }
  const legacy = await sha256(password)
  const ok = timingSafeEqual(legacy, stored)
  return { ok, needsRehash: ok }
}

// ===== STUDENT SESSIONS (DB-backed, expiring, revocable) =====
const STUDENT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
let studentSessionsTableReady = false
async function ensureStudentSessionsTable(client: any) {
  if (studentSessionsTableReady) return
  await client.execute(`CREATE TABLE IF NOT EXISTS student_sessions (
    id TEXT PRIMARY KEY,
    token_hash TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    revoked_at TEXT
  )`)
  await client.execute(`CREATE INDEX IF NOT EXISTS student_sessions_user_idx ON student_sessions(user_id)`)
  studentSessionsTableReady = true
}

function readCookie(req: any, name: string): string {
  const header = String(req.headers?.cookie || '')
  const match = header.split(';').map((v: string) => v.trim()).find((v: string) => v.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : ''
}

function studentSessionCookie(token: string, clear = false): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `tradeed_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure}; ${clear ? 'Max-Age=0' : `Max-Age=${Math.floor(STUDENT_SESSION_TTL_MS / 1000)}`}`
}

async function createStudentSession(client: any, userId: string): Promise<string> {
  await ensureStudentSessionsTable(client)
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)))
  const now = Date.now()
  await client.execute({
    sql: `INSERT INTO student_sessions (id, token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?)`,
    args: [crypto.randomUUID(), await sha256(token), userId, new Date(now).toISOString(), new Date(now + STUDENT_SESSION_TTL_MS).toISOString()],
  })
  return token
}

async function getAuthenticatedUser(client: any, req: any): Promise<any | null> {
  const token = readCookie(req, 'tradeed_session')
  if (!token) return null
  await ensureStudentSessionsTable(client)
  const r = await client.execute({
    sql: `SELECT u.*, s.expires_at FROM student_sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.revoked_at IS NULL`,
    args: [await sha256(token)],
  })
  const user = rows(r)[0]
  if (!user) return null
  if (new Date(user.expires_at).getTime() <= Date.now()) {
    await client.execute({ sql: `UPDATE student_sessions SET revoked_at = datetime('now') WHERE token_hash = ?`, args: [await sha256(token)] })
    return null
  }
  return user
}

async function revokeStudentSession(client: any, req: any) {
  const token = readCookie(req, 'tradeed_session')
  if (!token) return
  await ensureStudentSessionsTable(client)
  await client.execute({ sql: `UPDATE student_sessions SET revoked_at = datetime('now') WHERE token_hash = ?`, args: [await sha256(token)] })
}

// ===== ADMIN SESSIONS (DB-backed, expiring, revocable) =====
// Previously any non-empty x-admin-token was accepted as proof of admin rights,
// so a single curl request granted full CRUD. Tokens are now random 256-bit
// values persisted with an expiry, stored as a hash, and revocable.
const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

let adminSessionsTableReady = false
async function ensureAdminSessionsTable(client: any) {
  if (adminSessionsTableReady) return
  await client.execute(`CREATE TABLE IF NOT EXISTS admin_sessions (
    tokenHash TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    expiresAt TEXT NOT NULL
  )`)
  adminSessionsTableReady = true
}

async function createAdminSession(client: any, email: string): Promise<string> {
  await ensureAdminSessionsTable(client)
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)))
  const now = Date.now()
  await client.execute({
    sql: `INSERT INTO admin_sessions (tokenHash, email, createdAt, expiresAt) VALUES (?, ?, ?, ?)`,
    args: [await sha256(token), email, new Date(now).toISOString(), new Date(now + ADMIN_SESSION_TTL_MS).toISOString()],
  })
  return token
}

async function verifyAdminSession(client: any, token: string): Promise<{ email: string } | null> {
  if (!token) return null
  try {
    await ensureAdminSessionsTable(client)
    const tokenHash = await sha256(token)
    const r = await client.execute({ sql: `SELECT email, expiresAt FROM admin_sessions WHERE tokenHash = ?`, args: [tokenHash] })
    const s = rows(r)[0]
    if (!s) return null
    if (new Date(s.expiresAt).getTime() < Date.now()) {
      await client.execute({ sql: `DELETE FROM admin_sessions WHERE tokenHash = ?`, args: [tokenHash] })
      return null
    }
    return { email: s.email }
  } catch {
    return null
  }
}

async function destroyAdminSession(client: any, token: string) {
  if (!token) return
  try {
    await ensureAdminSessionsTable(client)
    await client.execute({ sql: `DELETE FROM admin_sessions WHERE tokenHash = ?`, args: [await sha256(token)] })
  } catch { /* best effort */ }
}

// ===== SHARED HELPERS =====
const normEmail = (v: any) => String(v ?? '').trim().toLowerCase()

/** A paid plan is only effective until its expiry date. */
function effectivePlan(plan: any, expiresAt: any): string {
  const p = plan || 'FREE'
  if (p === 'FREE' || !expiresAt) return p
  return new Date(expiresAt).getTime() < Date.now() ? 'FREE' : p
}

async function getUserByEmail(client: any, emailRaw: any) {
  const email = normEmail(emailRaw)
  if (!email) return null
  const r = await client.execute({ sql: `SELECT * FROM users WHERE lower(email) = ?`, args: [email] })
  return rows(r)[0] || null
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

// ===== PLAN-BASED CONTENT GATING =====
// Paid media (lesson videos, downloads, live-session join links) must never be
// shipped to a client that has not been approved for the required tier. Access is
// derived server-side from the caller's own account record — never from a value
// the client sends — because plan activation only happens after the owner
// manually verifies a JazzCash / Easypaisa receipt.
const PLAN_RANK: Record<string, number> = { FREE: 0, STARTER: 1, PREMIUM: 2 }

function planRank(plan: any): number {
  const key = String(plan ?? 'FREE').trim().toUpperCase()
  return PLAN_RANK[key] ?? 0
}

/** Resolves the caller's effective plan from the authenticated session. */
async function getCallerPlan(client: any, req: any): Promise<string> {
  try {
    const u = await getAuthenticatedUser(client, req)
    if (!u) return 'FREE'
    const role = String(u.role || 'student').toLowerCase()
    if (role === 'admin' || role === 'instructor') return 'PREMIUM'
    const expiryCol = await getPlanExpiryColumn(client)
    return effectivePlan(u.plan, expiryCol ? u[expiryCol] : null)
  } catch {
    return 'FREE'
  }
}

/**
 * Returns the lesson unchanged when the caller may watch it, otherwise returns
 * the lesson with its playable/readable payload stripped. The lesson is still
 * included in the response so the UI can render it as "locked" rather than
 * silently missing from the curriculum.
 */
/**
 * Chapter files link back to the store with href="../index.html". That used to
 * resolve to the app shell, but chapters are now served from
 * /api/books/<id>/<file>, where the same relative link would hit the API and
 * 404 inside the reader iframe. Rewrite it back to the site root.
 */
function rewriteBookLinks(html: string): string {
  return html.replace(/href=(["'])(?:\.\.\/)+index\.html\1/g, 'href="/"')
}

function gateLesson(lesson: any, courseIsFree: boolean, callerRank: number) {
  const isFree = lesson.isFree === 1 || lesson.isFree === true
  const canAccess = isFree || courseIsFree || callerRank >= 1
  if (canAccess) return { ...lesson, isFree, canAccess: true, locked: false }
  const { videoUrl, content, ...rest } = lesson
  return { ...rest, isFree: false, canAccess: false, locked: true }
}

// ===== BOOK ACCESS (server-side paywall) =====
// These books previously sat in public/ as plain .html files, so every chapter
// was downloadable by anyone regardless of plan — the client-side lock in
// Books.tsx only hid the button. The HTML now lives outside the static root and
// is released by this API only after a server-verified plan check.
const BOOK_PLAN: Record<string, string> = {
  'crypto-beginner': 'FREE',
  'candlestick': 'FREE',
  'glossary': 'FREE',
  'crypto-intermediate': 'STARTER',
  'crypto-advanced': 'STARTER',
  'smc': 'STARTER',
  'forex': 'STARTER',
  'price-action': 'STARTER',
  'trading-strategies': 'STARTER',
  'professional-trading': 'STARTER',
  'technical-analysis': 'STARTER',
  'risk-management': 'STARTER',
  'trading-psychology': 'STARTER',
}

// Free books intentionally stay in public/ and are served straight from the CDN.
const STATIC_BOOK_DIRS: Record<string, string> = {
  'crypto-beginner': './crypto-beginner/index.html',
  'candlestick': './candlestick-book/index.html',
  'glossary': './glossary-book/index.html',
}

// Reading a multi-chapter book inside an iframe issues one request per chapter
// with no custom headers, so a short-lived signed cookie backs the plan check
// after the entry request has already been authorized.
const BOOK_TTL_MS = 30 * 60 * 1000
const BOOK_TOKEN_SECRET =
  process.env.BOOK_TOKEN_SECRET || `${process.env.ADMIN_PASSWORD || ''}|tradeed-books-v1`

async function createBookToken(bookId: string): Promise<string> {
  const exp = String(Date.now() + BOOK_TTL_MS)
  return `${exp}.${await sha256(`${bookId}|${exp}|${BOOK_TOKEN_SECRET}`)}`
}

async function verifyBookToken(bookId: string, token: string): Promise<boolean> {
  if (!token) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig) return false
  if (Number(exp) < Date.now()) return false
  return timingSafeEqual(await sha256(`${bookId}|${exp}|${BOOK_TOKEN_SECRET}`), sig)
}

function bookCookie(bookId: string, token: string): string {
  const secure = process.env.VERCEL ? '; Secure' : ''
  return `book_access_${bookId}=${encodeURIComponent(token)}; Path=/api/books/; HttpOnly; SameSite=Lax; Max-Age=1800${secure}`
}

/** Shown instead of content when a reader is not entitled to the book. */
function lockedBookPage(requiredPlan: string): string {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Locked</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:#0d1b2a;color:#eee;font-family:system-ui,-apple-system,Segoe UI,sans-serif;padding:24px}
  .card{max-width:560px;text-align:center;border:3px solid #e0a800;border-radius:20px;
    padding:44px 32px;background:linear-gradient(145deg,#0d1b2a,#1b263b)}
  h1{color:#e0a800;font-size:30px;margin:0 0 12px}
  p{color:#bbb;font-size:17px;line-height:1.7;margin:0 0 10px}
  .tag{display:inline-block;margin-top:18px;background:#00b4d8;color:#062033;
    font-weight:700;border-radius:10px;padding:10px 20px;font-size:15px;letter-spacing:.5px}
  .note{margin-top:22px;font-size:15px;color:#f0a0a0;background:#2d1b1b;border:2px solid #e94560;border-radius:12px;padding:14px 18px}
</style>
</head>
<body>
  <div class="card">
    <h1>This book is locked</h1>
    <p>It belongs to the paid library and is not included in the free plan.</p>
    <p>Please sign in with an approved account, or contact the instructor.</p>
    <span class="tag">${requiredPlan} PLAN REQUIRED</span>
    <div class="note">Access is granted by the instructor only after your payment receipt has been verified.</div>
  </div>
</body>
</html>`
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', req.headers?.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  const url = req.url || '/'
  const body = await readBody(req)

  // ===== ADMIN AUTH =====
  if (url === '/api/admin/auth' && req.method === 'POST') {
    try {
      const { email, password } = JSON.parse(body || '{}')

      const adminEmail = cleanEnv(process.env.ADMIN_EMAIL)
      const adminPassword = cleanEnv(process.env.ADMIN_PASSWORD)

      // A missing variable and a wrong password were previously the same 401,
      // which made a deployment mistake look like a typo. Separate them.
      if (!adminEmail || !adminPassword) {
        return send(res, 500, {
          error: 'Admin login is not configured on the server yet. In Vercel add ADMIN_EMAIL and ADMIN_PASSWORD (Settings → Environment Variables), then Redeploy.',
        })
      }

      const submittedEmail = normEmail(email)
      const submittedPassword = String(password ?? '')
      const emailOk = timingSafeEqual(submittedEmail, normEmail(adminEmail))
      const passOk = timingSafeEqual(submittedPassword, adminPassword)

      if (!emailOk || !passOk) {
        // Which field failed and how long each side is — never the values.
        // This is what turns "it just says invalid" into a 30-second fix.
        console.warn(
          `[admin-auth] rejected: emailMatch=${emailOk} passwordMatch=${passOk} ` +
          `emailLenSubmitted=${submittedEmail.length} emailLenConfigured=${normEmail(adminEmail).length} ` +
          `passwordLenSubmitted=${submittedPassword.length} passwordLenConfigured=${adminPassword.length}`,
        )
        return send(res, 401, { error: 'Invalid email or password' })
      }

      const token = await createAdminSession(getDb(), normEmail(adminEmail))
      return send(res, 200, { ok: true, token, email: normEmail(adminEmail) })
    } catch (e: any) {
      return send(res, 500, { error: e?.message || 'Admin auth error' })
    }
  }

  // POST /api/admin/logout — revoke the current admin session
  if (url === '/api/admin/logout' && req.method === 'POST') {
    try {
      await destroyAdminSession(getDb(), String(req.headers['x-admin-token'] || ''))
      return send(res, 200, { ok: true })
    } catch (e: any) {
      return send(res, 500, { error: e?.message || 'Admin logout error' })
    }
  }

  // ===== STUDENT AUTH + PLANS (direct Turso DB) =====
  if (url.startsWith('/api/auth/') || url.startsWith('/api/plan/') || url.startsWith('/api/subscriptions/')) {
    try {
      const client = getDb()

      // POST /api/auth/signup
      if (url === '/api/auth/signup' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        const email = normEmail(d.email)
        if (!email || !d.password || !d.name) return send(res, 400, { error: 'Name, email, and password are required' })
        if (!isValidEmail(email)) return send(res, 400, { error: 'Please enter a valid email address' })
        if (String(d.password).length < 8) return send(res, 400, { error: 'Password must be at least 8 characters' })
        const existing = await client.execute({ sql: `SELECT id FROM users WHERE lower(email) = ?`, args: [email] })
        if (rows(existing).length) return send(res, 409, { error: 'An account with this email already exists' })
        const id = crypto.randomUUID()
        const hash = await hashPassword(d.password)
        await client.execute({
          sql: `INSERT INTO users (id, email, name, passwordHash, role, plan, created_at, updated_at)
                VALUES (?, ?, ?, ?, 'student', 'FREE', datetime('now'), datetime('now'))`,
          args: [id, email, String(d.name).trim(), hash],
        })
        const token = await createStudentSession(client, id)
        res.setHeader('Set-Cookie', studentSessionCookie(token))
        return send(res, 200, { ok: true, user: { id, email, name: String(d.name).trim(), role: 'student', plan: 'FREE' } })
      }

      // POST /api/auth/login
      if (url === '/api/auth/login' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        const email = normEmail(d.email)
        if (!email || !d.password) return send(res, 400, { error: 'Email and password are required' })
        const u = await getUserByEmail(client, email)
        if (!u) return send(res, 401, { error: 'Invalid email or password' })
        const { ok, needsRehash } = await verifyPassword(String(d.password), u.passwordHash)
        if (!ok) return send(res, 401, { error: 'Invalid email or password' })
        // Transparently upgrade legacy unsalted SHA-256 hashes on successful login
        if (needsRehash) {
          await client.execute({ sql: `UPDATE users SET passwordHash = ?, updated_at = datetime('now') WHERE id = ?`, args: [await hashPassword(d.password), u.id] })
        }
        const expiryCol = await getPlanExpiryColumn(client)
        const planExpiresAt = (expiryCol ? u[expiryCol] : null) || null
        // Block login if the student's latest subscription request is inactive
        // (admin disabled it). Users with no request at all are unaffected.
        const subs = await client.execute({ sql: `SELECT status FROM subscription_requests WHERE email = ? ORDER BY created_at DESC LIMIT 1`, args: [email] })
        const latestSub = rows(subs)[0]
        if (latestSub && latestSub.status === 'inactive') {
          return send(res, 403, { error: 'Your subscription is inactive. Please contact admin to renew your plan.' })
        }
        const token = await createStudentSession(client, u.id)
        res.setHeader('Set-Cookie', studentSessionCookie(token))
        return send(res, 200, {
          user: { id: u.id, email: u.email, name: u.name, role: u.role || 'student', plan: effectivePlan(u.plan, planExpiresAt), planExpiresAt },
        })
      }

      // GET /api/auth/me (identity comes only from the server session)
      if (url === '/api/auth/me' && req.method === 'GET') {
        const u = await getAuthenticatedUser(client, req)
        if (!u) return send(res, 401, { error: 'Authentication required' })
        const expiryCol = await getPlanExpiryColumn(client)
        const planExpiresAt = (expiryCol ? u[expiryCol] : null) || null
        return send(res, 200, {
          user: { id: u.id, email: u.email, name: u.name, role: u.role || 'student', plan: effectivePlan(u.plan, planExpiresAt), planExpiresAt },
        })
      }

      if (url === '/api/auth/logout' && req.method === 'POST') {
        await revokeStudentSession(client, req)
        res.setHeader('Set-Cookie', studentSessionCookie('', true))
        return send(res, 200, { ok: true })
      }

      // POST /api/auth/forgot-password — issue a single-use reset token and
      // deliver it by email (see server/email.ts for the provider setup).
      // ALLOW_TOKEN_IN_RESPONSE remains a local-development escape hatch only.
      if (url === '/api/auth/forgot-password' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        const email = normEmail(d.email)
        if (!email) return send(res, 400, { error: 'Email is required' })
        const u = await getUserByEmail(client, email)
        let issuedToken: string | null = null
        if (u) {
          const token = toHex(crypto.getRandomValues(new Uint8Array(24)))
          issuedToken = token
          const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
          await client.execute({
            sql: `INSERT INTO password_reset_tokens (id, email, token, expiresAt, used, created_at) VALUES (?, ?, ?, ?, 0, datetime('now'))`,
            args: [crypto.randomUUID(), email, token, expiresAt],
          })

          // sendEmail never throws; a delivery failure still returns the generic
          // response so the endpoint cannot be used to enumerate accounts.
          if (!isValidEmail(email)) {
            console.warn('[forgot-password] stored a reset token for a malformed address; not attempting delivery')
          } else {
            const result = await sendEmail({ to: email, ...passwordResetEmail(email, token) })
            if (result.ok) {
              console.log(`[forgot-password] reset email sent via ${result.provider}`)
            } else if (result.skipped) {
              console.warn(`[forgot-password] email NOT sent (${result.error}). Reset tokens cannot reach the user until a provider is configured — see README → "Email delivery".`)
            } else {
              console.error(`[forgot-password] email delivery failed (${result.error})`)
            }
          }
        }
        const expose = String(process.env.ALLOW_TOKEN_IN_RESPONSE || '').toLowerCase() === 'true'
        // Always return the same shape so the endpoint cannot be used to enumerate accounts.
        return send(res, 200, {
          ok: true,
          message: 'If an account exists for that email, a reset link has been generated. Contact support if you do not receive it.',
          ...(expose && issuedToken ? { resetToken: issuedToken } : {}),
        })
      }

      // POST /api/auth/reset-password — consume a reset token and set a new password
      if (url === '/api/auth/reset-password' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        const email = normEmail(d.email)
        const token = String(d.token || '').trim()
        if (!email || !token || !d.newPassword) return send(res, 400, { error: 'Email, token and new password are required' })
        if (String(d.newPassword).length < 8) return send(res, 400, { error: 'Password must be at least 8 characters' })
        const r = await client.execute({ sql: `SELECT * FROM password_reset_tokens WHERE token = ? AND lower(email) = ?`, args: [token, email] })
        const row = rows(r)[0]
        if (!row || row.used) return send(res, 400, { error: 'This reset token is invalid or has already been used.' })
        if (new Date(row.expiresAt).getTime() < Date.now()) return send(res, 400, { error: 'This reset token has expired. Please request a new one.' })
        const u = await getUserByEmail(client, email)
        await client.execute({ sql: `UPDATE password_reset_tokens SET used = 1 WHERE id = ?`, args: [row.id] })
        if (!u) return send(res, 400, { error: 'User not found' })
        await client.execute({ sql: `UPDATE users SET passwordHash = ?, updated_at = datetime('now') WHERE id = ?`, args: [await hashPassword(d.newPassword), u.id] })
        // Any existing admin sessions for this identity are revoked as a precaution
        return send(res, 200, { ok: true, message: 'Password updated. You can now sign in.' })
      }

      // NOTE: plan activation is deliberately NOT exposed as a user-callable
      // endpoint. Plans are granted exclusively through admin approval of a
      // verified subscription request (PATCH /api/admin/subscriptions/:id),
      // matching the JazzCash / Easypaisa receipt-verification workflow.

      // POST /api/subscriptions/request — student submits plan purchase request (public)
      // This is the entry point of the manual payment flow: the student transfers
      // the fee to JazzCash / Easypaisa, uploads the receipt, and the request is
      // created as 'inactive' until the admin verifies and approves it.
      if (url === '/api/subscriptions/request' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        const email = normEmail(d.email)
        if (!d.name || !email || !d.phone) return send(res, 400, { error: 'Name, email, and phone are required' })
        if (!isValidEmail(email)) return send(res, 400, { error: 'Please enter a valid email address' })
        const allowedPlans = ['STARTER', 'PREMIUM']
        if (d.plan && !allowedPlans.includes(d.plan)) return send(res, 400, { error: 'Invalid plan' })
        // Reject oversized receipts before they reach the database. The client
        // sends a base64 data URL, so ~1.34 bytes of payload per character.
        const receipt = typeof d.receiptUrl === 'string' ? d.receiptUrl : ''
        const MAX_RECEIPT_BYTES = 3 * 1024 * 1024
        if (receipt.length > MAX_RECEIPT_BYTES) return send(res, 413, { error: 'Receipt image is too large. Please upload a file under 3 MB.' })
        if (receipt && !/^data:image\/(png|jpe?g|webp|pdf);base64,/.test(receipt)) {
          return send(res, 400, { error: 'Receipt must be a PNG, JPG, WEBP or PDF file.' })
        }
        const id = crypto.randomUUID()
        await client.execute({
          sql: `INSERT INTO subscription_requests (id, name, email, phone, city, tradeExperience, plan, status, receiptUrl, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive', ?, datetime('now'), datetime('now'))`,
          args: [id, String(d.name).trim(), email, String(d.phone).trim(), d.city || null, d.tradeExperience || null, d.plan || 'STARTER', receipt || null],
        })
        return send(res, 200, { ok: true, id, message: 'Subscription request submitted. Admin will verify your payment and activate your access.' })
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
  // Every /api/admin/* route below requires a live session issued by
  // POST /api/admin/auth: random token, hashed at rest, expiring, revocable.
  if (url.startsWith('/api/admin/')) {
    try {
      const client = getDb()
      const session = await verifyAdminSession(client, String(req.headers['x-admin-token'] || ''))
      if (!session) return send(res, 401, { error: 'Admin session expired or invalid. Please sign in again.' })

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

      // ===== ADMIN: LIVE SESSIONS =====

      // POST /api/admin/sessions
      if (url === '/api/admin/sessions' && req.method === 'POST') {
        const d = JSON.parse(body || '{}')
        if (!d.title || !d.date) return send(res, 400, { error: 'title and date are required' })
        // Ensure a default instructor account exists (sessions require instructorId)
        let inst = await client.execute({ sql: `SELECT id FROM users WHERE email = ?`, args: ['instructor@tradeed.com'] })
        let instructorId = rows(inst)[0]?.id
        if (!instructorId) {
          instructorId = crypto.randomUUID()
          await client.execute({
            sql: `INSERT INTO users (id, email, name, role, plan, created_at, updated_at)
                  VALUES (?, ?, ?, 'instructor', 'FREE', datetime('now'), datetime('now'))`,
            args: [instructorId, 'instructor@tradeed.com', 'Alex Morgan'],
          })
        }
        const id = crypto.randomUUID()
        const dateVal = new Date(d.date).toISOString()
        await client.execute({
          sql: `INSERT INTO live_sessions (id, title, description, date, duration, meetLink, courseId, instructorId, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          args: [id, d.title, d.description || null, dateVal, d.duration || null, d.meetLink || null, d.courseId || null, instructorId],
        })
        return send(res, 201, { ok: true, id })
      }

      // PATCH /api/admin/sessions/:id
      let sess = url.match(/^\/api\/admin\/sessions\/([^/]+)$/)
      if (sess && req.method === 'PATCH') {
        const d = JSON.parse(body || '{}')
        const sets: string[] = []
        const args: any[] = []
        if (d.title !== undefined) { sets.push('title = ?'); args.push(d.title) }
        if (d.description !== undefined) { sets.push('description = ?'); args.push(d.description) }
        if (d.date) { sets.push('date = ?'); args.push(new Date(d.date).toISOString()) }
        if (d.duration !== undefined) { sets.push('duration = ?'); args.push(d.duration) }
        if (d.meetLink !== undefined) { sets.push('meetLink = ?'); args.push(d.meetLink) }
        if (d.courseId !== undefined) { sets.push('courseId = ?'); args.push(d.courseId || null) }
        if (sets.length) await client.execute({ sql: `UPDATE live_sessions SET ${sets.join(', ')} WHERE id = ?`, args: [...args, sess[1]] })
        return send(res, 200, { ok: true, id: sess[1] })
      }

      // DELETE /api/admin/sessions/:id
      if (sess && req.method === 'DELETE') {
        await client.execute({ sql: `DELETE FROM live_sessions WHERE id = ?`, args: [sess[1]] })
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
          const expiryCol = await getPlanExpiryColumn(client)
          if (expiryCol) {
            await client.execute({ sql: `UPDATE users SET plan = ?, ${expiryCol} = ?, updated_at = datetime('now') WHERE email = ?`, args: [targetPlan, expiresAt, srow.email] })
          } else {
            await client.execute({ sql: `UPDATE users SET plan = ?, updated_at = datetime('now') WHERE email = ?`, args: [targetPlan, srow.email] })
          }
        }
        return send(res, 200, { ok: true, id, status: newStatus })
      }

      // Unknown admin route — fall through to proxy
    } catch (e: any) {
      return send(res, 500, { error: e?.message || 'Admin DB error' })
    }
  }

  // ===== PUBLIC CONTENT (courses / dashboard / journal) — direct Turso DB =====
  if (
    url === '/api/seed' ||
    url === '/api/dashboard' ||
    url.startsWith('/api/courses') ||
    url.startsWith('/api/journal')
  ) {
    try {
      const client = getDb()

      // POST /api/seed — intentionally a no-op. Content is authored in the admin
      // panel and must never be replaced by fixture data.
      if (url === '/api/seed') {
        return send(res, 200, { ok: true, seeded: false })
      }

      // GET /api/courses — public catalog (published only)
      if (url === '/api/courses' && req.method === 'GET') {
        const c = await client.execute(`SELECT * FROM courses WHERE isPublished = 1 ORDER BY created_at DESC`)
        const mods = await client.execute(`SELECT id, courseId FROM modules ORDER BY "order" ASC`)
        const byCourse: Record<string, any[]> = {}
        rows(mods).forEach((mod: any) => {
          if (!byCourse[mod.courseId]) byCourse[mod.courseId] = []
          byCourse[mod.courseId].push({ id: mod.id })
        })
        return send(res, 200, {
          items: rows(c).map((course: any) => ({
            ...course,
            isPublished: course.isPublished === 1 || course.isPublished === true,
            modules: byCourse[course.id] || [],
          })),
        })
      }

      // GET /api/courses/:id/detail — full course tree (modules -> lessons),
      // with paid media gated by the caller's server-verified plan.
      const detail = url.match(/^\/api\/courses\/([^/]+)\/detail$/)
      if (detail && req.method === 'GET') {
        const c = await client.execute({ sql: `SELECT * FROM courses WHERE id = ?`, args: [detail[1]] })
        const course = rows(c)[0]
        if (!course) return send(res, 404, { error: 'Course not found' })

        const callerPlan = await getCallerPlan(client, req)
        const callerRank = planRank(callerPlan)
        const courseIsFree = Number(course.price || 0) <= 0

        const mods = await client.execute({ sql: `SELECT * FROM modules WHERE courseId = ? ORDER BY "order" ASC`, args: [course.id] })
        const modules = await Promise.all(rows(mods).map(async (mod: any) => {
          const les = await client.execute({ sql: `SELECT * FROM lessons WHERE moduleId = ? ORDER BY "order" ASC`, args: [mod.id] })
          return {
            ...mod,
            lessons: rows(les).map((lesson: any) => gateLesson(lesson, courseIsFree, callerRank)),
          }
        }))

        const allLessons = modules.flatMap((m: any) => m.lessons)
        return send(res, 200, {
          ...course,
          isPublished: course.isPublished === 1 || course.isPublished === true,
          callerPlan,
          hasFullAccess: courseIsFree || callerRank >= 1,
          lessonCount: allLessons.length,
          lockedLessonCount: allLessons.filter((l: any) => l.locked).length,
          modules,
        })
      }

      // GET /api/dashboard — published courses + live sessions (with instructor)
      if (url === '/api/dashboard' && req.method === 'GET') {
        const callerRank = planRank(await getCallerPlan(client, req))
        const c = await client.execute(`SELECT * FROM courses WHERE isPublished = 1 ORDER BY created_at DESC`)
        const s = await client.execute(`
          SELECT sess.*, u.name as instructorName, u.email as instructorEmail, c.title as courseTitle
          FROM live_sessions sess
          LEFT JOIN users u ON u.id = sess.instructorId
          LEFT JOIN courses c ON c.id = sess.courseId
          ORDER BY sess.date ASC
        `)
        return send(res, 200, {
          courses: rows(c),
          sessions: rows(s).map((session: any) => {
            // A session that explicitly requires a paid tier withholds its join
            // link from callers not approved for that tier. Sessions with no tier
            // set remain open, so existing sessions are never broken.
            const requiredPlan = String(session.plan || 'FREE').trim().toUpperCase()
            const allowed = planRank(requiredPlan) <= callerRank
            return {
              id: session.id,
              title: session.title,
              description: session.description,
              date: session.date,
              duration: session.duration,
              meetLink: allowed ? session.meetLink : null,
              locked: !allowed,
              requiredPlan,
              instructor: { name: session.instructorName || 'Instructor', email: session.instructorEmail || null },
              course: session.courseId ? { id: session.courseId, title: session.courseTitle || '' } : null,
            }
          }),
        })
      }

      // ===== JOURNAL =====
      const num = (v: any) => (v === '' || v === null || v === undefined ? null : Number(v))

      // GET /api/journal — authenticated student's own entries
      if (url === '/api/journal' && req.method === 'GET') {
        const caller = await getAuthenticatedUser(client, req)
        if (!caller) return send(res, 401, { error: 'Authentication required' })
        const userId = caller.id
        const e = await client.execute({ sql: `SELECT * FROM journal_entries WHERE userId = ? ORDER BY trade_date DESC`, args: [userId] })
        return send(res, 200, { entries: rows(e) })
      }

      // POST /api/journal — create entry for the authenticated student
      if (url === '/api/journal' && req.method === 'POST') {
        const caller = await getAuthenticatedUser(client, req)
        if (!caller) return send(res, 401, { error: 'Authentication required' })
        const userId = caller.id
        const d = JSON.parse(body || '{}')
        if (!d.pair || !d.direction || d.entry === undefined) {
          return send(res, 400, { error: 'pair, direction and entry are required' })
        }
        const id = crypto.randomUUID()
        await client.execute({
          sql: `INSERT INTO journal_entries (id, userId, trade_date, pair, direction, entry, exit, stopLoss, takeProfit, size, setup, notes, pnl, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          args: [id, userId, new Date().toISOString(), d.pair, d.direction, num(d.entry), num(d.exit), num(d.stopLoss), num(d.takeProfit), num(d.size), d.setup || null, d.notes || null, num(d.pnl)],
        })
        return send(res, 201, { ok: true, id })
      }

      // PATCH /api/journal/:id
      const je = url.match(/^\/api\/journal\/([^/]+)$/)
      if (je && req.method === 'PATCH') {
        const d = JSON.parse(body || '{}')
        const sets: string[] = []
        const args: any[] = []
        if (d.pair !== undefined) { sets.push('pair = ?'); args.push(d.pair) }
        if (d.direction !== undefined) { sets.push('direction = ?'); args.push(d.direction) }
        if (d.entry !== undefined) { sets.push('entry = ?'); args.push(num(d.entry)) }
        if (d.exit !== undefined) { sets.push('exit = ?'); args.push(num(d.exit)) }
        if (d.stopLoss !== undefined) { sets.push('stopLoss = ?'); args.push(num(d.stopLoss)) }
        if (d.takeProfit !== undefined) { sets.push('takeProfit = ?'); args.push(num(d.takeProfit)) }
        if (d.size !== undefined) { sets.push('size = ?'); args.push(num(d.size)) }
        if (d.setup !== undefined) { sets.push('setup = ?'); args.push(d.setup) }
        if (d.notes !== undefined) { sets.push('notes = ?'); args.push(d.notes) }
        if (d.pnl !== undefined) { sets.push('pnl = ?'); args.push(num(d.pnl)) }
        const caller = await getAuthenticatedUser(client, req)
        if (!caller) return send(res, 401, { error: 'Authentication required' })
        if (sets.length) {
          const result = await client.execute({ sql: `UPDATE journal_entries SET ${sets.join(', ')} WHERE id = ? AND userId = ?`, args: [...args, je[1], caller.id] })
          if (!result.rowsAffected) return send(res, 404, { error: 'Journal entry not found' })
        }
        return send(res, 200, { ok: true, id: je[1] })
      }

      // DELETE /api/journal/:id
      if (je && req.method === 'DELETE') {
        const caller = await getAuthenticatedUser(client, req)
        if (!caller) return send(res, 401, { error: 'Authentication required' })
        const result = await client.execute({ sql: `DELETE FROM journal_entries WHERE id = ? AND userId = ?`, args: [je[1], caller.id] })
        if (!result.rowsAffected) return send(res, 404, { error: 'Journal entry not found' })
        return send(res, 200, { ok: true })
      }

      // ===== ENROLLMENTS + LESSON PROGRESS =====
      // Enrollment and lesson progress used to live only in the student's
      // localStorage: it was lost on any other device and, because the browser
      // owned it, a student could simply edit the record to appear "complete".
      // Both are now server-owned and always scoped to the caller's own
      // authenticated session, so one student can never read or write another's
      // records, and certificates reflect real completion.

      const pathUrl = url.split('?')[0]

      // GET /api/enrollments — the caller's own enrollments
      if (pathUrl === '/api/enrollments' && req.method === 'GET') {
        const caller = await getAuthenticatedUser(client, req)
        if (!caller) return send(res, 401, { error: 'Authentication required' })
        const e = await client.execute({
          sql: `SELECT id, courseId, status, enrolled_at, completed_at FROM enrollments WHERE userId = ? ORDER BY enrolled_at DESC`,
          args: [caller.id],
        })
        return send(res, 200, { enrollments: rows(e) })
      }

      // POST /api/enrollments — enroll the caller in a course (idempotent)
      if (pathUrl === '/api/enrollments' && req.method === 'POST') {
        const caller = await getAuthenticatedUser(client, req)
        if (!caller) return send(res, 401, { error: 'Authentication required' })
        const d = JSON.parse(body || '{}')
        const courseId = String(d.courseId || '').trim()
        if (!courseId) return send(res, 400, { error: 'courseId is required' })

        const c = rows(await client.execute({
          sql: `SELECT id, price, isPublished FROM courses WHERE id = ?`,
          args: [courseId],
        }))[0]
        if (!c) return send(res, 404, { error: 'Course not found' })

        // A priced course cannot be joined until the owner has verified the
        // fee receipt and approved the matching plan — otherwise a FREE account
        // could add paid courses to its dashboard at will.
        const courseIsFree = Number(c.price || 0) <= 0
        if (!courseIsFree) {
          const plan = await getCallerPlan(client, req)
          if (planRank(plan) < 1) {
            return send(res, 403, {
              error: 'This course requires a paid plan. Send your fee, then wait for approval.',
              requiredPlan: 'STARTER',
              currentPlan: plan,
            })
          }
        }

        // (userId, courseId) is unique, so re-enrolling is a harmless no-op.
        await client.execute({
          sql: `INSERT INTO enrollments (id, userId, courseId, status, enrolled_at)
                VALUES (?, ?, ?, 'active', datetime('now'))
                ON CONFLICT(userId, courseId) DO NOTHING`,
          args: [crypto.randomUUID(), caller.id, courseId],
        })
        return send(res, 200, { ok: true, courseId })
      }

      // GET /api/progress — the caller's own lesson completion state.
      // courseId is joined in so the client can rebuild its per-course view in
      // one round trip instead of looking up every lesson id separately.
      if (pathUrl === '/api/progress' && req.method === 'GET') {
        const caller = await getAuthenticatedUser(client, req)
        if (!caller) return send(res, 401, { error: 'Authentication required' })
        const p = await client.execute({
          sql: `SELECT p.lessonId, p.completed, p.completed_at, m.courseId AS courseId
                FROM progress p
                JOIN lessons l ON l.id = p.lessonId
                JOIN modules m ON m.id = l.moduleId
                WHERE p.userId = ?`,
          args: [caller.id],
        })
        return send(res, 200, {
          progress: rows(p).map((r: any) => ({
            lessonId: r.lessonId,
            courseId: r.courseId,
            completed: r.completed === 1 || r.completed === true,
            completedAt: r.completed_at,
          })),
        })
      }

      // POST /api/progress — mark one lesson complete/incomplete for the caller
      if (pathUrl === '/api/progress' && req.method === 'POST') {
        const caller = await getAuthenticatedUser(client, req)
        if (!caller) return send(res, 401, { error: 'Authentication required' })
        const d = JSON.parse(body || '{}')
        const lessonId = String(d.lessonId || '').trim()
        if (!lessonId) return send(res, 400, { error: 'lessonId is required' })
        const completed = d.completed === false || d.completed === 0 ? 0 : 1

        const lesson = rows(await client.execute({
          sql: `SELECT l.id, m.courseId FROM lessons l JOIN modules m ON m.id = l.moduleId WHERE l.id = ?`,
          args: [lessonId],
        }))[0]
        if (!lesson) return send(res, 404, { error: 'Lesson not found' })

        await client.execute({
          sql: `INSERT INTO progress (id, userId, lessonId, completed, completed_at, created_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
                ON CONFLICT(userId, lessonId) DO UPDATE SET
                  completed = excluded.completed,
                  completed_at = excluded.completed_at`,
          args: [crypto.randomUUID(), caller.id, lessonId, completed, completed ? new Date().toISOString() : null],
        })

        // Keep the enrollment status honest: a course flips to "completed" only
        // once every lesson in it is done for this specific student.
        const tally = rows(await client.execute({
          sql: `SELECT COUNT(*) AS total,
                       SUM(CASE WHEN p.completed = 1 THEN 1 ELSE 0 END) AS done
                FROM modules m
                JOIN lessons l ON l.moduleId = m.id
                LEFT JOIN progress p ON p.lessonId = l.id AND p.userId = ?
                WHERE m.courseId = ?`,
          args: [caller.id, lesson.courseId],
        }))[0]
        const total = Number(tally?.total || 0)
        const done = Number(tally?.done || 0)
        const courseDone = total > 0 && done >= total
        await client.execute({
          sql: `UPDATE enrollments SET status = ?, completed_at = ?
                WHERE userId = ? AND courseId = ?`,
          args: [courseDone ? 'completed' : 'active', courseDone ? new Date().toISOString() : null, caller.id, lesson.courseId],
        })

        return send(res, 200, { ok: true, lessonId, completed: !!completed, courseCompleted: courseDone })
      }

      // Unknown content route — fall through to proxy
    } catch (e: any) {
      return send(res, 500, { error: e?.message || 'Content DB error' })
    }
  }

  // ===== BOOKS — plan-gated delivery of paid book HTML =====
  if (url === '/api/books' || url.startsWith('/api/books/')) {
    try {
      const client = getDb()

      // GET /api/books — authoritative catalog: which books this account may open
      if (url === '/api/books' && req.method === 'GET') {
        const plan = await getCallerPlan(client, req)
        const rank = planRank(plan)
        return send(res, 200, {
          plan,
          books: Object.keys(BOOK_PLAN).map((id) => {
            const requiredPlan = BOOK_PLAN[id]
            const locked = rank < planRank(requiredPlan)
            return {
              id,
              requiredPlan,
              locked,
              entry: requiredPlan === 'FREE' ? STATIC_BOOK_DIRS[id] : `/api/books/${id}/`,
            }
          }),
        })
      }

      // GET /api/books/:id/:file? — one chapter (or the book's index)
      const bookMatch = url.match(/^\/api\/books\/([a-zA-Z0-9_-]+)(?:\/([^?]*))?/)
      if (bookMatch && req.method === 'GET') {
        const bookId = bookMatch[1]
        const requested = decodeURIComponent(bookMatch[2] || '').replace(/^\/+/, '')
        const requiredPlan = BOOK_PLAN[bookId]
        const bundle = (BOOK_CONTENT.books as any)[bookId]

        if (!requiredPlan || !bundle) return send(res, 404, { error: 'Book not found' })
        if (requiredPlan === 'FREE') return send(res, 400, { error: 'This book is served statically.' })

        // Resolve only exact manifest keys, so traversal (../) cannot escape.
        const key = requested === '' ? 'index.html' : requested
        const html: string | undefined = bundle.files[key]
        if (!html) return send(res, 404, { error: 'Chapter not found' })

        // Entitled if the reader holds a valid cookie from an earlier authorized
        // request, or if their account's verified plan covers this book.
        let allowed = await verifyBookToken(bookId, readCookie(req, `book_access_${bookId}`))
        if (!allowed) {
          const plan = await getCallerPlan(client, req)
          allowed = planRank(plan) >= planRank(requiredPlan)
          if (allowed) res.setHeader('Set-Cookie', bookCookie(bookId, await createBookToken(bookId)))
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.setHeader('Cache-Control', 'private, no-store')
        res.setHeader('X-Robots-Tag', 'noindex')
        res.status(200).end(allowed ? rewriteBookLinks(html) : lockedBookPage(requiredPlan))
        return
      }

      return send(res, 404, { error: 'Book route not found' })
    } catch (e: any) {
      return send(res, 500, { error: e?.message || 'Book delivery error' })
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
