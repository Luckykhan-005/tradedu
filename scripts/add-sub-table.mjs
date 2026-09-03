import { createClient } from '@libsql/client'
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN })
try {
  await c.execute(`
    CREATE TABLE IF NOT EXISTS subscription_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT,
      tradeExperience TEXT,
      plan TEXT NOT NULL DEFAULT 'STARTER',
      status TEXT NOT NULL DEFAULT 'inactive',
      receiptUrl TEXT,
      adminNote TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('subscription_requests table ready')
} catch (e) { console.log('error:', e.message) }
process.exit(0)
