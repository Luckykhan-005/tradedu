// Vercel serverless entry point — runs the Hono backend
import { Hono } from 'hono'

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
app.get('/api/debug', async (c) => {
  return c.json({ ok: true, hasDbUrl: !!process.env.DATABASE_URL, hasToken: !!process.env.DATABASE_AUTH_TOKEN })
})

// Custom API routes loaded lazily so module-load doesn't crash in serverless
const customRoutes = await import('../custom-routes')
app.route('/api', customRoutes.default)

// Global error handler — returns the real error message instead of a bare 500
app.onError((err, c) => {
  console.error('API Error:', err)
  return c.json({ error: err?.message || 'Internal Server Error' }, 500)
})

// Export for Vercel serverless
export default app.fetch
