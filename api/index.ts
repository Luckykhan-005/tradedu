// Vercel serverless proxy — forwards /api/* to the Shogo backend
// This keeps frontend (Vercel) and API same-origin, eliminating CORS issues.

const SHOGO_BACKEND = 'https://f433563c-b214-4c91-81ec-8db56a59a1b4.preview.shogo.ai'

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

    // Read the request body (if any)
    const body = await new Promise<Buffer | null>((resolve) => {
      const chunks: Buffer[] = []
      let size = 0
      req.on('data', (c: Buffer) => { chunks.push(c); size += c.length })
      req.on('end', () => resolve(size ? Buffer.concat(chunks) : null))
      req.on('error', () => resolve(null))
    })

    const headers: Record<string, string> = {}
    Object.keys(req.headers).forEach((k) => {
      const lower = k.toLowerCase()
      if (['host', 'connection', 'accept-encoding', 'content-length'].includes(lower)) return
      headers[k] = req.headers[k]
    })

    const hasBody = body && body.length > 0
    const options: RequestInit = { method: req.method, headers }
    if (hasBody) {
      options.body = body
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
