// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
import { defineConfig } from 'prisma/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const url = process.env.DATABASE_URL ?? 'file:./dev.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url,
  },
  adapter: async () => new PrismaLibSql({ url, authToken }),
})
