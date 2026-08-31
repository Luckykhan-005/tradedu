// Vercel serverless entry — pure Web handler for the Hono backend
import customRoutes from './custom-routes'

const cors = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-admin-token,x-user-email',
  'Access-Control-Max-Age': '86400',
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors)
    res.end()
    return
  }

  try {
    const url = `https://${req.headers.host}${req.url}`
    const headers = new Headers()
    Object.keys(req.headers).forEach((k) => headers.set(k, req.headers[k]))
    const request = new Request(url, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
    })

    const response = await customRoutes.fetch(request)
    const body = await response.text()

    res.writeHead(response.status, {
      ...cors,
      'Content-Type': response.headers.get('content-type') || 'application/json',
    })
    res.end(body)
  } catch (e: any) {
    console.error('API Error:', e)
    res.writeHead(500, cors)
    res.end(JSON.stringify({ error: e?.message || 'Internal Server Error' }))
  }
}
