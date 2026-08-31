// Vercel serverless entry — pure Web API, no framework dependency
export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)

  // Simple health check
  if (url.pathname === '/health' || url.pathname === '/api/health' || url.pathname === '/api/debug') {
    return new Response(
      JSON.stringify({
        ok: true,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasToken: !!process.env.DATABASE_AUTH_TOKEN,
        path: url.pathname,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Proxy everything else to the Hono backend
  try {
    const { default: customRoutes } = await import('../custom-routes')
    const app = customRoutes
    const response = await app.fetch(req)
    // Add CORS headers
    const res = new Response(response.body, response)
    res.headers.set('Access-Control-Allow-Origin', req.headers.get('origin') || '*')
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token,x-user-email')
    return res
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
