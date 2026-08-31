// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../generated/prisma/client'

// Factory that creates a fresh Prisma client bound to Turso/libSQL.
// Kept as a function so serverless runtimes (Vercel) can init lazily if needed.
export function createPrisma() {
  const url = process.env.DATABASE_URL || 'file:./dev.db'
  const authToken = process.env.DATABASE_AUTH_TOKEN
  const adapter = new PrismaLibSql({ url, authToken })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as { __prisma?: ReturnType<typeof createPrisma> }

export const prisma = globalForPrisma.__prisma ?? createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = prisma
