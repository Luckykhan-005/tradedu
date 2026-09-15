// Create admin user in the database
// Usage: bun run scripts/create-admin.mjs

import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client.js'

const adapter = new PrismaLibSql({
  url: 'file:./prisma/dev.db',
})

const prisma = new PrismaClient({ adapter })

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function main() {
  const email = 'mk0755698@gmail.com'
  const password = 'Shshsh-7860$@@@#'
  const name = 'Admin'

  const passwordHash = await hashPassword(password)

  // Upsert: create if not exists, update if exists
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'admin',
      name,
    },
    create: {
      email,
      name,
      passwordHash,
      role: 'admin',
    },
  })

  console.log(`✅ Admin user created/updated:`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Name: ${user.name}`)
  console.log(`   Role: ${user.role}`)
  console.log(`   ID: ${user.id}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
