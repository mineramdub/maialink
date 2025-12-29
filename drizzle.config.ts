import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_vgtpYy61uCWQ@ep-broad-silence-af1gq2v4-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require',
  },
})
