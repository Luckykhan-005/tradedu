// Vercel serverless proxy — forwards /api/* to the Shogo backend
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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', req.headers?.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token,x-user-email')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    const targetUrl = `${SHOGO_BACKEND}${req.url}`

    // Read request body as string(safe)
    const body = await new Promise<string>((resolve) => {
      let raw = ''
      req.on('data', (c: Buffer) => { raw += c.toString('utf8') })
      req.on('end', () => resolve(raw))
      req.on('error', () => resolve(''))
    })

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
