import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'

const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!url) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const client = createClient({ url, authToken })
const sql = readFileSync('turso-schema.sql', 'utf8')

async function run() {
  try {
    const lines = sql.split('\n')
    let current = []
    const statements = []
    for (const line of lines) {
      current.push(line)
      if (line.trim().endsWith(');')) {
        statements.push(current.join('\n'))
        current = []
      }
    }
    if (current.join('').trim()) statements.push(current.join('\n'))

    let count = 0
    const created = []
    for (const stmt of statements) {
      const clean = stmt.trim()
      if (!clean.toUpperCase().includes('CREATE TABLE')) continue
      const tableName = clean.match(/CREATE TABLE\s+"(\w+)"/)?.[1]
      if (!tableName) continue
      const result = await client.execute(clean)
      created.push(tableName)
      count++
      console.log(`✓ Table: ${tableName}`)
    }
    console.log(`\nDone. ${count} tables created: ${created.join(', ')}`)
  } catch (e) {
    console.error('Error:', e?.message || e)
    process.exit(1)
  }
}

run()
