import { createClient } from '@libsql/client'
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN })
try { await c.execute("ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'FREE'"); console.log('users.plan added') } catch (e) { console.log('users.plan:', e.message) }
try { await c.execute("ALTER TABLE lessons ADD COLUMN isFree INTEGER NOT NULL DEFAULT 0"); console.log('lessons.isFree added') } catch (e) { console.log('lessons.isFree:', e.message) }
try { await c.execute("ALTER TABLE live_sessions ADD COLUMN plan TEXT NOT NULL DEFAULT 'PREMIUM'"); console.log('live_sessions.plan added') } catch (e) { console.log('live_sessions.plan:', e.message) }
process.exit(0)
