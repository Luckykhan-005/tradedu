// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.

let _prisma: any = null
let _promise: Promise<any> | null = null

async function getClient() {
  if (_prisma) return _prisma
  if (!_promise) {
    _promise = (async () => {
      const { PrismaLibSql } = await import('@prisma/adapter-libsql')
      const { PrismaClient } = await import('../generated/prisma/client')
      const url = process.env.DATABASE_URL || 'file:./dev.db'
      const authToken = process.env.DATABASE_AUTH_TOKEN
      const adapter = new PrismaLibSql({ url, authToken })
      _prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
      return _prisma
    })()
  }
  return _promise
}

// Lazy proxy: `prisma.course.findMany(...)` triggers getClient() on first access.
const makeProxy = () =>
  new Proxy(
    {},
    {
      get(_t, prop: string) {
        const client = getClient
        // Top-level model access (course, user, module...) — return a lazy model proxy
        return new Proxy(
          {},
          {
            get(_t2, modelFn: string) {
              return (...args: any[]) => client().then((c: any) => c[prop][modelFn](...args))
            },
          }
        )
      },
    }
  )

export const prisma = makeProxy() as any
