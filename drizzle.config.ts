import * as dotenvx from '@dotenvx/dotenvx';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/server/db/drizzle',
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: dotenvx.get('DATABASE_URL'),
  },
  verbose: true,
  strict: true,
});
