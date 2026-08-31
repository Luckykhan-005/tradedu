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

// Custom API routes (seed, auth, admin, journal, courses)
app.route('/api', customRoutes)

// Export for Vercel serverless
export default app.fetch
