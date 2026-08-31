// Minimal Vercel serverless function — pure Web, no framework deps
export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-admin-token,x-user-email')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  res.status(200).json({
    ok: true,
    path: req.url,
    hasDbUrl: !!process.env.DATABASE_URL,
    hasToken: !!process.env.DATABASE_AUTH_TOKEN,
    message: 'vercel backend function is working',
  })
}
