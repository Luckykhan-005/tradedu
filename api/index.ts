// Vercel serverless entry point — runs the Hono backend
import { Hono } from 'hono'
import customRoutes from '../custom-routes'

const app = new Hono()

// CORS — allow all origins (frontend + backend are the same domain in production)
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin') || '*'
  c.header('Access-Control-Allow-Origin', origin)
  c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token,x-user-email')
  c.header('Access-Control-Max-Age', '86400')
  if (c.req.method === 'OPTIONS') return c.body(null, 204)
  await next()
})

// Health check
app.get('/health', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }))

// Diagnostic — check if adapter/prisma can be loaded
app.get('/api/debug', async (c) => {
  const report: Record<string, string> = {}
  try {
    report.adapter = 'loaded'
  } catch (e: any) {
    report.adapter = `ERR: ${e?.message}`
  }
  report.env = {
    hasDbUrl: !!process.env.DATABASE_URL,
    hasToken: !!process.env.DATABASE_AUTH_TOKEN,
  } as any
  return c.json(report)
})

// Custom API routes (login, signup, courses, journal, etc.)
app.route('/api', customRoutes)

// Global error handler — returns the real error message instead of a bare 500
app.onError((err, c) => {
  console.error('API Error:', err)
  return c.json({ error: err?.message || 'Internal Server Error' }, 500)
})

// Export for Vercel serverless
export default app.fetch
