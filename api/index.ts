// Vercel serverless proxy — forwards /api/* to the Shogo backend
// Also handles admin auth locally (using Vercel env vars) so admin login always works.
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

// Simple SHA-256 hasher (Web Crypto)
async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', req.headers?.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token,x-user-email')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  // Read request body as string (safe)
  const body = await new Promise<string>((resolve) => {
    let raw = ''
    req.on('data', (c: Buffer) => { raw += c.toString('utf8') })
    req.on('end', () => resolve(raw))
    req.on('error', () => resolve(''))
  })

  // ===== ADMIN AUTH — handled locally so it never depends on Shogo =====
  if (req.url.startsWith('/api/admin/auth')) {
    try {
      const { email, password } = JSON.parse(body || '{}')
      const adminEmail = process.env.ADMIN_EMAIL
      const adminPassword = process.env.ADMIN_PASSWORD

      if (!adminEmail || !adminPassword) {
        res.status(500).setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Admin credentials not configured' }))
        return
      }
      if (email !== adminEmail || password !== adminPassword) {
        res.status(401).setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Invalid email or password' }))
        return
      }
      const token = await sha256(`${email}:${Date.now()}:${Math.random()}`)
      res.status(200).setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: true, token, email }))
      return
    } catch (e: any) {
      res.status(500).setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: e?.message || 'Admin auth error' }))
      return
    }
  }

  try {
    const targetUrl = `${SHOGO_BACKEND}${req.url}`

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
