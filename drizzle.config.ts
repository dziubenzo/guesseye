import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/server/db/drizzle',
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.NODE_ENV === 'development'
        ? process.env.DATABASE_DEV_URL!
        : process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
