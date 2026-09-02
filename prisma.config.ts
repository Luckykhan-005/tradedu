// Managed by Shogo. `prisma db push` (Prisma 7) requires `datasource.url`; do not move the URL under `migrate` or an `async url()` resolver.
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
})
